/**
 * Session Lifecycle Types
 *
 * Type definitions for the complete typing session lifecycle management system.
 */

// ============================================================================
// Analytics Aggregation Types
// ============================================================================

export interface DailyAggregation {
  date: string;
  totalSessions: number;
  totalDuration: number;
  avgWpm: number;
  avgAccuracy: number;
  bestWpm: number;
  totalWords: number;
  totalErrors: number;
}

export interface WeeklyAggregation {
  weekStart: string;
  weekEnd: string;
  totalSessions: number;
  totalDuration: number;
  avgWpm: number;
  avgAccuracy: number;
  bestWpm: number;
  improvement: number;
  practiceStreak: number;
}

export interface MonthlyAggregation {
  month: string;
  year: number;
  totalSessions: number;
  totalDuration: number;
  avgWpm: number;
  avgAccuracy: number;
  bestWpm: number;
  improvement: number;
  consistencyScore: number;
}

export interface AggregatedAnalytics {
  daily: DailyAggregation[];
  weekly: WeeklyAggregation[];
  monthly: MonthlyAggregation[];
  lastUpdated: number;
}

// ============================================================================
// Session Completion Types
// ============================================================================

export interface SessionCompletionResult {
  saved: boolean;
  newPersonalBests: PersonalBest[];
  analyticsUpdated: boolean;
  errors: string[];
  warnings: string[];
}

export interface PersonalBest {
  type: "wpm" | "accuracy" | "consistency" | "duration";
  previousValue: number;
  newValue: number;
  improvement: number;
}

// ============================================================================
// Session History Types
// ============================================================================

export interface SessionHistoryFilter {
  mode?: string[];
  dateFrom?: string;
  dateTo?: string;
  minWpm?: number;
  maxWpm?: number;
  minAccuracy?: number;
  sortBy?: "date" | "wpm" | "accuracy" | "duration";
  sortOrder?: "asc" | "desc";
}
