import type { Database } from "@/types/database";

// Database types
export type AiRecommendation =
  Database["public"]["Tables"]["ai_practice_recommendations"]["Row"];
export type AiRecommendationInsert =
  Database["public"]["Tables"]["ai_practice_recommendations"]["Insert"];
export type AiRecommendationUpdate =
  Database["public"]["Tables"]["ai_practice_recommendations"]["Update"];

export type AiPerformanceReport =
  Database["public"]["Tables"]["ai_performance_reports"]["Row"];
export type AiPerformanceReportInsert =
  Database["public"]["Tables"]["ai_performance_reports"]["Insert"];

export type AiGeneratedLesson =
  Database["public"]["Tables"]["ai_generated_lessons"]["Row"];
export type AiGeneratedLessonInsert =
  Database["public"]["Tables"]["ai_generated_lessons"]["Insert"];
export type AiGeneratedLessonUpdate =
  Database["public"]["Tables"]["ai_generated_lessons"]["Update"];

export type AiInsightsCache =
  Database["public"]["Tables"]["ai_insights_cache"]["Row"];
export type AiInsightsCacheInsert =
  Database["public"]["Tables"]["ai_insights_cache"]["Insert"];

export type AiUserGoal = Database["public"]["Tables"]["ai_user_goals"]["Row"];
export type AiUserGoalInsert =
  Database["public"]["Tables"]["ai_user_goals"]["Insert"];
export type AiUserGoalUpdate =
  Database["public"]["Tables"]["ai_user_goals"]["Update"];

export type AiUserPreferences =
  Database["public"]["Tables"]["ai_user_preferences"]["Row"];
export type AiUserPreferencesUpdate =
  Database["public"]["Tables"]["ai_user_preferences"]["Update"];

// Enums
export type RecommendationType =
  | "daily_practice"
  | "typing_exercise"
  | "coding_exercise"
  | "weak_area_focus"
  | "skill_progression"
  | "custom";

export type RecommendationPriority = "low" | "medium" | "high" | "urgent";

export type RecommendationStatus =
  | "pending"
  | "accepted"
  | "completed"
  | "dismissed"
  | "expired";

export type ReportType =
  | "session_analysis"
  | "weekly_summary"
  | "monthly_summary"
  | "skill_assessment"
  | "progress_report";

export type LessonType =
  | "typing_drill"
  | "coding_practice"
  | "weak_key_focus"
  | "syntax_practice"
  | "custom";

export type GoalType = "daily" | "weekly" | "monthly" | "custom";

export type GoalCategory =
  | "typing_speed"
  | "typing_accuracy"
  | "coding_proficiency"
  | "practice_consistency"
  | "skill_mastery"
  | "custom";

export type GoalStatus = "active" | "completed" | "failed" | "abandoned";

export type LearningStyle = "visual" | "practical" | "theoretical" | "balanced";

// Analysis types
export interface TypingAnalysis {
  averageWpm: number;
  averageAccuracy: number;
  consistency: number;
  peakWpm: number;
  totalSessions: number;
  totalPracticeTime: number;
  wpmTrend: "improving" | "declining" | "stable";
  accuracyTrend: "improving" | "declining" | "stable";
  weakKeys: Array<{
    key: string;
    errorCount: number;
    errorRate: number;
  }>;
  strongKeys: Array<{
    key: string;
    accuracy: number;
  }>;
  timeDistribution: Record<string, number>;
  practiceFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface CodingAnalysis {
  languageStats: Record<
    string,
    {
      sessionsCount: number;
      averageWpm: number;
      averageAccuracy: number;
      averageLineAccuracy: number;
      totalTime: number;
    }
  >;
  frameworkStats: Record<
    string,
    {
      sessionsCount: number;
      averageScore: number;
    }
  >;
  syntaxMistakes: Array<{
    type: string;
    count: number;
    examples: string[];
  }>;
  weakAreas: string[];
  strongAreas: string[];
  difficultyProgression: Record<string, number>;
}

export interface SessionAnalysisResult {
  sessionId: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  suggestions: string[];
  comparisonToPrevious: {
    wpmChange: number;
    accuracyChange: number;
    consistencyChange: number;
  };
  nextSteps: string[];
}

export interface DailyPracticePlan {
  date: string;
  typingExercises: Array<{
    title: string;
    description: string;
    duration: number;
    difficulty: string;
    focusArea: string;
    config: Record<string, unknown>;
  }>;
  codingExercises: Array<{
    title: string;
    description: string;
    language: string;
    difficulty: string;
    estimatedTime: number;
    focusArea: string;
  }>;
  goals: Array<{
    title: string;
    target: string;
    progress: number;
  }>;
  motivationalMessage: string;
}

export interface WeeklyProgressReport {
  weekStart: string;
  weekEnd: string;
  summary: string;
  typingProgress: {
    averageWpm: number;
    averageAccuracy: number;
    wpmChange: number;
    accuracyChange: number;
    totalSessions: number;
    totalTime: number;
    bestSession: {
      wpm: number;
      accuracy: number;
      date: string;
    };
  };
  codingProgress: {
    totalSessions: number;
    totalTime: number;
    languagesPracticed: string[];
    averageScore: number;
    scoreChange: number;
  };
  achievements: string[];
  challenges: string[];
  nextWeekGoals: string[];
  insights: string[];
}

export interface SmartGoalRecommendation {
  title: string;
  description: string;
  category: GoalCategory;
  type: GoalType;
  targetMetric: string;
  targetValue: number;
  currentValue: number;
  estimatedTimeToComplete: number;
  difficulty: "easy" | "moderate" | "challenging" | "ambitious";
  reasoning: string;
  milestones: Array<{
    title: string;
    value: number;
    description: string;
  }>;
  confidence: number;
}

export interface AiInsightData {
  category: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "success" | "critical";
  actionable: boolean;
  actions?: string[];
  metadata?: Record<string, unknown>;
}

export interface LessonGenerationRequest {
  lessonType: LessonType;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  targetSkills: string[];
  targetWeaknesses?: string[];
  language?: string;
  framework?: string;
  duration?: number;
  customPrompt?: string;
}

export interface GeneratedLessonContent {
  title: string;
  description: string;
  content: string;
  instructions: string[];
  expectedOutcomes: string[];
  practiceConfig: Record<string, unknown>;
  estimatedDuration: number;
}

// AI Provider types
export interface AiAnalysisContext {
  userId: string;
  timeframe: {
    start: Date;
    end: Date;
  };
  includeTyping?: boolean;
  includeCoding?: boolean;
  includeGoals?: boolean;
  includePreferences?: boolean;
}

export interface AiGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  provider?: "groq" | "gemini";
  model?: string;
  useCache?: boolean;
  cacheExpiration?: number;
}

// Cache types
export interface CacheMetadata {
  key: string;
  expiresAt: Date;
  provider: string;
  computedAt: Date;
}

export interface CachedInsight<T = unknown> {
  data: T;
  metadata: CacheMetadata;
}

// Fallback types
export interface FallbackRecommendation {
  source: "rule-based" | "statistical" | "default";
  confidence: number;
  reasoning: string;
}
