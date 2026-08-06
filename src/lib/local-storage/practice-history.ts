/**
 * Local Practice History
 *
 * Browser-local (no account, no backend) record of completed practice
 * sessions. Replaces the previous Supabase-backed session persistence.
 */

const HISTORY_KEY = "keyflow.practice-history.v1";
const MAX_ENTRIES = 200;

export interface LocalSessionRecord {
  id: string;
  completedAt: number;
  mode: string;
  practiceMode: "typing" | "coding";
  language?: string;
  finalWpm: number;
  finalAccuracy: number;
  consistency: number;
  duration: number;
  completedWords: number;
  completionPercentage: number;
}

function readHistory(): LocalSessionRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalSessionRecord[]) : [];
  } catch (error) {
    console.warn("Failed to read practice history:", error);
    return [];
  }
}

function writeHistory(records: LocalSessionRecord[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
  } catch (error) {
    console.warn("Failed to write practice history:", error);
  }
}

/**
 * Append a completed session to local history (newest-first), evicting the
 * oldest entries beyond MAX_ENTRIES.
 */
export function appendSessionToHistory(record: LocalSessionRecord): void {
  const existing = readHistory();
  const updated = [record, ...existing].slice(0, MAX_ENTRIES);
  writeHistory(updated);
}

/** All sessions, newest-first. */
export function getSessionHistory(): LocalSessionRecord[] {
  return readHistory();
}

/** Most recent `limit` sessions, newest-first. */
export function getRecentSessions(limit: number): LocalSessionRecord[] {
  return readHistory().slice(0, limit);
}

export function clearSessionHistory(): void {
  writeHistory([]);
}
