/**
 * Session Completion Handler
 *
 * Orchestrates the complete session lifecycle when a typing session completes.
 * Handles database persistence, statistics updates, achievements, and more.
 */

import { saveTypingSession } from "@/lib/supabase/typing-practice";
import { updateHeatmapForSession } from "@/lib/supabase/heatmap-updater";
import type { SessionResult } from "@/lib/typing-engine";
import type { SessionCompletionResult } from "./types";
import {
  storeSessionOffline,
  getSyncStatus,
  syncPendingSessions,
} from "./offline-storage";
import { updateAggregatedAnalytics } from "./analytics-aggregator";
import {
  detectPersonalBests,
  detectAchievements,
  calculateXP,
  checkLevelUp,
} from "./achievement-detector";

/**
 * Handle complete session lifecycle
 */
export async function handleSessionCompletion(
  userId: string,
  sessionResult: SessionResult,
  practiceMode: string,
  currentUserStats: {
    bestWpm: number;
    bestAccuracy: number;
    longestDuration: number;
    totalSessions: number;
    currentStreak: number;
    totalWords: number;
    currentXp: number;
  },
): Promise<SessionCompletionResult> {
  const result: SessionCompletionResult = {
    saved: false,
    statisticsUpdated: false,
    streakUpdated: false,
    heatmapUpdated: false,
    analyticsUpdated: false,
    newAchievements: [],
    xpGained: 0,
    levelUp: false,
    newPersonalBests: [],
    errors: [],
    warnings: [],
  };

  try {
    // 1. Try to save session to database
    let saveSuccess = false;
    let sessionId: string | undefined;

    if (navigator.onLine) {
      try {
        const { data, error } = await saveTypingSession(
          userId,
          sessionResult,
          practiceMode,
        );

        if (error) {
          throw error;
        }

        saveSuccess = true;
        sessionId = data?.id;
        result.saved = true;
        result.sessionId = sessionId;
        result.statisticsUpdated = true;
        result.streakUpdated = true;

        // Update heatmap
        try {
          const heatmapResult = await updateHeatmapForSession(
            userId,
            sessionResult.duration,
          );
          result.heatmapUpdated = heatmapResult.success;
        } catch (error) {
          console.error("Failed to update heatmap:", error);
        }
      } catch (error) {
        // If online but save failed, store offline
        result.errors.push(
          `Failed to save session: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        await storeSessionOffline(userId, sessionResult, practiceMode);
        result.warnings.push(
          "Session saved offline and will sync when connection is restored",
        );
      }
    } else {
      // Offline - store for later sync
      await storeSessionOffline(userId, sessionResult, practiceMode);
      result.warnings.push(
        "You're offline. Session will sync when connection is restored",
      );
    }

    // 2. Attempt to sync any pending sessions
    if (navigator.onLine) {
      try {
        const syncResult = await syncPendingSessions(saveTypingSession);
        if (syncResult.successful > 0) {
          result.warnings.push(`Synced ${syncResult.successful} pending session(s)`);
        }
      } catch (error) {
        // Silent fail - will retry later
        console.error("Background sync failed:", error);
      }
    }

    // 3. Update aggregated analytics (local)
    try {
      updateAggregatedAnalytics(userId, sessionResult);
      result.analyticsUpdated = true;
    } catch (error) {
      result.errors.push(
        `Failed to update analytics: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    // 4. Detect personal bests
    try {
      const personalBests = detectPersonalBests(sessionResult, {
        bestWpm: currentUserStats.bestWpm,
        bestAccuracy: currentUserStats.bestAccuracy,
        longestDuration: currentUserStats.longestDuration,
      });
      result.newPersonalBests = personalBests;
    } catch (error) {
      result.errors.push(
        `Failed to detect personal bests: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    // 5. Detect achievements
    try {
      const achievements = detectAchievements(sessionResult, {
        totalSessions: currentUserStats.totalSessions + 1,
        currentStreak: currentUserStats.currentStreak,
        bestWpm: Math.max(currentUserStats.bestWpm, sessionResult.finalWpm),
        totalWords:
          currentUserStats.totalWords + sessionResult.finalStats.completedWords,
      });
      result.newAchievements = achievements;
    } catch (error) {
      result.errors.push(
        `Failed to detect achievements: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    // 6. Calculate XP
    try {
      const xpCalc = calculateXP(sessionResult, currentUserStats.currentStreak);
      result.xpGained = xpCalc.totalXp;

      // Add achievement XP
      const achievementXp = result.newAchievements.reduce(
        (sum, achievement) => sum + achievement.xpReward,
        0,
      );
      result.xpGained += achievementXp;

      // Check for level up
      const levelUpCheck = checkLevelUp(
        currentUserStats.currentXp,
        currentUserStats.currentXp + result.xpGained,
      );
      result.levelUp = levelUpCheck.leveledUp;
      result.newLevel = levelUpCheck.newLevel;
    } catch (error) {
      result.errors.push(
        `Failed to calculate XP: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    // 7. Get sync status for display
    try {
      const syncStatus = await getSyncStatus();
      if (syncStatus.isPending && syncStatus.pendingCount > 0) {
        result.warnings.push(`${syncStatus.pendingCount} session(s) pending sync`);
      }
    } catch (error) {
      // Silent fail
      console.error("Failed to get sync status:", error);
    }

    return result;
  } catch (error) {
    result.errors.push(
      `Critical error in session completion: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return result;
  }
}

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Get user stats for session completion
 */
export async function getUserStatsForCompletion(
  userId: string,
  supabase: SupabaseClient<any>,
): Promise<{
  bestWpm: number;
  bestAccuracy: number;
  longestDuration: number;
  totalSessions: number;
  currentStreak: number;
  totalWords: number;
  currentXp: number;
} | null> {
  try {
    const { data, error } = await supabase
      .from("user_statistics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      console.error("Failed to get user stats:", error);
      return null;
    }

    // Use the actual XP stored in the database if available, otherwise fallback
    const currentXp = data.xp ?? Math.floor((data.total_practice_time || 0) / 60) * 10;

    return {
      bestWpm: data.best_wpm || 0,
      bestAccuracy: data.best_accuracy || 0,
      longestDuration: 0, // Not tracked in current schema
      totalSessions: data.total_sessions || 0,
      currentStreak: data.current_streak || 0,
      totalWords: data.total_words_typed || 0,
      currentXp,
    };
  } catch (error) {
    console.error("Failed to get user stats:", error);
    return null;
  }
}
