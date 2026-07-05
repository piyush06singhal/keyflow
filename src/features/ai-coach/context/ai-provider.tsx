"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AiUserPreferences } from "@/features/ai-coach/types";
import {
  fetchAiPreferences,
  fetchAiInsights,
  fetchDailyPracticePlan,
} from "@/features/ai-coach/actions";
import type { AiInsightData, DailyPracticePlan } from "@/features/ai-coach/types";

type AiSource = "ai" | "cache" | "fallback" | "unknown";

interface AiCoachContextValue {
  preferences: AiUserPreferences | null;
  aiEnabled: boolean;
  insights: AiInsightData[];
  dailyPlan: DailyPracticePlan | null;
  source: AiSource;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refreshPlan: (force?: boolean) => Promise<void>;
}

const AiCoachContext = createContext<AiCoachContextValue | null>(null);

export function AiCoachProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<AiUserPreferences | null>(null);
  const [insights, setInsights] = useState<AiInsightData[]>([]);
  const [dailyPlan, setDailyPlan] = useState<DailyPracticePlan | null>(null);
  const [source, setSource] = useState<AiSource>("unknown");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPlan = useCallback(async (force = false) => {
    const result = await fetchDailyPracticePlan({ forceRefresh: force });
    if (result.success) {
      setDailyPlan(result.data.plan);
      setSource(result.data.source);
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [prefsResult, insightsResult, planResult] = await Promise.all([
        fetchAiPreferences(),
        fetchAiInsights(),
        fetchDailyPracticePlan(),
      ]);

      if (prefsResult.success) {
        setPreferences(prefsResult.data);
      }

      if (insightsResult.success) {
        setInsights(insightsResult.data.insights);
        setSource(insightsResult.data.source);
      } else {
        setError(insightsResult.error);
      }

      if (planResult.success) {
        setDailyPlan(planResult.data.plan);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load AI coach data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      preferences,
      aiEnabled: preferences?.ai_enabled ?? true,
      insights,
      dailyPlan,
      source,
      isLoading,
      error,
      refresh,
      refreshPlan,
    }),
    [preferences, insights, dailyPlan, source, isLoading, error, refresh, refreshPlan],
  );

  return <AiCoachContext.Provider value={value}>{children}</AiCoachContext.Provider>;
}

export function useAiCoachContext() {
  const context = useContext(AiCoachContext);
  if (!context) {
    throw new Error("useAiCoachContext must be used within AiCoachProvider");
  }
  return context;
}
