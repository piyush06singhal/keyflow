/**
 * Session Lifecycle Types
 * 
 * Type definitions for the complete typing session lifecycle management system.
 */

import type { SessionResult } from "@/lib/typing-engine";

// ============================================================================
// Session Persistence Types
// ============================================================================

export interface PendingSession {
  id: string;
  userId: string;
  sessionData: SessionResult;
  practiceMode: string;
  timestamp: number;
  attempts: number;
  lastAttemptTime: number;
}

export interface SessionSyncStatus {
  isPending: boolean;
  pendingCount: number;
  lastSyncTime: number | null;
  lastSyncError: string | null;
}

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
// Achievement Detection Types
// ============================================================================

export interface Achievement {
  id: string;
  type: "personal_best" | "streak" | "milestone" | "consistency" | "speed";
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  xpReward: number;
  unlockedAt: number;
}

export interface AchievementProgress {
  achievementId: string;
  currentProgress: number;
  targetProgress: number;
  percentage: number;
}

// ============================================================================
// Session Completion Types
// ============================================================================

export interface SessionCompletionResult {
  // Database status
  saved: boolean;
  sessionId?: string;
  
  // Updates applied
  statisticsUpdated: boolean;
  streakUpdated: boolean;
  heatmapUpdated: boolean;
  analyticsUpdated: boolean;
  
  // Achievements
  newAchievements: Achievement[];
  xpGained: number;
  levelUp: boolean;
  newLevel?: number;
  
  // Personal bests
  newPersonalBests: PersonalBest[];
  
  // Errors
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
// Dashboard Update Types
// ============================================================================

export interface DashboardUpdate {
  statsRefreshed: boolean;
  heatmapRefreshed: boolean;
  goalsRefreshed: boolean;
  activitiesRefreshed: boolean;
  timestamp: number;
}

// ============================================================================
// Session History Types
// ============================================================================

export interface SessionHistoryItem {
  id: string;
  date: string;
  duration: number;
  mode: string;
  wpm: number;
  accuracy: number;
  consistency: number;
  peakWpm: number;
  mistakes: number;
  isPersonalBest: boolean;
}

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

export interface SessionHistoryResult {
  sessions: SessionHistoryItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// Performance Chart Types
// ============================================================================

export interface WpmChartDataPoint {
  timestamp: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
}

export interface AccuracyChartDataPoint {
  timestamp: number;
  accuracy: number;
  errorRate: number;
}

export interface ConsistencyChartDataPoint {
  timestamp: number;
  consistency: number;
  wpmVariation: number;
}

export interface MistakeDistribution {
  character: string;
  count: number;
  percentage: number;
}

// ============================================================================
// XP and Leveling Types
// ============================================================================

export interface XpCalculation {
  baseXp: number;
  accuracyBonus: number;
  speedBonus: number;
  consistencyBonus: number;
  streakMultiplier: number;
  totalXp: number;
}

export interface LevelInfo {
  currentLevel: number;
  currentXp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpProgress: number;
  xpProgressPercentage: number;
}

// ============================================================================
// Offline Sync Types
// ============================================================================

export interface OfflineQueue {
  sessions: PendingSession[];
  maxRetries: number;
  retryDelayMs: number;
}

export interface SyncResult {
  successful: number;
  failed: number;
  errors: Array<{ sessionId: string; error: string }>;
}
