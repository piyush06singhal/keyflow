/**
 * Local Personal Bests
 *
 * Browser-local record of the user's best stats, used to detect and
 * celebrate personal-best moments without any account/backend.
 */

import { detectPersonalBests } from "@/lib/session-lifecycle/achievement-detector";
import type { PersonalBest } from "@/lib/session-lifecycle/types";
import type { SessionResult } from "@/lib/typing-engine";

const BESTS_KEY = "keyflow.personal-bests.v1";

export interface PersonalBestsRecord {
  bestWpm: number;
  bestAccuracy: number;
  longestDuration: number;
  totalSessions: number;
  totalWords: number;
  updatedAt: number;
}

const DEFAULT_BESTS: PersonalBestsRecord = {
  bestWpm: 0,
  bestAccuracy: 0,
  longestDuration: 0,
  totalSessions: 0,
  totalWords: 0,
  updatedAt: 0,
};

export function getPersonalBests(): PersonalBestsRecord {
  if (typeof window === "undefined") return DEFAULT_BESTS;

  try {
    const raw = localStorage.getItem(BESTS_KEY);
    if (!raw) return DEFAULT_BESTS;
    return { ...DEFAULT_BESTS, ...(JSON.parse(raw) as Partial<PersonalBestsRecord>) };
  } catch (error) {
    console.warn("Failed to read personal bests:", error);
    return DEFAULT_BESTS;
  }
}

function writeBests(bests: PersonalBestsRecord): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(BESTS_KEY, JSON.stringify(bests));
  } catch (error) {
    console.warn("Failed to write personal bests:", error);
  }
}

/**
 * Compare a completed session against stored bests, persist any new
 * maxima, and return the updated record plus which bests were beaten.
 */
export function updatePersonalBests(sessionResult: SessionResult): {
  bests: PersonalBestsRecord;
  newBests: PersonalBest[];
} {
  const current = getPersonalBests();

  const newBests = detectPersonalBests(sessionResult, {
    bestWpm: current.bestWpm,
    bestAccuracy: current.bestAccuracy,
    longestDuration: current.longestDuration,
  });

  const updated: PersonalBestsRecord = {
    bestWpm: Math.max(current.bestWpm, sessionResult.finalWpm),
    bestAccuracy: Math.max(current.bestAccuracy, sessionResult.finalAccuracy),
    longestDuration: Math.max(current.longestDuration, sessionResult.duration),
    totalSessions: current.totalSessions + 1,
    totalWords: current.totalWords + sessionResult.finalStats.completedWords,
    updatedAt: Date.now(),
  };

  writeBests(updated);

  return { bests: updated, newBests };
}
