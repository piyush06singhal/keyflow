/**
 * Statistics Calculator
 *
 * Calculates typing statistics following industry standards.
 */

import type { LiveStatistics, Word, Character, TypingSegment } from "../types";

export class StatisticsCalculator {
  /**
   * Calculate live statistics from current state
   */
  static calculateLive(
    words: Word[],
    elapsedTime: number,
    totalWords: number,
  ): LiveStatistics {
    const { correctChars, incorrectChars, totalChars, extraChars, missedChars } =
      this.countCharacters(words);

    const { correctWords, incorrectWords } = this.countWords(words);

    const completedWords = words.filter((w) => w.isCompleted).length;
    const progress = totalWords > 0 ? (completedWords / totalWords) * 100 : 0;

    // Calculate WPM (Words Per Minute)
    // Standard: 1 word = 5 characters
    const elapsedMinutes = Math.max(elapsedTime / 60000, 0.01); // Prevent division by zero
    const grossWpm = correctChars / 5 / elapsedMinutes;
    const errorsPerMinute = incorrectChars / 5 / elapsedMinutes;
    const wpm = Math.max(0, Math.round(grossWpm - errorsPerMinute));

    // Calculate Raw WPM (without error adjustment)
    const rawWpm = Math.round(totalChars / 5 / elapsedMinutes);

    // Calculate CPM (Characters Per Minute)
    const cpm = Math.round(correctChars / elapsedMinutes);

    // Calculate Accuracy
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 100;

    // Calculate Error Rate
    const errorRate = totalChars > 0 ? (incorrectChars / totalChars) * 100 : 0;

    // Calculate Consistency (placeholder - requires historical data)
    const consistency = 100; // Will be calculated from segments

    return {
      wpm,
      rawWpm,
      cpm,
      accuracy: Math.round(accuracy * 10) / 10,
      errorRate: Math.round(errorRate * 10) / 10,
      correctChars,
      incorrectChars,
      totalChars,
      extraChars,
      missedChars,
      correctWords,
      incorrectWords,
      totalWords,
      consistency,
      progress: Math.round(progress * 10) / 10,
      completedWords,
      remainingWords: totalWords - completedWords,
      elapsedTime,
      remainingTime: null, // Set by timer manager
    };
  }

  /**
   * Count characters
   */
  private static countCharacters(words: Word[]): {
    correctChars: number;
    incorrectChars: number;
    totalChars: number;
    extraChars: number;
    missedChars: number;
  } {
    let correctChars = 0;
    let incorrectChars = 0;
    let totalChars = 0;
    const extraChars = 0;
    let missedChars = 0;

    words.forEach((word) => {
      word.characters.forEach((char) => {
        if (char.typed) {
          totalChars++;
          if (char.isCorrect) {
            correctChars++;
          } else {
            incorrectChars++;
          }
        } else if (char.skipped) {
          missedChars++;
        }
      });

      // Count extra characters (typed beyond word length)
      // This would require tracking in the input manager
    });

    return { correctChars, incorrectChars, totalChars, extraChars, missedChars };
  }

  /**
   * Count words
   */
  private static countWords(words: Word[]): {
    correctWords: number;
    incorrectWords: number;
  } {
    let correctWords = 0;
    let incorrectWords = 0;

    words.forEach((word) => {
      if (word.isCompleted) {
        if (word.isCorrect) {
          correctWords++;
        } else {
          incorrectWords++;
        }
      }
    });

    return { correctWords, incorrectWords };
  }

  /**
   * Calculate consistency from typing segments
   */
  static calculateConsistency(segments: TypingSegment[]): number {
    if (segments.length < 2) return 100;

    const wpmValues = segments.map((s) => s.wpm);
    const mean = wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length;

    // Calculate standard deviation
    const variance =
      wpmValues.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) /
      wpmValues.length;
    const stdDev = Math.sqrt(variance);

    // Calculate coefficient of variation (CV)
    const cv = mean > 0 ? (stdDev / mean) * 100 : 0;

    // Convert to consistency score (lower CV = higher consistency)
    // 100 = perfect consistency, 0 = very inconsistent
    const consistency = Math.max(0, 100 - cv);

