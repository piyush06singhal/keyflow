/**
 * Mistake Tracker
 * 
 * Tracks and analyzes typing mistakes.
 */

import type { MistakeRecord } from "../types";
import { EventDispatcher } from "../core/event-dispatcher";

export class MistakeTracker {
  private mistakes: MistakeRecord[];
  private eventDispatcher: EventDispatcher;
  private mistakeIdCounter: number;

  constructor(eventDispatcher: EventDispatcher) {
    this.mistakes = [];
    this.eventDispatcher = eventDispatcher;
    this.mistakeIdCounter = 0;
  }

  /**
   * Record a new mistake
   */
  recordMistake(
    wordIndex: number,
    charIndex: number,
    expected: string,
    typed: string
  ): MistakeRecord {
    const mistake: MistakeRecord = {
      id: `mistake-${this.mistakeIdCounter++}`,
      timestamp: Date.now(),
      wordIndex,
      charIndex,
      expected,
      typed,
      corrected: false,
      correctionTime: null,
    };

    this.mistakes.push(mistake);
    this.eventDispatcher.emit("mistake:recorded", mistake);

    return mistake;
  }

  /**
   * Mark a mistake as corrected
   */
  markCorrected(mistakeId: string): void {
    const mistake = this.mistakes.find((m) => m.id === mistakeId);
    if (mistake && !mistake.corrected) {
      mistake.corrected = true;
      mistake.correctionTime = Date.now() - mistake.timestamp;
      this.eventDispatcher.emit("mistake:corrected", mistake);
    }
  }

  /**
   * Get all mistakes
   */
  getMistakes(): MistakeRecord[] {
    return [...this.mistakes];
  }

  /**
   * Get uncorrected mistakes
   */
  getUncorrectedMistakes(): MistakeRecord[] {
    return this.mistakes.filter((m) => !m.corrected);
  }

  /**
   * Get corrected mistakes
   */
  getCorrectedMistakes(): MistakeRecord[] {
    return this.mistakes.filter((m) => m.corrected);
  }

  /**
   * Get mistake count
   */
  getMistakeCount(): number {
    return this.mistakes.length;
  }

  /**
   * Get average correction time
   */
  getAverageCorrectionTime(): number {
    const corrected = this.getCorrectedMistakes();
    if (corrected.length === 0) return 0;

    const totalTime = corrected.reduce(
      (sum, m) => sum + (m.correctionTime ?? 0),
      0
    );
    return totalTime / corrected.length;
  }

  /**
   * Get mistakes by character
   */
  getMistakesByCharacter(): Map<string, number> {
    const charMistakes = new Map<string, number>();

    this.mistakes.forEach((mistake) => {
      const count = charMistakes.get(mistake.expected) ?? 0;
      charMistakes.set(mistake.expected, count + 1);
    });

    return charMistakes;
  }

  /**
   * Get most common mistakes
   */
  getMostCommonMistakes(limit: number = 5): Array<{
    expected: string;
    typed: string;
    count: number;
  }> {
    const mistakeMap = new Map<string, { expected: string; typed: string; count: number }>();

    this.mistakes.forEach((mistake) => {
      const key = `${mistake.expected}-${mistake.typed}`;
      const current = mistakeMap.get(key);

      if (current) {
        current.count++;
      } else {
        mistakeMap.set(key, {
          expected: mistake.expected,
          typed: mistake.typed,
          count: 1,
        });
      }
    });

    return Array.from(mistakeMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Clear all mistakes
   */
  clear(): void {
    this.mistakes = [];
    this.mistakeIdCounter = 0;
  }
}
