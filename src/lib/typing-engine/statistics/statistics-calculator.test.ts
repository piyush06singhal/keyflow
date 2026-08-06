import { StatisticsCalculator } from "./statistics-calculator";
import type { Character, Word, TypingSegment } from "../types";

function makeChar(char: string, typed: boolean, isCorrect: boolean | null): Character {
  return {
    char,
    index: 0,
    wordIndex: 0,
    isSpace: char === " ",
    isCorrect,
    typed,
    skipped: false,
    timestamp: typed ? Date.now() : null,
  };
}

/** Build a Word from a target string plus a same-length string of what was
 * actually typed ("_" marks an untyped character). */
function makeWord(
  index: number,
  text: string,
  typedAs: string,
  overrides: Partial<Word> = {},
): Word {
  const characters: Character[] = text.split("").map((char, i) => {
    const typedChar = typedAs[i];
    if (typedChar === undefined || typedChar === "_") {
      return makeChar(char, false, null);
    }
    return makeChar(char, true, typedChar === char);
  });

  const isCompleted = overrides.isCompleted ?? !typedAs.includes("_");
  const isCorrect =
    overrides.isCorrect ?? (isCompleted ? characters.every((c) => c.isCorrect) : null);

  return {
    text,
    index,
    characters,
    isCompleted,
    isCorrect,
    startTime: overrides.startTime ?? null,
    endTime: overrides.endTime ?? null,
  };
}

describe("StatisticsCalculator.calculateLive", () => {
  it("computes 100% accuracy and full progress when everything is typed correctly", () => {
    // "hello" (5 chars) typed correctly in exactly 1 minute -> 1 gross word -> 1 WPM
    const words = [makeWord(0, "hello", "hello", { isCompleted: true })];
    const stats = StatisticsCalculator.calculateLive(words, 60_000, 1);

    expect(stats.accuracy).toBe(100);
    expect(stats.errorRate).toBe(0);
    expect(stats.correctChars).toBe(5);
    expect(stats.incorrectChars).toBe(0);
    expect(stats.wpm).toBe(1);
    expect(stats.progress).toBe(100);
    expect(stats.completedWords).toBe(1);
    expect(stats.remainingWords).toBe(0);
  });

  it("subtracts incorrect characters from gross WPM and lowers accuracy", () => {
    // "hello" typed as "hxllo" -> 1 wrong char out of 5 typed
    const words = [makeWord(0, "hello", "hxllo", { isCompleted: true })];
    const stats = StatisticsCalculator.calculateLive(words, 60_000, 1);

    expect(stats.correctChars).toBe(4);
    expect(stats.incorrectChars).toBe(1);
    expect(stats.accuracy).toBeCloseTo(80, 5); // 4/5 * 100
    // grossWpm = 4/5/1 = 0.8, errorsPerMinute = 1/5/1 = 0.2 -> net 0.6 -> rounds to 1
    expect(stats.wpm).toBe(1);
  });

  it("never returns a negative WPM even when errors outweigh correct characters", () => {
    const words = [makeWord(0, "aaaaaaaaaa", "bbbbbbbbbb", { isCompleted: true })];
    const stats = StatisticsCalculator.calculateLive(words, 60_000, 1);

    expect(stats.correctChars).toBe(0);
    expect(stats.incorrectChars).toBe(10);
    expect(stats.wpm).toBe(0);
  });

  it("does not divide by zero when elapsedTime is 0", () => {
    const words = [makeWord(0, "hi", "hi", { isCompleted: true })];
    expect(() => StatisticsCalculator.calculateLive(words, 0, 1)).not.toThrow();
    const stats = StatisticsCalculator.calculateLive(words, 0, 1);
    expect(Number.isFinite(stats.wpm)).toBe(true);
  });

  it("only counts typed characters, ignoring the untyped remainder of the text", () => {
    // Only "he" of "hello" has been typed so far
    const words = [makeWord(0, "hello", "he___", { isCompleted: false })];
    const stats = StatisticsCalculator.calculateLive(words, 60_000, 2);

    expect(stats.totalChars).toBe(2);
    expect(stats.correctChars).toBe(2);
    expect(stats.completedWords).toBe(0);
    expect(stats.progress).toBe(0);
  });
});