    return Math.round(consistency);
  }

  /**
   * Calculate average word time
   */
  static calculateAverageWordTime(words: Word[]): number {
    const completedWords = words.filter(
      (w) => w.isCompleted && w.startTime !== null && w.endTime !== null,
    );

    if (completedWords.length === 0) return 0;

    const totalTime = completedWords.reduce((sum, word) => {
      return sum + (word.endTime! - word.startTime!);
    }, 0);

    return totalTime / completedWords.length;
  }

  /**
   * Find fastest and slowest words
   */
  static findWordExtremes(words: Word[]): {
    fastest: { text: string; time: number } | null;
    slowest: { text: string; time: number } | null;
  } {
    const completedWords = words.filter(
      (w) => w.isCompleted && w.startTime !== null && w.endTime !== null,
    );

    if (completedWords.length === 0) {
      return { fastest: null, slowest: null };
    }

    let fastest = completedWords[0];
    let slowest = completedWords[0];

    completedWords.forEach((word) => {
      const time = word.endTime! - word.startTime!;
      const fastestTime = fastest!.endTime! - fastest!.startTime!;
      const slowestTime = slowest!.endTime! - slowest!.startTime!;

      if (time < fastestTime) {
        fastest = word;
      }
      if (time > slowestTime) {
        slowest = word;
      }
    });

    return {
      fastest: fastest
        ? {
            text: fastest.text,
            time: fastest.endTime! - fastest.startTime!,
          }
        : null,
      slowest: slowest
        ? {
            text: slowest.text,
            time: slowest.endTime! - slowest.startTime!,
          }
        : null,
    };
  }

  /**
   * Calculate character-specific statistics
   */
  static calculateCharacterStats(words: Word[]): Map<
    string,
    {
      total: number;
      correct: number;
      incorrect: number;
      accuracy: number;
    }
  > {
    const charStats = new Map<
      string,
      { total: number; correct: number; incorrect: number; accuracy: number }
    >();

    words.forEach((word) => {
      word.characters.forEach((char) => {
        if (!char.typed) return;

        const current = charStats.get(char.char) ?? {
          total: 0,
          correct: 0,
          incorrect: 0,
          accuracy: 0,
        };

        current.total++;
        if (char.isCorrect) {
          current.correct++;
        } else {
          current.incorrect++;
        }
        current.accuracy =
          current.total > 0 ? (current.correct / current.total) * 100 : 0;

        charStats.set(char.char, current);
      });
    });

    return charStats;
  }

  /**
   * Generate typing segments for consistency analysis
   */
  static generateSegments(
    words: Word[],
    segmentDuration: number = 5000, // 5 seconds
  ): TypingSegment[] {
    const segments: TypingSegment[] = [];
    const completedWords = words.filter((w) => w.isCompleted);

    if (completedWords.length === 0) return segments;

    const startTime = completedWords[0]!.startTime!;
    const endTime = completedWords[completedWords.length - 1]!.endTime!;
    const duration = endTime - startTime;

    const segmentCount = Math.ceil(duration / segmentDuration);

    for (let i = 0; i < segmentCount; i++) {
      const segmentStart = startTime + i * segmentDuration;
      const segmentEnd = segmentStart + segmentDuration;

      const segmentWords = completedWords.filter(
        (w) => w.startTime! >= segmentStart && w.endTime! <= segmentEnd,
      );

      if (segmentWords.length === 0) continue;

      const characterCount = segmentWords.reduce((sum, w) => sum + w.text.length, 0);
      const correctChars = segmentWords.reduce((sum, w) => {
        return sum + w.characters.filter((c) => c.typed && c.isCorrect).length;
      }, 0);

      const segmentMinutes = segmentDuration / 60000;
      const wpm = Math.round(correctChars / 5 / segmentMinutes);
      const accuracy = characterCount > 0 ? (correctChars / characterCount) * 100 : 100;

      segments.push({
        startTime: segmentStart,
        endTime: segmentEnd,
        wpm,
        accuracy: Math.round(accuracy * 10) / 10,
        characterCount,
      });
    }

    return segments;
  }
}
