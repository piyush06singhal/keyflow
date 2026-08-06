/**
 * Session Lifecycle Module
 *
 * Central export point for all session lifecycle functionality.
 */

// Core handler
export { handleSessionCompletion } from "./session-completion-handler";

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

// Personal bests
export { detectPersonalBests } from "./achievement-detector";

// Types
export type {
  DailyAggregation,
  WeeklyAggregation,
  MonthlyAggregation,
  AggregatedAnalytics,
  SessionCompletionResult,
  PersonalBest,
  SessionHistoryFilter,
} from "./types";
