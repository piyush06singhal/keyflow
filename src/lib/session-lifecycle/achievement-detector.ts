/**
 * Achievement Detector
 * 
 * Detects achievements and personal bests from session results.
 * Calculates XP rewards and level progression.
 */

import type {
  Achievement,
  PersonalBest,
  XpCalculation,
  LevelInfo,
} from "./types";
import type { SessionResult } from "@/lib/typing-engine";

/**
 * Detect personal bests from session
 */
export function detectPersonalBests(
  sessionResult: SessionResult,
  userStats: {
    bestWpm: number;
    bestAccuracy: number;
    longestDuration: number;
  }
): PersonalBest[] {
  const personalBests: PersonalBest[] = [];

  // WPM personal best
  if (sessionResult.finalWpm > userStats.bestWpm) {
    personalBests.push({
      type: "wpm",
      previousValue: userStats.bestWpm,
      newValue: sessionResult.finalWpm,
      improvement: sessionResult.finalWpm - userStats.bestWpm,
    });
  }

  // Accuracy personal best
  if (sessionResult.finalAccuracy > userStats.bestAccuracy) {
    personalBests.push({
      type: "accuracy",
      previousValue: userStats.bestAccuracy,
      newValue: sessionResult.finalAccuracy,
      improvement: sessionResult.finalAccuracy - userStats.bestAccuracy,
    });
  }

  // Consistency personal best (lower is better for this metric in some contexts,
  // but we assume consistency is a 0-100 scale where higher is better)
  // Duration personal best
  if (sessionResult.duration > userStats.longestDuration) {
    personalBests.push({
      type: "duration",
      previousValue: userStats.longestDuration,
      newValue: sessionResult.duration,
      improvement: sessionResult.duration - userStats.longestDuration,
    });
  }

  return personalBests;
}

/**
 * Detect achievements from session
 */
export function detectAchievements(
  sessionResult: SessionResult,
  userStats: {
    totalSessions: number;
    currentStreak: number;
    bestWpm: number;
    totalWords: number;
  }
): Achievement[] {
  const achievements: Achievement[] = [];
  const now = Date.now();

  // Speed milestones
  if (sessionResult.finalWpm >= 100 && userStats.bestWpm < 100) {
    achievements.push({
      id: `achievement_speed_100_${now}`,
      type: "speed",
      title: "Speed Demon",
      description: "Reached 100 WPM for the first time!",
      icon: "⚡",
      rarity: "epic",
      xpReward: 500,
      unlockedAt: now,
    });
  } else if (sessionResult.finalWpm >= 80 && userStats.bestWpm < 80) {
    achievements.push({
      id: `achievement_speed_80_${now}`,
      type: "speed",
      title: "Lightning Fingers",
      description: "Reached 80 WPM!",
      icon: "🚀",
      rarity: "rare",
      xpReward: 300,
      unlockedAt: now,
    });
  } else if (sessionResult.finalWpm >= 60 && userStats.bestWpm < 60) {
    achievements.push({
      id: `achievement_speed_60_${now}`,
      type: "speed",
      title: "Speed Master",
      description: "Reached 60 WPM!",
      icon: "🏃",
      rarity: "rare",
      xpReward: 200,
      unlockedAt: now,
    });
  } else if (sessionResult.finalWpm >= 40 && userStats.bestWpm < 40) {
    achievements.push({
      id: `achievement_speed_40_${now}`,
      type: "speed",
      title: "Getting Faster",
      description: "Reached 40 WPM!",
      icon: "🌟",
      rarity: "common",
      xpReward: 100,
      unlockedAt: now,
    });
  }

  // Accuracy achievements
  if (sessionResult.finalAccuracy >= 99) {
    achievements.push({
      id: `achievement_accuracy_99_${now}`,
      type: "personal_best",
      title: "Perfectionist",
      description: "Achieved 99%+ accuracy!",
      icon: "🎯",
      rarity: "epic",
      xpReward: 400,
      unlockedAt: now,
    });
  } else if (sessionResult.finalAccuracy >= 95) {
    achievements.push({
      id: `achievement_accuracy_95_${now}`,
      type: "personal_best",
      title: "Precision Typer",
      description: "Achieved 95%+ accuracy!",
      icon: "🎪",
      rarity: "rare",
      xpReward: 200,
      unlockedAt: now,
    });
  }

  // Consistency achievements
  if (sessionResult.consistency >= 95) {
    achievements.push({
      id: `achievement_consistency_95_${now}`,
      type: "consistency",
      title: "Steady as a Rock",
      description: "Maintained 95%+ consistency!",
      icon: "🗿",
      rarity: "rare",
      xpReward: 250,
      unlockedAt: now,
    });
  }

  // Streak milestones
  if (userStats.currentStreak >= 100) {
    achievements.push({
      id: `achievement_streak_100_${now}`,
      type: "streak",
      title: "Century Streak",
      description: "100 day practice streak!",
      icon: "💯",
      rarity: "legendary",
      xpReward: 1000,
      unlockedAt: now,
    });
  } else if (userStats.currentStreak >= 30) {
    achievements.push({
      id: `achievement_streak_30_${now}`,
      type: "streak",
      title: "Month-Long Dedication",
      description: "30 day practice streak!",
      icon: "🔥",
      rarity: "epic",
      xpReward: 500,
      unlockedAt: now,
    });
  } else if (userStats.currentStreak >= 7) {
    achievements.push({
      id: `achievement_streak_7_${now}`,
      type: "streak",
      title: "Week Warrior",
      description: "7 day practice streak!",
      icon: "📅",
      rarity: "rare",
      xpReward: 200,
      unlockedAt: now,
    });
  }

  // Session count milestones
  if (userStats.totalSessions === 1) {
    achievements.push({
      id: `achievement_first_session_${now}`,
      type: "milestone",
      title: "First Steps",
      description: "Completed your first practice session!",
      icon: "👶",
      rarity: "common",
      xpReward: 50,
      unlockedAt: now,
    });
  } else if (userStats.totalSessions === 100) {
    achievements.push({
      id: `achievement_100_sessions_${now}`,
      type: "milestone",
      title: "Century Club",
      description: "Completed 100 practice sessions!",
      icon: "💯",
      rarity: "epic",
      xpReward: 800,
      unlockedAt: now,
    });
  } else if (userStats.totalSessions === 50) {
    achievements.push({
      id: `achievement_50_sessions_${now}`,
      type: "milestone",
      title: "Halfway Hero",
      description: "Completed 50 practice sessions!",
      icon: "🌟",
      rarity: "rare",
      xpReward: 400,
      unlockedAt: now,
    });
  } else if (userStats.totalSessions === 10) {
    achievements.push({
      id: `achievement_10_sessions_${now}`,
      type: "milestone",
      title: "Getting Started",
      description: "Completed 10 practice sessions!",
      icon: "🎉",
      rarity: "common",
      xpReward: 150,
      unlockedAt: now,
    });
  }

  // Word count milestones
  if (userStats.totalWords >= 100000) {
    achievements.push({
      id: `achievement_100k_words_${now}`,
      type: "milestone",
      title: "Word Master",
      description: "Typed 100,000 words!",
      icon: "📚",
      rarity: "legendary",
      xpReward: 1500,
      unlockedAt: now,
    });
  } else if (userStats.totalWords >= 10000) {
    achievements.push({
      id: `achievement_10k_words_${now}`,
      type: "milestone",
      title: "Prolific Typer",
      description: "Typed 10,000 words!",
      icon: "📖",
      rarity: "epic",
      xpReward: 600,
      unlockedAt: now,
    });
  }

  return achievements;
}

