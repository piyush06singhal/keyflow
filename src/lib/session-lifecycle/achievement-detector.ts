/**
 * Personal Best Detector
 *
 * Detects personal bests from session results (pure, no I/O).
 */

import type { PersonalBest } from "./types";
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
  },
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
