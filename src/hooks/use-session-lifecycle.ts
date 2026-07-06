/**
 * Session Lifecycle Hook
 *
 * React hook for managing the complete typing session lifecycle.
 * Handles completion, sync, analytics, and achievements.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./use-auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { SessionResult } from "@/lib/typing-engine";
import {
  handleSessionCompletion,
  getUserStatsForCompletion,
  startBackgroundSync,
  getSyncStatus,
  type SessionCompletionResult,
  type SessionSyncStatus,
} from "@/lib/session-lifecycle";
import { saveTypingSession } from "@/lib/supabase/typing-practice";
import { useNotifications } from "@/features/notifications/context/notification-provider";
import { evaluateSessionRewards } from "@/features/gamification/services/reward-engine";
export interface UseSessionLifecycleReturn {
  // State
  completionResult: SessionCompletionResult | null;
  isProcessing: boolean;
  syncStatus: SessionSyncStatus | null;

  // Actions
  completeSession: (
    sessionResult: SessionResult,
    practiceMode: string,
  ) => Promise<SessionCompletionResult>;
  refreshSyncStatus: () => Promise<void>;

  // Background sync
  isSyncing: boolean;
}

export function useSessionLifecycle(): UseSessionLifecycleReturn {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [completionResult, setCompletionResult] =
    useState<SessionCompletionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SessionSyncStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * Refresh sync status
   */
  const refreshSyncStatus = useCallback(async () => {
    try {
      const status = await getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error("Failed to refresh sync status:", error);
    }
  }, []);

  /**
   * Complete a typing session
   */
  const completeSession = useCallback(
    async (
      sessionResult: SessionResult,
      practiceMode: string,
    ): Promise<SessionCompletionResult> => {
      if (!user) {
        return {
          saved: false,
          statisticsUpdated: false,
          streakUpdated: false,
          heatmapUpdated: false,
          analyticsUpdated: false,
          newAchievements: [],
          xpGained: 0,
          levelUp: false,
          newPersonalBests: [],
          errors: ["User not authenticated"],
          warnings: [],
        };
      }

      setIsProcessing(true);

      try {
        // Get current user stats
        const supabase = createSupabaseBrowserClient();
        const userStats = await getUserStatsForCompletion(user.id, supabase);

        if (!userStats) {
          throw new Error("Failed to fetch user statistics");
        }

        // Handle session completion
        const result = await handleSessionCompletion(
          user.id,
          sessionResult,
          practiceMode,
          userStats,
        );

        // Evaluate and save gamification rewards and trigger real-time notifications
        if (result.saved || result.statisticsUpdated) {
          const rewardResult = await evaluateSessionRewards(
            user.id,
            {
              duration: sessionResult.duration,
              finalWpm: sessionResult.finalWpm,
              finalAccuracy: sessionResult.finalAccuracy,
              consistency: sessionResult.consistency,
              wordsTyped: sessionResult.finalStats.completedWords,
            },
            practiceMode,
            (title, message, type) => {
              addNotification(title, message, type);
            },
          );

          // Sync UI display XP with actual processed database result
          result.xpGained = rewardResult.xpGained;
          result.levelUp = rewardResult.levelCheck.leveledUp;
          result.newLevel = rewardResult.levelCheck.newLevel;
        }

        setCompletionResult(result);

        // Refresh sync status
        await refreshSyncStatus();

        return result;
      } catch (error) {
        const errorResult: SessionCompletionResult = {
          saved: false,
          statisticsUpdated: false,
          streakUpdated: false,
          heatmapUpdated: false,
          analyticsUpdated: false,
          newAchievements: [],
          xpGained: 0,
          levelUp: false,
          newPersonalBests: [],
          errors: [error instanceof Error ? error.message : "Unknown error occurred"],
          warnings: [],
        };

        setCompletionResult(errorResult);
        return errorResult;
      } finally {
        setIsProcessing(false);
      }
    },
    [user, refreshSyncStatus],
  );

  /**
   * Setup background sync
   */
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    // Defer state update and initial sync check
    const timer = setTimeout(() => {
      if (isMounted) {
        setIsSyncing(true);
        void refreshSyncStatus();
      }
    }, 0);

    const cleanup = startBackgroundSync(saveTypingSession);

    // Periodic sync status check
    const interval = setInterval(() => {
      if (isMounted) {
        void refreshSyncStatus();
      }
    }, 60000); // Every minute

    return () => {
      isMounted = false;
      clearTimeout(timer);
      cleanup();
      clearInterval(interval);
      setIsSyncing(false);
    };
  }, [user, refreshSyncStatus]);

  return {
    completionResult,
    isProcessing,
    syncStatus,
    completeSession,
    refreshSyncStatus,
    isSyncing,
  };
}
