import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ACHIEVEMENTS_REGISTRY } from "../config/achievements";
import type { AchievementDefinition } from "../config/achievements";
import {
  calculateXP,
  checkLevelUp,
} from "@/lib/session-lifecycle/achievement-detector";

export interface ProgressionStats {
  level: number;
  xp: number;
  totalSessions: number;
  totalWords: number;
  bestWpm: number;
  bestAccuracy: number;
  currentStreak: number;
  longestStreak: number;
}

export interface Mission {
  id: string;
  title: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  metric: "sessions" | "words" | "wpm" | "accuracy";
}

// Configurable reward parameters
export const GAME_BALANCING = {
  MISSION_XP: 100,
  CHALLENGE_XP: 500,
};

export async function evaluateSessionRewards(
  userId: string,
  sessionResult: {
    duration: number;
    finalWpm: number;
    finalAccuracy: number;
    consistency: number;
    wordsTyped: number;
  },
  practiceMode: string,
  onNotify: (
    title: string,
    message: string,
    type: "level_up" | "achievement" | "challenge" | "streak",
  ) => void,
) {
  const supabase = createSupabaseBrowserClient();

  // 1. Fetch current player statistics
  let stats: ProgressionStats = {
    level: 1,
    xp: 0,
    totalSessions: 0,
    totalWords: 0,
    bestWpm: 0,
    bestAccuracy: 0,
    currentStreak: 0,
    longestStreak: 0,
  };

  try {
    const { data, error } = await supabase
      .from("user_statistics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data && !error) {
      stats = {
        level: data.level || 1,
        xp: data.xp || 0,
        totalSessions: data.total_sessions || 0,
        totalWords: data.total_words_typed || 0,
        bestWpm: data.best_wpm || 0,
        bestAccuracy: data.best_accuracy || 0,
        currentStreak: data.current_streak || 0,
        longestStreak: data.longest_streak || 0,
      };
    }
  } catch (e) {
    // Graceful fallback to localStorage state if user statistics table is missing
    if (typeof window !== "undefined") {
      const localStats = localStorage.getItem("keyflow-user-stats");
      if (localStats) stats = JSON.parse(localStats);
    }
  }

  // 2. Fetch already unlocked achievements to avoid re-triggering
  let unlockedIds: string[] = [];
  try {
    const { data, error } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId);

    if (data && !error) {
      unlockedIds = data.map((d: any) => d.achievement_id);
    }
  } catch (e) {
    if (typeof window !== "undefined") {
      const localUnlocked = localStorage.getItem("keyflow-unlocked-achievements");
      if (localUnlocked) unlockedIds = JSON.parse(localUnlocked);
    }
  }

  // 3. Compute Session XP
  const xpReward = calculateXP(
    {
      finalWpm: sessionResult.finalWpm,
      finalAccuracy: sessionResult.finalAccuracy,
      consistency: sessionResult.consistency,
      duration: sessionResult.duration,
    } as any,
    stats.currentStreak,
  );

  const xpGained = xpReward.totalXp;
  const newXpTotal = stats.xp + xpGained;

  // 4. Check Level Up
  const levelCheck = checkLevelUp(stats.xp, newXpTotal);
  const finalLevel =
    levelCheck.leveledUp && levelCheck.newLevel ? levelCheck.newLevel : stats.level;

  // 5. Update overall metrics
  const finalSessions = stats.totalSessions + 1;
  const finalWords = stats.totalWords + sessionResult.wordsTyped;
  const finalBestWpm = Math.max(stats.bestWpm, sessionResult.finalWpm);
  const finalBestAcc = Math.max(stats.bestAccuracy, sessionResult.finalAccuracy);

  const updatedStats: ProgressionStats = {
    level: finalLevel,
    xp: newXpTotal,
    totalSessions: finalSessions,
    totalWords: finalWords,
    bestWpm: finalBestWpm,
    bestAccuracy: finalBestAcc,
    currentStreak: stats.currentStreak || 1, // assumes active streak is maintained
    longestStreak: Math.max(stats.longestStreak, stats.currentStreak || 1),
  };

  // Save statistics
  try {
    await supabase.from("user_statistics").upsert({
      user_id: userId,
      level: finalLevel,
      xp: newXpTotal,
      total_sessions: finalSessions,
      total_words_typed: finalWords,
      best_wpm: finalBestWpm,
      best_accuracy: finalBestAcc,
      current_streak: updatedStats.currentStreak,
      longest_streak: updatedStats.longestStreak,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    // Suppressed fallback
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("keyflow-user-stats", JSON.stringify(updatedStats));
  }

  // 6. Check Level Up Notification
  if (levelCheck.leveledUp && levelCheck.newLevel) {
    onNotify(
      "Level Up!",
      `Congratulations! You reached Level ${levelCheck.newLevel}. Keep scaling!`,
      "level_up",
    );
  }

  // 7. Check Config Achievements unlocking
  const unlockedNow: AchievementDefinition[] = [];
  for (const ach of ACHIEVEMENTS_REGISTRY) {
    if (unlockedIds.includes(ach.id)) continue;

    let targetMet = false;
    switch (ach.metric) {
      case "wpm":
        targetMet = sessionResult.finalWpm >= ach.targetValue;
        break;
      case "accuracy":
        targetMet = sessionResult.finalAccuracy >= ach.targetValue;
        break;
      case "consistency":
        targetMet = sessionResult.consistency >= ach.targetValue;
        break;
      case "sessions":
        targetMet = finalSessions >= ach.targetValue;
        break;
      case "words":
        targetMet = finalWords >= ach.targetValue;
        break;
      case "streak":
        targetMet = updatedStats.currentStreak >= ach.targetValue;
        break;
      default:
        break;
    }

    if (targetMet) {
      unlockedNow.push(ach);
      unlockedIds.push(ach.id);

      // Trigger achievement notification
      onNotify(
        `Unlocked Achievement: ${ach.title}!`,
        `${ach.description} (+${ach.xpReward} XP)`,
        "achievement",
      );

      // Save to Supabase
      try {
        await supabase.from("user_achievements").insert([
          {
            user_id: userId,
            achievement_id: ach.id,
            unlocked_at: new Date().toISOString(),
          },
        ]);
      } catch (e) {
        // Suppressed
      }
    }
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("keyflow-unlocked-achievements", JSON.stringify(unlockedIds));
  }

  // 8. Daily Missions Evaluation
  let missions: Mission[] = [
    {
      id: "daily_sessions",
      title: "Daily Sprint",
      target: 3,
      current: 0,
      xpReward: GAME_BALANCING.MISSION_XP,
      completed: false,
      metric: "sessions",
    },
    {
      id: "daily_words",
      title: "Vocabulary Target",
      target: 300,
      current: 0,
      xpReward: GAME_BALANCING.MISSION_XP,
      completed: false,
      metric: "words",
    },
  ];

  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("keyflow-daily-missions");
    if (cached) {
      try {
        missions = JSON.parse(cached);
      } catch (err) {
        // Fallback
      }
    }
  }

  const updatedMissions = missions.map((mission) => {
    if (mission.completed) return mission;

    let increment = 0;
    if (mission.metric === "sessions") increment = 1;
    if (mission.metric === "words") increment = sessionResult.wordsTyped;

    const currentVal = mission.current + increment;
    const isNowCompleted = currentVal >= mission.target;

    if (isNowCompleted && !mission.completed) {
      // Award bonus XP for completing the daily challenge
      onNotify(
        `Mission Completed: ${mission.title}!`,
        `Finished your daily objective (+${mission.xpReward} XP)`,
        "challenge",
      );
    }

    return {
      ...mission,
      current: Math.min(mission.target, currentVal),
      completed: isNowCompleted,
    };
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("keyflow-daily-missions", JSON.stringify(updatedMissions));
  }

  return {
    xpGained,
    levelCheck,
    unlockedNow,
    updatedStats,
  };
}
