/**
 * AI Coach Cache Service
 *
 * Manages intelligent caching of AI-generated content to reduce API calls
 * and improve response times.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CachedInsight } from "../types";

export class AiCacheService {
  constructor(private supabase: SupabaseClient<any>) {}

  /**
   * Generate cache key from parameters
   */
  private generateCacheKey(
    insightType: string,
    params: Record<string, unknown>,
  ): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${JSON.stringify(params[key])}`)
      .join("|");
    return `${insightType}:${sortedParams}`;
  }

  /**
   * Get cached insight if available and not expired
   */
  async get<T = unknown>(
    userId: string,
    insightType: string,
    params: Record<string, unknown> = {},
  ): Promise<CachedInsight<T> | null> {
    const cacheKey = this.generateCacheKey(insightType, params);

    const { data, error } = await this.supabase
      .from("ai_insights_cache")
      .select("*")
      .eq("user_id", userId)
      .eq("insight_type", insightType)
      .eq("cache_key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .order("computed_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    // Update access tracking
    await this.supabase
      .from("ai_insights_cache")
      // @ts-ignore - Table types not properly generated
      .update({
        access_count: (data.access_count ?? 0) + 1,
        last_accessed_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    return {
      data: data.insight_data as T,
      metadata: {
        key: cacheKey,
        expiresAt: new Date(data.expires_at),
        provider: data.ai_provider,
        computedAt: new Date(data.computed_at),
      },
    };
  }

  /**
   * Store insight in cache
   */
  async set<T = unknown>(
    userId: string,
    insightType: string,
    data: T,
    params: Record<string, unknown> = {},
    expirationMinutes: number = 60,
    provider: string = "groq",
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(insightType, params);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

    // @ts-ignore - Table types not properly generated
    await this.supabase.from("ai_insights_cache").insert([
      {
        user_id: userId,
        insight_type: insightType,
        cache_key: cacheKey,
        insight_data: data as unknown,
        ai_provider: provider,
        expires_at: expiresAt.toISOString(),
      },
    ]);
  }

  /**
   * Invalidate cache for specific insight type
   */
  async invalidate(userId: string, insightType?: string): Promise<void> {
    let query = this.supabase.from("ai_insights_cache").delete().eq("user_id", userId);

    if (insightType) {
      query = query.eq("insight_type", insightType);
    }

    await query;
  }

  /**
   * Clean expired cache entries
   */
  async cleanExpired(): Promise<number> {
    const { data, error } = await this.supabase
      .from("ai_insights_cache")
      .delete()
      .lt("expires_at", new Date().toISOString())
      .select("id");

    if (error) return 0;
    return data?.length || 0;
  }

  /**
   * Get cache statistics
   */
  async getStats(userId: string): Promise<{
    totalEntries: number;
    validEntries: number;
    expiredEntries: number;
    mostAccessedType: string | null;
    totalHits: number;
  }> {
    const now = new Date().toISOString();

    const { data: all } = (await this.supabase
      .from("ai_insights_cache")
      .select("insight_type, access_count, expires_at")
      .eq("user_id", userId)) as {
      data: Array<{
        insight_type: string;
        access_count: number;
        expires_at: string;
      }> | null;
    };

    if (!all || all.length === 0) {
      return {
        totalEntries: 0,
        validEntries: 0,
        expiredEntries: 0,
        mostAccessedType: null,
        totalHits: 0,
      };
    }

    const valid = all.filter((entry) => entry.expires_at > now);
    const expired = all.length - valid.length;

    const typeHits: Record<string, number> = {};
    let totalHits = 0;

    all.forEach((entry) => {
      totalHits += entry.access_count;
      const currentType = entry.insight_type;
      typeHits[currentType] = (typeHits[currentType] ?? 0) + entry.access_count;
    });

    const mostAccessedType =
      Object.keys(typeHits).length > 0
        ? (Object.entries(typeHits).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null)
        : null;

    return {
      totalEntries: all.length,
      validEntries: valid.length,
      expiredEntries: expired,
      mostAccessedType,
      totalHits,
    };
  }

  /**
   * Check if cached data exists and is fresh
   */
  async isFresh(
    userId: string,
    insightType: string,
    params: Record<string, unknown> = {},
    maxAgeMinutes: number = 60,
  ): Promise<boolean> {
    const cacheKey = this.generateCacheKey(insightType, params);
    const minComputedAt = new Date();
    minComputedAt.setMinutes(minComputedAt.getMinutes() - maxAgeMinutes);

    const { data } = await this.supabase
      .from("ai_insights_cache")
      .select("computed_at")
      .eq("user_id", userId)
      .eq("insight_type", insightType)
      .eq("cache_key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .gt("computed_at", minComputedAt.toISOString())
      .limit(1)
      .single();

    return !!data;
  }
}
