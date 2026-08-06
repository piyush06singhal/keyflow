/**
 * Session Completion Handler
 *
 * Orchestrates what happens when a typing session completes: recording it
 * to local history, updating personal bests, and updating local analytics.
 * Everything here is synchronous and browser-local — no account, no backend.
 */

import type { SessionResult } from "@/lib/typing-engine";
import type { SessionCompletionResult } from "./types";
import {
  appendSessionToHistory,
  type LocalSessionRecord,
} from "@/lib/local-storage/practice-history";
import { updatePersonalBests } from "@/lib/local-storage/personal-bests";
import { updateAggregatedAnalytics } from "./analytics-aggregator";

/**
 * Handle the complete session lifecycle for a just-finished session.
 */
export function handleSessionCompletion(
  sessionResult: SessionResult,
  practiceMode: string,
): SessionCompletionResult {
  const result: SessionCompletionResult = {
    saved: false,
    newPersonalBests: [],
    analyticsUpdated: false,
    errors: [],
    warnings: [],
  };

  try {
    appendSessionToHistory(toLocalSessionRecord(sessionResult, practiceMode));
    result.saved = true;
  } catch (error) {
    result.errors.push(
      `Failed to save session locally: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  try {
    const { newBests } = updatePersonalBests(sessionResult);
    result.newPersonalBests = newBests;
  } catch (error) {
    result.errors.push(
      `Failed to update personal bests: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  try {
    updateAggregatedAnalytics(sessionResult);
    result.analyticsUpdated = true;
  } catch (error) {
    result.errors.push(
      `Failed to update analytics: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  return result;
}

function toLocalSessionRecord(
  sessionResult: SessionResult,
  practiceMode: string,
): LocalSessionRecord {
  return {
    id: sessionResult.sessionId,
    completedAt: sessionResult.timestamp,
    mode: sessionResult.mode,
    practiceMode: practiceMode === "coding" ? "coding" : "typing",
    finalWpm: sessionResult.finalWpm,
    finalAccuracy: sessionResult.finalAccuracy,
    consistency: sessionResult.consistency,
    duration: sessionResult.duration,
    completedWords: sessionResult.finalStats.completedWords,
    completionPercentage: sessionResult.completionPercentage,
  };
}
