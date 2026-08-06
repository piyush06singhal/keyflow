/**
 * Analytics Aggregator
 *
 * Aggregates session data for efficient analytics querying.
 * Maintains daily, weekly, and monthly summaries.
 */

import type {
  DailyAggregation,
  WeeklyAggregation,
  MonthlyAggregation,
  AggregatedAnalytics,
} from "./types";
import type { SessionResult } from "@/lib/typing-engine";

/**
 * Calculate daily aggregation from session
 */
export function aggregateDailySession(
  existing: DailyAggregation | null,
  sessionResult: SessionResult,
): DailyAggregation {
  const date = new Date().toISOString().split("T")[0]!;

  if (!existing) {
    return {
      date,
      totalSessions: 1,
      totalDuration: sessionResult.duration,
      avgWpm: sessionResult.finalWpm,
      avgAccuracy: sessionResult.finalAccuracy,
      bestWpm: sessionResult.finalWpm,
      totalWords: sessionResult.finalStats.completedWords,
      totalErrors: sessionResult.finalStats.incorrectChars,
    };
  }

  const newTotalSessions = existing.totalSessions + 1;
  const newTotalDuration = existing.totalDuration + sessionResult.duration;

  return {
    date,
    totalSessions: newTotalSessions,
    totalDuration: newTotalDuration,
    avgWpm:
      (existing.avgWpm * existing.totalSessions + sessionResult.finalWpm) /
      newTotalSessions,
    avgAccuracy:
      (existing.avgAccuracy * existing.totalSessions + sessionResult.finalAccuracy) /
      newTotalSessions,
    bestWpm: Math.max(existing.bestWpm, sessionResult.finalWpm),
    totalWords: existing.totalWords + sessionResult.finalStats.completedWords,
    totalErrors: existing.totalErrors + sessionResult.finalStats.incorrectChars,
  };
}

/**
 * Calculate weekly aggregation
 */
export function aggregateWeeklySession(
  existing: WeeklyAggregation | null,
  sessionResult: SessionResult,
  previousWeekAvgWpm: number = 0,
): WeeklyAggregation {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = getWeekEnd(now);

  if (!existing) {
    return {
      weekStart: weekStart.toISOString().split("T")[0]!,
      weekEnd: weekEnd.toISOString().split("T")[0]!,
      totalSessions: 1,
      totalDuration: sessionResult.duration,
      avgWpm: sessionResult.finalWpm,
      avgAccuracy: sessionResult.finalAccuracy,
      bestWpm: sessionResult.finalWpm,
      improvement: sessionResult.finalWpm - previousWeekAvgWpm,
      practiceStreak: 1,
    };
  }

  const newTotalSessions = existing.totalSessions + 1;
  const newAvgWpm =
    (existing.avgWpm * existing.totalSessions + sessionResult.finalWpm) /
    newTotalSessions;

  return {
    weekStart: existing.weekStart,
    weekEnd: existing.weekEnd,
    totalSessions: newTotalSessions,
    totalDuration: existing.totalDuration + sessionResult.duration,
    avgWpm: newAvgWpm,
    avgAccuracy:
      (existing.avgAccuracy * existing.totalSessions + sessionResult.finalAccuracy) /
      newTotalSessions,
    bestWpm: Math.max(existing.bestWpm, sessionResult.finalWpm),
    improvement: newAvgWpm - previousWeekAvgWpm,
    practiceStreak: existing.practiceStreak,
  };
}

/**
 * Calculate monthly aggregation
 */
export function aggregateMonthlySession(
  existing: MonthlyAggregation | null,
  sessionResult: SessionResult,
  previousMonthAvgWpm: number = 0,
): MonthlyAggregation {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  if (!existing) {
    return {
      month,
      year,
      totalSessions: 1,
      totalDuration: sessionResult.duration,
      avgWpm: sessionResult.finalWpm,
      avgAccuracy: sessionResult.finalAccuracy,
      bestWpm: sessionResult.finalWpm,
      improvement: sessionResult.finalWpm - previousMonthAvgWpm,
      consistencyScore: sessionResult.consistency,
    };
  }

  const newTotalSessions = existing.totalSessions + 1;
  const newAvgWpm =
    (existing.avgWpm * existing.totalSessions + sessionResult.finalWpm) /
    newTotalSessions;

  return {
    month: existing.month,
    year: existing.year,
    totalSessions: newTotalSessions,
    totalDuration: existing.totalDuration + sessionResult.duration,
    avgWpm: newAvgWpm,
    avgAccuracy:
      (existing.avgAccuracy * existing.totalSessions + sessionResult.finalAccuracy) /
      newTotalSessions,
    bestWpm: Math.max(existing.bestWpm, sessionResult.finalWpm),
    improvement: newAvgWpm - previousMonthAvgWpm,
    consistencyScore:
      (existing.consistencyScore * existing.totalSessions + sessionResult.consistency) /
      newTotalSessions,
  };
}

