/**
 * Cursor Manager
 * 
 * Manages cursor position and movement through the typing text.
 */

import type { CursorPosition, Word } from "../types";

export class CursorManager {
  private cursor: CursorPosition;
  private words: Word[];

  constructor(words: Word[]) {
    this.words = words;
    this.cursor = {
      wordIndex: 0,
      charIndex: 0,
      absoluteIndex: 0,
    };
  }

  /**
   * Get current cursor position
   */
  getPosition(): Readonly<CursorPosition> {
    return { ...this.cursor };
  }

  /**
   * Set cursor position
   */
  setPosition(position: CursorPosition): void {
    this.cursor = { ...position };
  }

  /**
   * Move cursor forward by one character
   */
  moveForward(): boolean {
    const currentWord = this.words[this.cursor.wordIndex];
    if (!currentWord) return false;

    // Check if we're at the end of the current word
    if (this.cursor.charIndex >= currentWord.text.length) {
      // Move to next word
      return this.moveToNextWord();
    }

    // Move to next character in current word
    this.cursor.charIndex++;
    this.cursor.absoluteIndex++;
    return true;
  }

  /**
   * Move cursor backward by one character
   */
  moveBackward(): boolean {
    if (this.cursor.absoluteIndex === 0) {
      return false; // Already at the start
    }

    if (this.cursor.charIndex === 0) {
      // Move to previous word
      return this.moveToPreviousWord();
    }

    // Move back one character in current word
    this.cursor.charIndex--;
    this.cursor.absoluteIndex--;
    return true;
  }

  /**
   * Move to next word
   */
  moveToNextWord(): boolean {
    if (this.cursor.wordIndex >= this.words.length - 1) {
      return false; // Already at last word
    }

    this.cursor.wordIndex++;
    this.cursor.charIndex = 0;
    this.cursor.absoluteIndex++;
    return true;
  }

  /**
   * Move to previous word
   */
  moveToPreviousWord(): boolean {
    if (this.cursor.wordIndex === 0) {
      return false; // Already at first word
    }

    const prevWord = this.words[this.cursor.wordIndex - 1];
    if (!prevWord) return false;

    this.cursor.wordIndex--;
    this.cursor.charIndex = prevWord.text.length;
    this.cursor.absoluteIndex--;
    return true;
  }

  /**
   * Get current word
   */
  getCurrentWord(): Word | null {
    return this.words[this.cursor.wordIndex] ?? null;
  }

  /**
   * Get current character
   */
  getCurrentCharacter(): string | null {
    const word = this.getCurrentWord();
    if (!word) return null;

    return word.text[this.cursor.charIndex] ?? null;
  }

  /**
   * Check if cursor is at the end of the text
   */
  isAtEnd(): boolean {
    return (
      this.cursor.wordIndex >= this.words.length - 1 &&
      this.cursor.charIndex >= (this.words[this.cursor.wordIndex]?.text.length ?? 0)
    );
  }

  /**
   * Check if cursor is at the start of the text
   */
  isAtStart(): boolean {
    return this.cursor.absoluteIndex === 0;
  }

  /**
   * Get completed words count
   */
  getCompletedWordsCount(): number {
    return this.cursor.wordIndex;
  }

  /**
   * Get remaining words count
   */
  getRemainingWordsCount(): number {
    return Math.max(0, this.words.length - this.cursor.wordIndex);
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    if (this.words.length === 0) return 100;

    const totalChars = this.words.reduce((sum, word) => sum + word.text.length, 0);
    return (this.cursor.absoluteIndex / totalChars) * 100;
  }

  /**
   * Reset cursor to start
   */
  reset(): void {
    this.cursor = {
      wordIndex: 0,
      charIndex: 0,
      absoluteIndex: 0,
    };
  }

  /**
   * Update words reference
   */
  updateWords(words: Word[]): void {
    this.words = words;
  }
}
