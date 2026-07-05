"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import {
  getAiUserPreferences,
  upsertAiUserPreferences,
  getActiveRecommendations,
  updateRecommendationStatus,
  getPerformanceReports,
  savePerformanceReport,
  getGeneratedLessons,
  saveGeneratedLesson,
  getActiveGoals,
  saveAiGoal,
  isAiEnabledForUser,
} from "@/lib/supabase/ai-coach";
import {
  PracticePlanner,
  WeeklyReportGenerator,
  GoalRecommendationEngine,
  LessonGenerator,
  InsightGenerator,
  SessionAnalyzer,
} from "@/features/ai-coach/engines";
import type {
  AiGenerationOptions,
  AiUserPreferencesUpdate,
  LessonGenerationRequest,
  RecommendationStatus,
  SessionAnalysisResult,
} from "@/features/ai-coach/types";

export type AiActionResult<T> =
  | { success: true; data: T; source?: "ai" | "cache" | "fallback" }
  | { success: false; error: string };

async function withAuth<T>(
  fn: (userId: string, supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) => Promise<T>,
): Promise<AiActionResult<T>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabase = await createSupabaseServerClient();
    const data = await fn(user.id, supabase);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function fetchAiPreferences(): Promise<
  AiActionResult<Awaited<ReturnType<typeof getAiUserPreferences>>>
> {
  return withAuth(async (userId) => getAiUserPreferences(userId));
}

export async function updateAiPreferences(
  updates: AiUserPreferencesUpdate,
): Promise<AiActionResult<Awaited<ReturnType<typeof upsertAiUserPreferences>>>> {
  return withAuth(async (userId) => upsertAiUserPreferences(userId, updates));
}

export async function fetchDailyPracticePlan(options?: {
  forceRefresh?: boolean;
}): Promise<
  AiActionResult<{
    plan: Awaited<ReturnType<PracticePlanner["getDailyPlan"]>>["plan"];
    source: "ai" | "cache" | "fallback";
    cachedAt?: Date;
  }>
> {
  return withAuth(async (userId, supabase) => {
    const enabled = await isAiEnabledForUser(userId);
    if (!enabled) {
      const planner = new PracticePlanner(supabase);
      const result = await planner.getDailyPlan(userId, { useCache: false });
      return { ...result, source: "fallback" as const };
    }

    const planner = new PracticePlanner(supabase);
    return planner.getDailyPlan(userId, {
      forceRefresh: options?.forceRefresh,
      provider: "groq",
    });
  });
}

export async function fetchWeeklyReport(): Promise<
  AiActionResult<{
    report: Awaited<ReturnType<WeeklyReportGenerator["generate"]>>["report"];
    source: "ai" | "cache" | "fallback";
  }>
> {
  return withAuth(async (userId, supabase) => {
    const generator = new WeeklyReportGenerator(supabase);
    const result = await generator.generate(userId, undefined, { provider: "groq" });

    if (result.source === "ai") {
      await savePerformanceReport(userId, {
        report_type: "weekly_summary",
        period_start: result.report.weekStart,
        period_end: result.report.weekEnd,
        title: `Weekly Report: ${result.report.weekStart}`,
        summary: result.report.summary,
        strengths: result.report.achievements,
        weaknesses: result.report.challenges,
        improvements: result.report.insights,
        recommendations: result.report.nextWeekGoals,
        metrics_analyzed: {
          typing: result.report.typingProgress,
          coding: result.report.codingProgress,
        },
        ai_provider: "groq",
      });
    }

    return result;
  });
}

export async function fetchGoalRecommendations(count = 3): Promise<
  AiActionResult<{
    goals: Awaited<ReturnType<GoalRecommendationEngine["recommend"]>>["goals"];
    source: "ai" | "cache" | "fallback";
  }>
> {
  return withAuth(async (userId, supabase) => {
    const engine = new GoalRecommendationEngine(supabase);
    return engine.recommend(userId, count, { provider: "groq" });
  });
}

export async function fetchAiInsights(): Promise<
  AiActionResult<{
    insights: Awaited<ReturnType<InsightGenerator["generate"]>>["insights"];
    source: "ai" | "cache" | "fallback";
  }>
> {
  return withAuth(async (userId, supabase) => {
    const generator = new InsightGenerator(supabase);
    return generator.generate(userId, { provider: "groq" });
  });
}

export async function generateAiLesson(
  request: LessonGenerationRequest,
  options?: AiGenerationOptions,
): Promise<
  AiActionResult<Awaited<ReturnType<LessonGenerator["generate"]>>>
> {
  return withAuth(async (userId, supabase) => {
    const generator = new LessonGenerator(supabase);
    const content = await generator.generate(userId, request, {
      ...options,
      provider: "groq",
    });

    await saveGeneratedLesson(userId, {
      lesson_type: request.lessonType,
      title: content.title,
      description: content.description,
      difficulty: request.difficulty,
      target_skills: request.targetSkills,
      target_weaknesses: request.targetWeaknesses ?? null,
      content: content.content,
      language: request.language ?? null,
      framework: request.framework ?? null,
      estimated_duration: content.estimatedDuration,
      practice_config: content.practiceConfig as any,
      ai_provider: "groq",
    });

    return content;
  });
}

export async function analyzePracticeSession(sessionData: {
  sessionId: string;
  wpm: number;
  accuracy: number;
  consistency: number;
  mistakes: unknown[];
  duration: number;
  mode: string;
}): Promise<AiActionResult<SessionAnalysisResult>> {
  return withAuth(async (userId, supabase) => {
    const enabled = await isAiEnabledForUser(userId);
    if (!enabled) {
      return {
        sessionId: sessionData.sessionId,
        score: (sessionData.wpm + sessionData.accuracy) / 2,
        strengths: ["Session completed successfully"],
        weaknesses: [],
        improvements: [],
        suggestions: ["Keep practicing regularly"],
        comparisonToPrevious: { wpmChange: 0, accuracyChange: 0, consistencyChange: 0 },
        nextSteps: ["Continue your practice routine"],
      };
    }

    const analyzer = new SessionAnalyzer(supabase);
    return analyzer.analyze(userId, sessionData, { provider: "groq" });
  });
}

export async function fetchRecommendations() {
  return withAuth(async (userId) => getActiveRecommendations(userId));
}

export async function fetchReports() {
  return withAuth(async (userId) => getPerformanceReports(userId));
}

export async function fetchLessons() {
  return withAuth(async (userId) => getGeneratedLessons(userId));
}

export async function fetchAiGoals() {
  return withAuth(async (userId) => getActiveGoals(userId));
}

export async function acceptGoalRecommendation(
  goal: Parameters<typeof saveAiGoal>[1],
) {
  return withAuth(async (userId) =>
    saveAiGoal(userId, { ...goal, is_ai_recommended: true }),
  );
}

export async function updateRecommendation(
  recommendationId: string,
  status: RecommendationStatus,
) {
  return withAuth(async (userId) =>
    updateRecommendationStatus(userId, recommendationId, status),
  );
}

export async function invalidateAiCache(insightType?: string) {
  return withAuth(async (userId, supabase) => {
    const { AiCoachOrchestrator } = await import("@/features/ai-coach/engines");
    const orchestrator = new AiCoachOrchestrator(supabase);
    await orchestrator.invalidateCache(userId, insightType);
    return { invalidated: true };
  });
}
