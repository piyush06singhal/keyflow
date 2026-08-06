/**
 * Daily Challenge
 *
 * A single typing challenge shared by everyone on a given calendar day —
 * same text, same duration, deterministically picked from today's date so
 * it doesn't change on refresh. Runs are recorded to a browser-local
 * history only; there is no account or backend, so this is intentionally
 * framed as "your runs", not a public leaderboard.
 */

const HISTORY_KEY = "keyflow.daily-challenge-history.v1";
const NAME_KEY = "keyflow.daily-challenge-name.v1";
const MAX_HISTORY = 100;

export const DAILY_CHALLENGE_DURATION = 60;

const CHALLENGE_TEXTS = [
  "Every expert was once a beginner who refused to give up. Small, consistent effort compounds into skill that looks like talent from the outside but is really just patience with repetition.",
  "Good software is written twice: once to make it work, and once more to make it clear. The second pass is where craftsmanship happens, when speed gives way to precision.",
  "A keyboard is a musical instrument for the mind. Fluent typing lets your fingers keep pace with your thoughts, so the words on the screen arrive as fast as the ideas behind them.",
  "The fastest typists are not the ones who move their hands the most, but the ones who move them the least. Efficiency is about eliminating wasted motion, not adding more effort.",
  "Debugging is like being a detective in a crime movie where you are also the murderer. The bug you are hunting was written by you, which makes it both frustrating and oddly personal.",
  "Consistency beats intensity over the long run. Ten focused minutes of practice every day will outperform one exhausting hour once a week, because the brain learns best through repetition.",
  "Clean code always looks like it was written by someone who cares. It reads like well-written prose, where every function and variable name tells you exactly what it is doing.",
  "The best time to plant a tree was twenty years ago. The second best time is now. The same is true for building any skill worth having, including the one you are practicing right now.",
  "Precision under pressure is a skill, not a personality trait. Anyone can type accurately when relaxed; the real test is staying steady when the clock is running and mistakes cost time.",
  "Great products are rarely built by lone geniuses. They are built by teams who communicate clearly, document their decisions, and leave the codebase better than they found it.",
  "Momentum is the secret ingredient behind most success stories. Starting is the hardest part, but once you are moving, staying in motion takes far less energy than you would expect.",
  "A well-placed comment explains why, not what. The code already says what it does; the comment should capture the reasoning a future reader would otherwise have to reconstruct alone.",
];

export interface DailyChallenge {
  date: string;
  text: string;
  duration: number;
}

export interface DailyChallengeRun {
  date: string;
  displayName: string;
  wpm: number;
  accuracy: number;
  completedAt: number;
}

function dateSeed(date: Date): number {
  const key = date.toDateString();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Deterministic "today's challenge" — identical for every visitor on a given day. */
export function getTodayChallenge(date: Date = new Date()): DailyChallenge {
  const seed = dateSeed(date);
  return {
    date: date.toDateString(),
    text: CHALLENGE_TEXTS[seed % CHALLENGE_TEXTS.length]!,
    duration: DAILY_CHALLENGE_DURATION,
  };
}

export function getDisplayName(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setDisplayName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NAME_KEY, name.trim().slice(0, 40));
  } catch (error) {
    console.warn("Failed to save challenge display name:", error);
  }
}

function readHistory(): DailyChallengeRun[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DailyChallengeRun[]) : [];
  } catch (error) {
    console.warn("Failed to read daily challenge history:", error);
    return [];
  }
}

function writeHistory(runs: DailyChallengeRun[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(runs));
  } catch (error) {
    console.warn("Failed to write daily challenge history:", error);
  }
}

/** All recorded runs, newest first. */
export function getChallengeHistory(): DailyChallengeRun[] {
  return readHistory();
}

/** Your best run for a given day (defaults to today), or null if none yet. */
export function getBestRunForDay(date: Date = new Date()): DailyChallengeRun | null {
  const day = date.toDateString();
  const runs = readHistory().filter((run) => run.date === day);
  if (runs.length === 0) return null;
  return runs.reduce((best, run) => (run.wpm > best.wpm ? run : best));
}

export function recordChallengeRun(
  run: Omit<DailyChallengeRun, "completedAt">,
): DailyChallengeRun {
  const entry: DailyChallengeRun = { ...run, completedAt: Date.now() };
  writeHistory([entry, ...readHistory()].slice(0, MAX_HISTORY));
  return entry;
}
