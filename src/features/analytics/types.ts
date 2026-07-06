export type AnalyticsTimeframe = "day" | "week" | "month" | "year" | "all" | "custom";

export interface KPICardData {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
    label: string;
  };
  description?: string;
  icon: string; // Icon name string or lucide key
  format?: "number" | "percentage" | "wpm" | "time" | "xp";
}

export interface WpmProgressionPoint {
  date: string;
  timestamp: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  sessionsCount: number;
}

export interface LanguageStatPoint {
  language: string;
  sessionsCount: number;
  averageWpm: number;
  averageAccuracy: number;
  syntaxErrorsCount: number;
  bracketAccuracy: number; // 0-100
  indentationAccuracy: number; // 0-100
  percentage: number;
}

export interface KeyStats {
  pressedCount: number;
  errorCount: number;
  errorRate: number; // percentage (0-100)
}

export interface KeyboardHeatmapData {
  keys: Record<string, KeyStats>;
  fingerUsage: Record<string, number>; // index of finger -> press count
  weakFingers: string[]; // List of names
}

export interface MistakeDetail {
  item: string; // The char or word
  count: number;
  errorRate?: number;
  expected?: string;
  actual?: string;
}

export interface MistakeAnalysisData {
  mistypedCharacters: MistakeDetail[];
  mistypedWords: MistakeDetail[];
  mistypedSymbols: MistakeDetail[];
  correctionRate: number; // percent of mistakes corrected
  backspaceUsageRatio: number; // backspaces pressed vs total characters
  rhythmScore: number; // score representing timing consistency (0-100)
}

export interface GoalProgressItem {
  id: string;
  title: string;
  goalType: "sessions" | "duration" | "wpm" | "accuracy" | "xp";
  targetValue: number;
  currentValue: number;
  progressPercent: number;
  status: "active" | "completed" | "failed";
  targetDate: string;
  estimatedCompletionDate: string | null;
  remainingValue: number;
}

export interface PerformanceForecastPoint {
  label: string; // e.g. "Week 1", "Week 2"
  wpmActual?: number;
  wpmPredicted: number;
  wpmLowerBound: number;
  wpmUpperBound: number;
  codingSpeedActual?: number;
  codingSpeedPredicted: number;
  codingSpeedLowerBound: number;
  codingSpeedUpperBound: number;
}

export interface AIAnalyticsInsight {
  id: string;
  type: "coaching" | "habit" | "recommendation" | "forecast";
  title: string;
  message: string;
  impact: "high" | "medium" | "low";
  category: "typing" | "coding" | "general";
  suggestedAction?: string;
  actionUrl?: string;
}

export interface AnalyticsSummary {
  kpis: {
    totalSessions: number;
    typingSessionsCount: number;
    codingSessionsCount: number;
    totalPracticeTime: number; // seconds
    wordsTyped: number;
    linesOfCodeTyped: number;
    averageWpm: number;
    bestWpm: number;
    averageAccuracy: number;
    consistencyScore: number;
    codingAccuracy: number;
    xpEarned: number;
    achievementsCount: number;
    currentStreak: number;
    longestStreak: number;
    overallLearningScore: number; // 0-100 custom rating
  };
  timeframe: AnalyticsTimeframe;
}
