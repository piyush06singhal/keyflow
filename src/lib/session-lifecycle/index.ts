/**
 * Session Lifecycle Module
 * 
 * Central export point for all session lifecycle functionality.
 */

// Core handler
export { handleSessionCompletion, getUserStatsForCompletion } from "./session-completion-handler";

// Offline storage
export {
  storeSessionOffline,
  getPendingSessions,
  removePendingSession,
  getSyncStatus,
  syncPendingSessions,
  startBackgroundSync,
  clearPendingSessions,
} from "./offline-storage";

// Analytics
export {
  aggregateDailySession,
  aggregateWeeklySession,
  aggregateMonthlySession,
  calculateImprovement,
  calculateConsistencyScore,
  storeAggregatedAnalytics,
  getAggregatedAnalytics,
  updateAggregatedAnalytics,
} from "./analytics-aggregator";

// Achievements
export {
  detectPersonalBests,
  detectAchievements,
  calculateXP,
  calculateLevel,
  checkLevelUp,
  getAchievementRarityColor,
} from "./achievement-detector";

// Types
export type {
  PendingSession,
  SessionSyncStatus,
  SyncResult,
  DailyAggregation,
  WeeklyAggregation,
  MonthlyAggregation,
  AggregatedAnalytics,
  Achievement,
  AchievementProgress,
  SessionCompletionResult,
  PersonalBest,
  DashboardUpdate,
  SessionHistoryItem,
  SessionHistoryFilter,
  SessionHistoryResult,
  WpmChartDataPoint,
  AccuracyChartDataPoint,
  ConsistencyChartDataPoint,
  MistakeDistribution,
  XpCalculation,
  LevelInfo,
  OfflineQueue,
} from "./types";