/**
 * Calculate XP gained from session
 */
export function calculateXP(
  sessionResult: SessionResult,
  currentStreak: number
): XpCalculation {
  // Base XP from duration (1 XP per second)
  const baseXp = Math.floor(sessionResult.duration / 1000);

  // Accuracy bonus (up to 50% bonus)
  const accuracyBonus = Math.floor(
    baseXp * (sessionResult.finalAccuracy / 100) * 0.5
  );

  // Speed bonus (WPM above 40 gives bonus)
  const speedBonus = Math.max(0, Math.floor((sessionResult.finalWpm - 40) * 2));

  // Consistency bonus
  const consistencyBonus = Math.floor(baseXp * (sessionResult.consistency / 100) * 0.3);

  // Streak multiplier (up to 2x at 30 day streak)
  const streakMultiplier = Math.min(2, 1 + currentStreak / 30);

  const totalXp = Math.floor(
    (baseXp + accuracyBonus + speedBonus + consistencyBonus) * streakMultiplier
  );

  return {
    baseXp,
    accuracyBonus,
    speedBonus,
    consistencyBonus,
    streakMultiplier,
    totalXp,
  };
}

/**
 * Calculate level from total XP
 */
export function calculateLevel(totalXp: number): LevelInfo {
  // XP required for each level increases: Level N requires N * 600 XP
  let level = 1;
  let xpForCurrentLevel = 0;
  let xpAccumulated = 0;

  while (xpAccumulated + level * 600 <= totalXp) {
    xpAccumulated += level * 600;
    xpForCurrentLevel = level * 600;
    level++;
  }

  const currentXp = totalXp - xpAccumulated;
  const xpForNextLevel = level * 600;
  const xpProgress = xpForNextLevel - xpForCurrentLevel;
  const xpProgressPercentage = (currentXp / xpProgress) * 100;

  return {
    currentLevel: level,
    currentXp,
    xpForCurrentLevel,
    xpForNextLevel,
    xpProgress,
    xpProgressPercentage,
  };
}

/**
 * Check if user leveled up
 */
export function checkLevelUp(
  previousXp: number,
  newXp: number
): { leveledUp: boolean; newLevel?: number; previousLevel: number } {
  const previousLevel = calculateLevel(previousXp).currentLevel;
  const newLevel = calculateLevel(newXp).currentLevel;

  return {
    leveledUp: newLevel > previousLevel,
    newLevel: newLevel > previousLevel ? newLevel : undefined,
    previousLevel,
  };
}

/**
 * Get achievement rarity color
 */
export function getAchievementRarityColor(
  rarity: Achievement["rarity"]
): string {
  switch (rarity) {
    case "common":
      return "text-gray-500";
    case "rare":
      return "text-blue-500";
    case "epic":
      return "text-purple-500";
    case "legendary":
      return "text-yellow-500";
    default:
      return "text-gray-500";
  }
}
