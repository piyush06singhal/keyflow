"use client";

import { useCallback, useState } from "react";
import type {
  AiInsightData,
  AiUserPreferences,
  DailyPracticePlan,
  GeneratedLessonContent,
  LessonGenerationRequest,
  SessionAnalysisResult,
  SmartGoalRecommendation,
  WeeklyProgressReport,
} from "@/features/ai-coach/types";
import {
  fetchAiPreferences,
  fetchAiInsights,
  fetchDailyPracticePlan,
  fetchWeeklyReport,
  fetchGoalRecommendations,
  generateAiLesson,
  analyzePracticeSession,
  updateAiPreferences,
  fetchRecommendations,
  fetchReports,
  fetchLessons,
  fetchAiGoals,
  acceptGoalRecommendation,
  updateRecommendation,
  invalidateAiCache,
} from "@/features/ai-coach/actions";

export function useAiCoach() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"ai" | "cache" | "fallback" | null>(null);

  const run = useCallback(
    async <T,>(action: () => Promise<{ success: boolean; data?: T; error?: string; source?: string }>) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await action();
        if (!result.success) {
          setError(result.error ?? "Request failed");
          return null;
        }
        if (result.source) {
          setSource(result.source as "ai" | "cache" | "fallback");
        }
        return result.data ?? null;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    error,
    source,
    clearError: () => setError(null),

    getPreferences: () => run<AiUserPreferences>(() => fetchAiPreferences()),

    updatePreferences: (updates: Partial<AiUserPreferences>) =>
      run(() => updateAiPreferences(updates)),

    getInsights: () =>
      run<{ insights: AiInsightData[]; source: "ai" | "cache" | "fallback" }>(() =>
        fetchAiInsights(),
      ),

    getDailyPlan: (forceRefresh?: boolean) =>
      run<{ plan: DailyPracticePlan; source: "ai" | "cache" | "fallback" }>(() =>
        fetchDailyPracticePlan({ forceRefresh }),
      ),

    getWeeklyReport: () =>
      run<{ report: WeeklyProgressReport; source: "ai" | "cache" | "fallback" }>(() =>
        fetchWeeklyReport(),
      ),

    getGoalRecommendations: (count?: number) =>
      run<{ goals: SmartGoalRecommendation[]; source: "ai" | "cache" | "fallback" }>(() =>
        fetchGoalRecommendations(count),
      ),

    generateLesson: (request: LessonGenerationRequest) =>
      run<GeneratedLessonContent>(() => generateAiLesson(request)),

    analyzeSession: (sessionData: Parameters<typeof analyzePracticeSession>[0]) =>
      run<SessionAnalysisResult>(() => analyzePracticeSession(sessionData)),

    getRecommendations: () => run(() => fetchRecommendations()),

    getReports: () => run(() => fetchReports()),

    getLessons: () => run(() => fetchLessons()),

    getGoals: () => run(() => fetchAiGoals()),

    acceptGoal: (goal: Parameters<typeof acceptGoalRecommendation>[0]) =>
      run(() => acceptGoalRecommendation(goal)),

    updateRecommendationStatus: (
      id: string,
      status: Parameters<typeof updateRecommendation>[1],
    ) => run(() => updateRecommendation(id, status)),

    invalidateCache: (insightType?: string) =>
      run(() => invalidateAiCache(insightType)),
  };
}

export type UseAiCoachReturn = ReturnType<typeof useAiCoach>;
