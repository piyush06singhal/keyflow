/**
 * Specialized AI Coach engines — thin wrappers over AiCoachOrchestrator.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { AiCoachOrchestrator } from "../services";
import type {
  AiGenerationOptions,
  AiInsightData,
  DailyPracticePlan,
  GeneratedLessonContent,
  LessonGenerationRequest,
  SessionAnalysisResult,
  SmartGoalRecommendation,
  WeeklyProgressReport,
} from "../types";

export class RecommendationEngine {
  private orchestrator: AiCoachOrchestrator;

  constructor(supabase: SupabaseClient<Database>) {
    this.orchestrator = new AiCoachOrchestrator(supabase);
  }

  async getDailyRecommendations(
    userId: string,
    options?: AiGenerationOptions & { forceRefresh?: boolean },
  ) {
    return this.orchestrator.generateDailyPlan(userId, options);
  }

  async getInsights(userId: string, options?: AiGenerationOptions) {
    return this.orchestrator.generateInsights(userId, options);
  }
}

export class PracticePlanner {
  private orchestrator: AiCoachOrchestrator;

  constructor(supabase: SupabaseClient<Database>) {
    this.orchestrator = new AiCoachOrchestrator(supabase);
  }

  async getDailyPlan(
    userId: string,
    options?: AiGenerationOptions & { forceRefresh?: boolean },
  ): Promise<{
    plan: DailyPracticePlan;
    source: "ai" | "cache" | "fallback";
    cachedAt?: Date;
  }> {
    return this.orchestrator.generateDailyPlan(userId, options);
  }
}

export class WeeklyReportGenerator {
  private orchestrator: AiCoachOrchestrator;

  constructor(supabase: SupabaseClient<Database>) {
    this.orchestrator = new AiCoachOrchestrator(supabase);
  }

  async generate(
    userId: string,
    weekData?: { weekStart: Date; weekEnd: Date },
    options?: AiGenerationOptions,
  ): Promise<{
    report: WeeklyProgressReport;
    source: "ai" | "cache" | "fallback";
  }> {
    return this.orchestrator.generateWeeklyReport(userId, weekData, options);
  }
}

export class GoalRecommendationEngine {
  private orchestrator: AiCoachOrchestrator;

  constructor(supabase: SupabaseClient<Database>) {
    this.orchestrator = new AiCoachOrchestrator(supabase);
  }

  async recommend(
    userId: string,
    count = 3,
    options?: AiGenerationOptions,
  ): Promise<{
    goals: SmartGoalRecommendation[];
    source: "ai" | "cache" | "fallback";
  }> {
    return this.orchestrator.generateGoalRecommendations(userId, count, options);
  }
}

export class LessonGenerator {
  private orchestrator: AiCoachOrchestrator;

  constructor(supabase: SupabaseClient<Database>) {
    this.orchestrator = new AiCoachOrchestrator(supabase);
  }

  async generate(
    userId: string,
    request: LessonGenerationRequest,
    options?: AiGenerationOptions,
  ): Promise<GeneratedLessonContent> {
    return this.orchestrator.generateLesson(userId, request, options);
  }
}

export class InsightGenerator {
  private orchestrator: AiCoachOrchestrator;

  constructor(supabase: SupabaseClient<Database>) {
    this.orchestrator = new AiCoachOrchestrator(supabase);
  }

  async generate(
    userId: string,
    options?: AiGenerationOptions,
  ): Promise<{
    insights: AiInsightData[];
    source: "ai" | "cache" | "fallback";
  }> {
    return this.orchestrator.generateInsights(userId, options);
  }
}

export class SessionAnalyzer {
  private orchestrator: AiCoachOrchestrator;

  constructor(supabase: SupabaseClient<Database>) {
    this.orchestrator = new AiCoachOrchestrator(supabase);
  }

  async analyze(
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
    return this.orchestrator.analyzeSession(userId, sessionData, options);
  }
}

export { AiCoachOrchestrator };
