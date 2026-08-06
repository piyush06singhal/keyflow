/**
 * Input Manager
 *
 * Handles keyboard input, validation, and input action recording.
 */

import type {
  KeyEvent,
  InputAction,
  CursorPosition,
  Word,
  TypingEngineConfig,
} from "../types";
import { type EventDispatcher } from "../core/event-dispatcher";

export class InputManager {
  private config: TypingEngineConfig;
  private eventDispatcher: EventDispatcher;
  private inputHistory: InputAction[];
  private isComposing: boolean;

  constructor(config: TypingEngineConfig, eventDispatcher: EventDispatcher) {
    this.config = config;
    this.eventDispatcher = eventDispatcher;
    this.inputHistory = [];
    this.isComposing = false;
  }

  /**
   * Process a keyboard event
   */
  processKeyEvent(
    event: KeyboardEvent,
    currentCursor: CursorPosition,
    words: Word[],
  ): {
    action: InputAction | null;
    shouldPreventDefault: boolean;
  } {
    // Ignore composition events (IME input)
    if (this.isComposing) {
      return { action: null, shouldPreventDefault: false };
    }

    const keyEvent = this.normalizeKeyEvent(event);

    // Handle special keys
    if (keyEvent.isBackspace) {
      if (!this.config.allowBackspace) {
        return { action: null, shouldPreventDefault: true };
      }
      return this.handleBackspace(currentCursor, words);
    }

    // Prevent paste
    if ((keyEvent.ctrlKey || keyEvent.metaKey) && keyEvent.key === "v") {
      return { action: null, shouldPreventDefault: true };
    }

    // Handle Tab (prevent focus change)
    if (keyEvent.key === "Tab") {
      return { action: null, shouldPreventDefault: true };
    }

    const isCoding = this.config.mode === "coding";

    // In coding mode, Enter is the line boundary (inline spaces are
    // literal characters instead). Everywhere else Enter is ignored.
    if (keyEvent.key === "Enter") {
      if (isCoding) {
        return this.handleBoundary("\n", currentCursor);
      }
      return { action: null, shouldPreventDefault: false };
    }

    // Ignore modifier keys alone
    if (keyEvent.isModifier) {
      return { action: null, shouldPreventDefault: false };
    }

    // Handle space — a literal character in coding mode, a word boundary
    // everywhere else.
    if (keyEvent.isSpace) {
      if (isCoding) {
        return this.handleCharacter(" ", currentCursor, words);
      }
      return this.handleBoundary(" ", currentCursor);
    }

    // Handle character input
    if (this.isValidCharacter(keyEvent.key)) {
      return this.handleCharacter(keyEvent.key, currentCursor, words);
    }

    return { action: null, shouldPreventDefault: false };
  }

  /**
   * Handle character input
   */
  private handleCharacter(
    char: string,
    currentCursor: CursorPosition,
    _words: Word[],
  ): {
    action: InputAction;
    shouldPreventDefault: boolean;
  } {
    const action: InputAction = {
      type: "character",
      value: char,
      timestamp: Date.now(),
      cursorBefore: { ...currentCursor },
      cursorAfter: {
        ...currentCursor,
        charIndex: currentCursor.charIndex + 1,
        absoluteIndex: currentCursor.absoluteIndex + 1,
      },
    };

    this.inputHistory.push(action);
    return { action, shouldPreventDefault: true };
  }

  /**
   * Handle a word/line boundary keypress (space in normal modes, Enter in
   * coding mode) — advances to the start of the next word.
   */
  private handleBoundary(
    value: string,
    currentCursor: CursorPosition,
  ): {
    action: InputAction;
    shouldPreventDefault: boolean;
  } {
    const action: InputAction = {
      type: "character",
      value,
      timestamp: Date.now(),
      cursorBefore: { ...currentCursor },
      cursorAfter: {
        wordIndex: currentCursor.wordIndex + 1,
        charIndex: 0,
        absoluteIndex: currentCursor.absoluteIndex + 1,
      },
    };

    this.inputHistory.push(action);
    return { action, shouldPreventDefault: true };
  }

  /**
   * Handle backspace input
   */
  private handleBackspace(
    currentCursor: CursorPosition,
    words: Word[],
  ): {
    action: InputAction;
    shouldPreventDefault: boolean;
  } {
    // Can't backspace at the beginning
    if (currentCursor.absoluteIndex === 0) {
      return { action: null as never, shouldPreventDefault: true };
    }

    let newCursor: CursorPosition;

    if (currentCursor.charIndex === 0) {
      // Move to previous word
      const prevWordIndex = currentCursor.wordIndex - 1;
      if (prevWordIndex < 0) {
        return { action: null as never, shouldPreventDefault: true };
      }

      const prevWord = words[prevWordIndex];
      if (!prevWord) {
        return { action: null as never, shouldPreventDefault: true };
      }

      newCursor = {
        wordIndex: prevWordIndex,
        charIndex: prevWord.text.length,
        absoluteIndex: currentCursor.absoluteIndex - 1,
      };
    } else {
      // Move back one character in current word
      newCursor = {
        ...currentCursor,
        charIndex: currentCursor.charIndex - 1,
        absoluteIndex: currentCursor.absoluteIndex - 1,
      };
    }

    const action: InputAction = {
      type: "backspace",
      value: "",
      timestamp: Date.now(),
      cursorBefore: { ...currentCursor },
      cursorAfter: newCursor,
    };

    this.inputHistory.push(action);
    return { action, shouldPreventDefault: true };
  }

  /**
   * Normalize keyboard event
   */
  private normalizeKeyEvent(event: KeyboardEvent): KeyEvent {
    return {
      key: event.key,
      code: event.code,
      timestamp: Date.now(),
      isBackspace: event.key === "Backspace",
      isSpace: event.key === " ",
      isModifier: this.isModifierKey(event.key),
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
    };
  }

  /**
   * Check if key is a modifier
   */
  private isModifierKey(key: string): boolean {
    return [
      "Control",
      "Alt",
      "Shift",
      "Meta",
      "CapsLock",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ].includes(key);
  }

  /**
   * Check if character is valid for typing
   */
  private isValidCharacter(char: string): boolean {
    // Single printable character
    if (char.length !== 1) return false;

    // Check if it's a printable character
    const code = char.charCodeAt(0);
    return code >= 32 && code <= 126;
  }

  /**
   * Handle composition start (IME)
   */
  onCompositionStart(): void {
    this.isComposing = true;
  }

  /**
   * Handle composition end (IME)
   */
  onCompositionEnd(): void {
    this.isComposing = false;
  }

  /**
   * Get input history
   */
  getInputHistory(): InputAction[] {
    return [...this.inputHistory];
  }

  /**
   * Clear input history
   */
  clearHistory(): void {
    this.inputHistory = [];
  }

  /**
   * Update configuration
   */
  updateConfig(config: TypingEngineConfig): void {
    this.config = config;
  }
}