/**
 * Get week start date (Monday)
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get week end date (Sunday)
 */
function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

/**
 * Calculate improvement from historical data
 */
export function calculateImprovement(
  currentAvg: number,
  historicalData: number[],
): number {
  if (historicalData.length === 0) return 0;

  const historicalAvg =
    historicalData.reduce((sum, val) => sum + val, 0) / historicalData.length;

  return currentAvg - historicalAvg;
}

/**
 * Calculate consistency score
 */
export function calculateConsistencyScore(wpmValues: number[]): number {
  if (wpmValues.length < 2) return 100;

  const mean = wpmValues.reduce((sum, val) => sum + val, 0) / wpmValues.length;
  const variance =
    wpmValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpmValues.length;
  const stdDev = Math.sqrt(variance);

  // Convert to percentage (lower std dev = higher consistency)
  // Normalize using coefficient of variation
  const cv = (stdDev / mean) * 100;
  return Math.max(0, Math.min(100, 100 - cv));
}

const ANALYTICS_KEY = "keyflow.analytics.v1";

/**
 * Store aggregated analytics in localStorage (for quick access)
 */
export function storeAggregatedAnalytics(analytics: AggregatedAnalytics): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  } catch (error) {
    console.error("Failed to store aggregated analytics:", error);
  }
}

/**
 * Get aggregated analytics from localStorage
 */
export function getAggregatedAnalytics(): AggregatedAnalytics | null {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    if (!data) return null;
    return JSON.parse(data) as AggregatedAnalytics;
  } catch (error) {
    console.error("Failed to get aggregated analytics:", error);
    return null;
  }
}

/**
 * Update aggregated analytics after session
 */
export function updateAggregatedAnalytics(sessionResult: SessionResult): void {
  try {
    const existing = getAggregatedAnalytics();
    const now = new Date();
    const today = now.toISOString().split("T")[0]!;

    const dailyData = existing?.daily || [];
    const weeklyData = existing?.weekly || [];
    const monthlyData = existing?.monthly || [];

    // Update daily
    const todayIndex = dailyData.findIndex((d) => d.date === today);
    const todayData = todayIndex >= 0 ? dailyData[todayIndex] : null;
    const newDailyData = aggregateDailySession(todayData || null, sessionResult);

    if (todayIndex >= 0) {
      dailyData[todayIndex] = newDailyData;
    } else {
      dailyData.push(newDailyData);
    }

    // Keep only last 90 days
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const filteredDaily = dailyData.filter((d) => new Date(d.date) >= ninetyDaysAgo);

    // Update weekly
    const weekStart = getWeekStart(now).toISOString().split("T")[0]!;
    const weekIndex = weeklyData.findIndex((w) => w.weekStart === weekStart);
    const weekData = weekIndex >= 0 ? weeklyData[weekIndex] : null;

    const previousWeekAvg = weekIndex > 0 ? weeklyData[weekIndex - 1]?.avgWpm || 0 : 0;
    const newWeeklyData = aggregateWeeklySession(
      weekData || null,
      sessionResult,
      previousWeekAvg,
    );

    if (weekIndex >= 0) {
      weeklyData[weekIndex] = newWeeklyData;
    } else {
      weeklyData.push(newWeeklyData);
    }

    // Keep only last 52 weeks
    const fiftyTwoWeeksAgo = new Date(now);
    fiftyTwoWeeksAgo.setDate(fiftyTwoWeeksAgo.getDate() - 364);
    const filteredWeekly = weeklyData.filter(
      (w) => new Date(w.weekStart) >= fiftyTwoWeeksAgo,
    );

    // Update monthly
    const month = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();
    const monthIndex = monthlyData.findIndex(
      (m) => m.month === month && m.year === year,
    );
    const monthData = monthIndex >= 0 ? monthlyData[monthIndex] : null;

    const previousMonthAvg =
      monthIndex > 0 ? monthlyData[monthIndex - 1]?.avgWpm || 0 : 0;
    const newMonthlyData = aggregateMonthlySession(
      monthData || null,
      sessionResult,
      previousMonthAvg,
    );

    if (monthIndex >= 0) {
      monthlyData[monthIndex] = newMonthlyData;
    } else {
      monthlyData.push(newMonthlyData);
    }

    // Keep only last 12 months
    const twelveMonthsAgo = new Date(now);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const filteredMonthly = monthlyData.filter((m) => {
      const monthDate = new Date(m.year, getMonthNumber(m.month));
      return monthDate >= twelveMonthsAgo;
    });

    // Store updated analytics
    const updatedAnalytics: AggregatedAnalytics = {
      daily: filteredDaily,
      weekly: filteredWeekly,
      monthly: filteredMonthly,
      lastUpdated: Date.now(),
    };

    storeAggregatedAnalytics(updatedAnalytics);
  } catch (error) {
    console.error("Failed to update aggregated analytics:", error);
  }
}

/**
 * Get month number from month name
 */
function getMonthNumber(monthName: string): number {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months.indexOf(monthName);
}