describe("StatisticsCalculator.calculateConsistency", () => {
  it("returns 100 for fewer than 2 segments", () => {
    expect(StatisticsCalculator.calculateConsistency([])).toBe(100);
    expect(
      StatisticsCalculator.calculateConsistency([
        { startTime: 0, endTime: 1000, wpm: 50, accuracy: 100, characterCount: 10 },
      ]),
    ).toBe(100);
  });

  it("returns 100 when every segment has identical WPM (perfectly consistent)", () => {
    const segments: TypingSegment[] = [
      { startTime: 0, endTime: 5000, wpm: 60, accuracy: 100, characterCount: 25 },
      { startTime: 5000, endTime: 10000, wpm: 60, accuracy: 100, characterCount: 25 },
      { startTime: 10000, endTime: 15000, wpm: 60, accuracy: 100, characterCount: 25 },
    ];
    expect(StatisticsCalculator.calculateConsistency(segments)).toBe(100);
  });

  it("scores lower consistency for widely varying WPM across segments", () => {
    const steady: TypingSegment[] = [
      { startTime: 0, endTime: 5000, wpm: 60, accuracy: 100, characterCount: 25 },
      { startTime: 5000, endTime: 10000, wpm: 58, accuracy: 100, characterCount: 25 },
    ];
    const erratic: TypingSegment[] = [
      { startTime: 0, endTime: 5000, wpm: 20, accuracy: 100, characterCount: 25 },
      { startTime: 5000, endTime: 10000, wpm: 100, accuracy: 100, characterCount: 25 },
    ];

    const steadyScore = StatisticsCalculator.calculateConsistency(steady);
    const erraticScore = StatisticsCalculator.calculateConsistency(erratic);

    expect(steadyScore).toBeGreaterThan(erraticScore);
  });
});

describe("StatisticsCalculator.calculateAverageWordTime", () => {
  it("returns 0 when no words are completed", () => {
    const words = [makeWord(0, "hi", "h_", { isCompleted: false })];
    expect(StatisticsCalculator.calculateAverageWordTime(words)).toBe(0);
  });

  it("averages the time between startTime and endTime across completed words", () => {
    const words = [
      makeWord(0, "hi", "hi", { isCompleted: true, startTime: 0, endTime: 1000 }),
      makeWord(1, "bye", "bye", { isCompleted: true, startTime: 1000, endTime: 3000 }),
    ];
    // (1000 + 2000) / 2 = 1500
    expect(StatisticsCalculator.calculateAverageWordTime(words)).toBe(1500);
  });
});

describe("StatisticsCalculator.findWordExtremes", () => {
  it("returns null for both when no words are completed", () => {
    const words = [makeWord(0, "hi", "h_", { isCompleted: false })];
    const { fastest, slowest } = StatisticsCalculator.findWordExtremes(words);
    expect(fastest).toBeNull();
    expect(slowest).toBeNull();
  });

  it("identifies the fastest and slowest completed words by elapsed time", () => {
    const words = [
      makeWord(0, "fast", "fast", { isCompleted: true, startTime: 0, endTime: 200 }),
      makeWord(1, "slow", "slow", { isCompleted: true, startTime: 200, endTime: 2200 }),
      makeWord(2, "mid", "mid", { isCompleted: true, startTime: 2200, endTime: 3200 }),
    ];
    const { fastest, slowest } = StatisticsCalculator.findWordExtremes(words);

    expect(fastest).toEqual({ text: "fast", time: 200 });
    expect(slowest).toEqual({ text: "slow", time: 2000 });
  });
});
