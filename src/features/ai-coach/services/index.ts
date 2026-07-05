/**
 * AI Coach Services Orchestrator
 * 
 * Main entry point for all AI Coach functionality.
 * Coordinates data aggregation, AI generation, caching, and fallbacks.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { DataAggregationService } from "./data-aggregation.service";
import { AiCoachService } from "./ai-coach.service";
import { AiCacheService } from "./cache.service";
import { FallbackRecommendationService } from "./fallback.service";
import type {
  DailyPracticePlan,
  WeeklyProgressReport,
  SmartGoalRecommendation,
  AiInsightData,
  SessionAnalysisResult,
  LessonGenerationRequest,
  GeneratedLessonContent,
  AiGenerationOptions,
} from "../types";

export class AiCoachOrchestrator {
  private dataService: DataAggregationService;
  private aiService: AiCoachService;
  private cacheService: AiCacheService;
  private fallbackService: FallbackRecommendationService;

  constructor(private supabase: SupabaseClient<Database>) {
    this.dataService = new DataAggregationService(supabase);
    this.aiService = new AiCoachService();
    this.cacheService = new AiCacheService(supabase);
    this.fallbackService = new FallbackRecommendationService();
  }

  /**
   * Analyze a completed session with AI
   */
  async analyzeSession(
    userId: string,
    sessionData: {
      sessionId: string;
      wpm: number;
      accuracy: number;
      consistency: number;
      mistakes: unknown[];
      duration: number;
      mode: string;
    },
    options?: AiGenerationOptions,
  ): Promise<SessionAnalysisResult> {
    try {
      const userData = await this.dataService.aggregateUserData(userId);
      return await this.aiService.analyzeSession(sessionData, userData, options);
    } catch (error) {
      console.error("AI session analysis failed:", error);
      // Fallback to basic analysis
      return {
        sessionId: sessionData.sessionId,
        score: (sessionData.wpm + sessionData.accuracy) / 2,
        strengths: ["Session completed"],
        weaknesses: [],
        improvements: [],
        suggestions: ["Keep practicing regularly"],
        comparisonToPrevious: {
          wpmChange: 0,
          accuracyChange: 0,
          consistencyChange: 0,
        },
        nextSteps: ["Continue your practice routine"],
      };
    }
  }

  /**
   * Generate daily practice plan with caching and fallback
   */
  async generateDailyPlan(
    userId: string,
    options?: AiGenerationOptions & { forceRefresh?: boolean },
  ): Promise<{
    plan: DailyPracticePlan;
    source: "ai" | "cache" | "fallback";
    cachedAt?: Date;
  }> {
    const cacheKey = "daily_plan";
    const dateStr = new Date().toISOString().split("T")[0];
    const cacheParams = { date: dateStr ?? "" };

    // Check cache first unless force refresh
    if (!options?.forceRefresh && options?.useCache !== false) {
      const cached = await this.cacheService.get<DailyPracticePlan>(
        userId,
        cacheKey,
        cacheParams,
      );
      if (cached) {
        return {
          plan: cached.data,
          source: "cache",
          cachedAt: cached.metadata.computedAt,
        };
      }
    }

    try {
      // Try AI generation
      const userData = await this.dataService.aggregateUserData(userId);
      const plan = await this.aiService.generateDailyPracticePlan(userData, options);

      // Cache the result (24 hour expiration)
      if (options?.useCache !== false) {
        await this.cacheService.set(
          userId,
          cacheKey,
          plan,
          cacheParams,
          60 * 24,
          options?.provider ?? "groq",
        );
      }

      return { plan, source: "ai" };
    } catch (error) {
      console.error("AI daily plan generation failed:", error);

      // Fallback to rule-based recommendations
      const userData = await this.dataService.aggregateUserData(userId);
      const { plan } = this.fallbackService.generateDailyPlan(userData);
      return { plan, source: "fallback" };
    }
  }

  /**
   * Generate weekly progress report
   */
  async generateWeeklyReport(
    userId: string,
    weekData?: { weekStart: Date; weekEnd: Date },
    options?: AiGenerationOptions,
  ): Promise<{
    report: WeeklyProgressReport;
    source: "ai" | "cache" | "fallback";
  }> {
    const defaultWeekData = weekData || {
      weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      weekEnd: new Date(),
    };

    const cacheKey = "weekly_report";
    const cacheParams = {
      weekStart: defaultWeekData.weekStart.toISOString(),
      weekEnd: defaultWeekData.weekEnd.toISOString(),
    };

    // Check cache
    if (options?.useCache !== false) {
      const cached = await this.cacheService.get<WeeklyProgressReport>(
        userId,
        cacheKey,
        cacheParams,
      );
      if (cached) {
        return { report: cached.data, source: "cache" };
      }
    }

    try {
      const userData = await this.dataService.aggregateUserData(
        userId,
        { start: defaultWeekData.weekStart, end: defaultWeekData.weekEnd },
      );
      const report = await this.aiService.generateWeeklyReport(
        userData,
        defaultWeekData,
        options,
      );

      // Cache for 7 days
      if (options?.useCache !== false) {
        await this.cacheService.set(
          userId,
          cacheKey,
          report,
          cacheParams,
          60 * 24 * 7,
          options?.provider ?? "groq",
        );
      }

      return { report, source: "ai" };
    } catch (error) {
      console.error("AI weekly report generation failed:", error);

      const weekStartStr = defaultWeekData.weekStart.toISOString().split("T")[0];
      const weekEndStr = defaultWeekData.weekEnd.toISOString().split("T")[0];
      
      // Basic fallback report
      const report: WeeklyProgressReport = {
        weekStart: weekStartStr ?? "",
        weekEnd: weekEndStr ?? "",
        summary: "You practiced this week. Keep it up!",
        typingProgress: {
          averageWpm: 0,
          averageAccuracy: 0,
          wpmChange: 0,
          accuracyChange: 0,
          totalSessions: 0,
          totalTime: 0,
          bestSession: { wpm: 0, accuracy: 0, date: "" },
        },
        codingProgress: {
          totalSessions: 0,
          totalTime: 0,
          languagesPracticed: [],
          averageScore: 0,
          scoreChange: 0,
        },
        achievements: [],
        challenges: [],
        nextWeekGoals: [],
        insights: [],
      };

      return { report, source: "fallback" };
    }
  }

  /**
   * Generate goal recommendations
   */
  async generateGoalRecommendations(
    userId: string,
    count: number = 3,
    options?: AiGenerationOptions,
  ): Promise<{
    goals: SmartGoalRecommendation[];
    source: "ai" | "cache" | "fallback";
  }> {
    const cacheKey = "goal_recommendations";
    const cacheParams = { count };

    // Check cache
    if (options?.useCache !== false) {
      const cached = await this.cacheService.get<SmartGoalRecommendation[]>(
        userId,
        cacheKey,
        cacheParams,
      );
      if (cached) {
        return { goals: cached.data, source: "cache" };
      }
    }

    try {
      const userData = await this.dataService.aggregateUserData(userId);
      const goals = await this.aiService.generateGoalRecommendations(
        userData,
        count,
        options,
      );

      // Cache for 3 days
      if (options?.useCache !== false) {
        await this.cacheService.set(
          userId,
          cacheKey,
          goals,
          cacheParams,
          60 * 24 * 3,
          options?.provider ?? "groq",
        );
      }

      return { goals, source: "ai" };
    } catch (error) {
      console.error("AI goal recommendations failed:", error);

      const userData = await this.dataService.aggregateUserData(userId);
      const { goals } = this.fallbackService.generateGoalRecommendations(
        userData,
        count,
      );
      return { goals, source: "fallback" };
    }
  }

  /**
   * Generate custom lesson
   */
  async generateLesson(
    userId: string,
    request: LessonGenerationRequest,
    options?: AiGenerationOptions,
  ): Promise<GeneratedLessonContent> {
    const userData = await this.dataService.aggregateUserData(userId);
    return await this.aiService.generateLesson(request, userData, options);
  }

  /**
   * Generate insights
   */
  async generateInsights(
    userId: string,
    options?: AiGenerationOptions,
  ): Promise<{
    insights: AiInsightData[];
    source: "ai" | "cache" | "fallback";
  }> {
    const cacheKey = "insights";
    const dateStr = new Date().toISOString().split("T")[0];
    const cacheParams = { date: dateStr ?? "" };

    // Check cache (30 minute expiration for insights)
    if (options?.useCache !== false) {
      const cached = await this.cacheService.get<AiInsightData[]>(
        userId,
        cacheKey,
        cacheParams,
      );
      if (cached && await this.cacheService.isFresh(userId, cacheKey, cacheParams, 30)) {
        return { insights: cached.data, source: "cache" };
      }
    }

    try {
      const userData = await this.dataService.aggregateUserData(userId);
      const insights = await this.aiService.generateInsights(userData, options);

      // Cache for 30 minutes
      if (options?.useCache !== false) {
        await this.cacheService.set(
          userId,
          cacheKey,
          insights,
          cacheParams,
          30,
          options?.provider ?? "groq",
        );
      }

      return { insights, source: "ai" };
    } catch (error) {
      console.error("AI insights generation failed:", error);

      const userData = await this.dataService.aggregateUserData(userId);
      const { insights } = this.fallbackService.generateInsights(userData);
      return { insights, source: "fallback" };
    }
  }

  /**
   * Invalidate all caches for user
   */
  async invalidateCache(userId: string, insightType?: string): Promise<void> {
    await this.cacheService.invalidate(userId, insightType);
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(userId: string) {
    return await this.cacheService.getStats(userId);
  }
}

// Export all services
export * from "./data-aggregation.service";
export * from "./ai-coach.service";
export * from "./cache.service";
export * from "./fallback.service";
