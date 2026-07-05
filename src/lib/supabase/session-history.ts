/**
 * Session History Service
 * 
 * Handles fetching and filtering typing session history.
 */

import { createSupabaseBrowserClient } from "./client";
import type {
  SessionHistoryItem,
  SessionHistoryFilter,
  SessionHistoryResult,
} from "@/lib/session-lifecycle";

/**
 * Get user's session history with filtering and pagination
 */
export async function getSessionHistory(
  userId: string,
  filter: SessionHistoryFilter = {},
  page: number = 1,
  pageSize: number = 20
): Promise<SessionHistoryResult> {
  try {
    const supabase = createSupabaseBrowserClient();
    
    // Build query
    let query = supabase
      .from("typing_sessions")
      .select("*", { count: "exact" })
      .eq("user_id", userId);

    // Apply filters
    if (filter.mode && filter.mode.length > 0) {
      query = query.in("practice_mode", filter.mode);
    }

    if (filter.dateFrom) {
      query = query.gte("completed_at", filter.dateFrom);
    }

    if (filter.dateTo) {
      query = query.lte("completed_at", filter.dateTo);
    }

    if (filter.minWpm !== undefined) {
      query = query.gte("final_wpm", filter.minWpm);
    }

    if (filter.maxWpm !== undefined) {
      query = query.lte("final_wpm", filter.maxWpm);
    }

    if (filter.minAccuracy !== undefined) {
      query = query.gte("final_accuracy", filter.minAccuracy);
    }

    // Apply sorting
    const sortBy = filter.sortBy || "date";
    const sortOrder = filter.sortOrder || "desc";

    const sortField = {
      date: "completed_at",
      wpm: "final_wpm",
      accuracy: "final_accuracy",
      duration: "duration",
    }[sortBy];

    query = query.order(sortField, { ascending: sortOrder === "asc" });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform to SessionHistoryItem
    const sessions: SessionHistoryItem[] = (data || []).map((session: any) => ({
      id: session.id,
      date: session.completed_at,
      duration: session.duration,
      mode: session.practice_mode,
      wpm: session.final_wpm,
      accuracy: session.final_accuracy,
      consistency: session.consistency,
      peakWpm: session.peak_wpm,
      mistakes: Array.isArray(session.mistakes) ? session.mistakes.length : 0,
      isPersonalBest: false, // TODO: Calculate based on user stats
    }));

    return {
      sessions,
      totalCount: count || 0,
      page,
      pageSize,
      hasMore: (count || 0) > page * pageSize,
    };
  } catch (error) {
    console.error("Error fetching session history:", error);
    return {
      sessions: [],
      totalCount: 0,
      page,
      pageSize,
      hasMore: false,
    };
  }
}

/**
 * Get session by ID
 */
export async function getSessionById(sessionId: string) {
  try {
    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase
      .from("typing_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching session:", error);
    return { data: null, error: error as Error };
  }
}

/**
 * Delete session
 */
export async function deleteSession(sessionId: string) {
  try {
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase
      .from("typing_sessions")
      .delete()
      .eq("id", sessionId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting session:", error);
    return { success: false, error: error as Error };
  }
}

/**
 * Get session statistics summary
 */
export async function getSessionStatsSummary(
  userId: string,
  dateFrom?: string,
  dateTo?: string
) {
  try {
    const supabase = createSupabaseBrowserClient();

    let query = supabase
      .from("typing_sessions")
      .select("final_wpm, final_accuracy, duration, completed_at")
      .eq("user_id", userId);

    if (dateFrom) {
      query = query.gte("completed_at", dateFrom);
    }

    if (dateTo) {
      query = query.lte("completed_at", dateTo);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        avgWpm: 0,
        avgAccuracy: 0,
        totalSessions: 0,
        totalDuration: 0,
        bestWpm: 0,
        error: null,
      };
    }

    const avgWpm = data.reduce((sum: number, s: any) => sum + s.final_wpm, 0) / data.length;
    const avgAccuracy =
      data.reduce((sum: number, s: any) => sum + s.final_accuracy, 0) / data.length;
    const totalDuration = data.reduce((sum: number, s: any) => sum + s.duration, 0);
    const bestWpm = Math.max(...data.map((s: any) => s.final_wpm));

    return {
      avgWpm,
      avgAccuracy,
      totalSessions: data.length,
      totalDuration,
      bestWpm,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching session stats summary:", error);
    return {
      avgWpm: 0,
      avgAccuracy: 0,
      totalSessions: 0,
      totalDuration: 0,
      bestWpm: 0,
      error: error as Error,
    };
  }
}
