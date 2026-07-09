/**
 * Typing Engine
 *
 * Main engine class that orchestrates all typing functionality.
 * Framework-independent and reusable across the entire platform.
 */

import type {
  TypingEngineConfig,
  SessionState,
  SessionStatus,
  SessionResult,
  Word,
  LiveStatistics,
  CursorPosition,
  InputAction,
  SessionSnapshot,
  EventUnsubscribe,
  EngineEventType,
  EventListener,
} from "./types";
import { TypingEngineError } from "./types";
import { EventDispatcher } from "./core/event-dispatcher";
import { ConfigManager } from "./core/config-manager";
import { TimerManager } from "./core/timer-manager";
import { CursorManager } from "./core/cursor-manager";
import { InputManager } from "./input/input-manager";
import { TextGenerator } from "./text/text-generator";
import { StatisticsCalculator } from "./statistics/statistics-calculator";
import { MistakeTracker } from "./statistics/mistake-tracker";

export class TypingEngine {
  // Core managers
  private eventDispatcher: EventDispatcher;
  private configManager: ConfigManager;
  private timerManager: TimerManager | null;
  private cursorManager: CursorManager | null;
  private inputManager: InputManager;
  private mistakeTracker: MistakeTracker;
  private timerExpiredUnsubscribe: (() => void) | null = null;

  // Session state
  private sessionId: string;
  private sessionState: SessionState;
  private words: Word[];
  private textContent: string;

  // Statistics
  private liveStats: LiveStatistics | null;

  constructor(config?: Partial<TypingEngineConfig>) {
    // Initialize core managers
    this.eventDispatcher = new EventDispatcher();
    this.configManager = new ConfigManager(config);
    this.timerManager = null;
    this.cursorManager = null;
    this.inputManager = new InputManager(
      this.configManager.getConfig(),
      this.eventDispatcher,
    );
    this.mistakeTracker = new MistakeTracker(this.eventDispatcher);

    // Initialize session state
    this.sessionId = this.generateSessionId();
    this.sessionState = this.createInitialSessionState();
    this.words = [];
    this.textContent = "";
    this.liveStats = null;
  }

  // ============================================================================
  // Session Lifecycle
  // ============================================================================

  /**
   * Initialize the session with text content.
   * Safe to call multiple times — resets all state for a fresh session.
   */
  initialize(): void {
    // Stop any running timer/intervals first
    this.timerManager?.destroy();
    this.timerManager = null;

    // Reset session state to idle
    this.sessionId = this.generateSessionId();
    this.sessionState = this.createInitialSessionState();
    this.words = [];
    this.textContent = "";
    this.liveStats = null;
    this.mistakeTracker = new MistakeTracker(this.eventDispatcher);
    this.inputManager = new InputManager(
      this.configManager.getConfig(),
      this.eventDispatcher,
    );

    // Generate text content
    const config = this.configManager.getConfig();
    this.textContent = TextGenerator.generate(config);
    this.words = TextGenerator.parseText(this.textContent);

    // Initialize cursor
    this.cursorManager = new CursorManager(this.words);

    // Initialize timer
    this.timerManager = new TimerManager(
      config.timerMode,
      config.duration,
      this.eventDispatcher,
    );

    // Listen for timer expiration — clean up previous listener first
    this.timerExpiredUnsubscribe?.();
    this.timerExpiredUnsubscribe = this.eventDispatcher.on("timer:expired", () => {
      if (this.getStatus() === "active") {
        this.complete();
      }
    });

    // Update state
    this.sessionState.status = "ready";
    this.liveStats = this.calculateStatistics();

    this.eventDispatcher.emit(
      "session:ready" as EngineEventType,
      {
        sessionId: this.sessionId,
        textContent: this.textContent,
        wordCount: this.words.length,
      } as unknown as SessionResult,
    );
  }

  /**
   * Start the typing session
   */
  start(): void {
    if (this.sessionState.status !== "ready") {
      throw new TypingEngineError(
        "Session must be initialized before starting",
        "NOT_READY",
      );
    }

    this.sessionState.status = "active";
    this.sessionState.startTime = Date.now();
    this.timerManager?.start();

    this.eventDispatcher.emit("session:started", {
      sessionId: this.sessionId,
      startTime: this.sessionState.startTime,
    });
  }

  /**
   * Pause the session
   */
  pause(): void {
    if (this.sessionState.status !== "active") {
      throw new TypingEngineError("Session is not active", "NOT_ACTIVE");
    }

    this.sessionState.status = "paused";
    this.sessionState.pauseStartTime = Date.now();
    this.timerManager?.pause();

    this.eventDispatcher.emit("session:paused", {
      sessionId: this.sessionId,
      pauseTime: this.sessionState.pauseStartTime,
    });
  }

  /**
   * Resume the session
   */
  resume(): void {
    if (this.sessionState.status !== "paused") {
      throw new TypingEngineError("Session is not paused", "NOT_PAUSED");
    }

    if (this.sessionState.pauseStartTime) {
      const pauseDuration = Date.now() - this.sessionState.pauseStartTime;
      this.sessionState.pausedTime += pauseDuration;
      this.sessionState.pauseStartTime = null;
    }

    this.sessionState.status = "active";
    this.timerManager?.resume();

    this.eventDispatcher.emit("session:resumed", {
      sessionId: this.sessionId,
      resumeTime: Date.now(),
    });
  }

  /**
   * Complete the session
   */
  complete(): SessionResult {
    if (
      this.sessionState.status !== "active" &&
      this.sessionState.status !== "paused"
    ) {
      throw new TypingEngineError("Session is not active", "NOT_ACTIVE");
    }

    this.sessionState.status = "completed";
    this.sessionState.endTime = Date.now();
    this.timerManager?.stop();

    const result = this.generateResult();

    this.eventDispatcher.emit("session:completed", result);

    return result;
  }

  /**
   * Cancel the session
   */
  cancel(): void {
    this.sessionState.status = "cancelled";
    this.sessionState.endTime = Date.now();
    this.timerManager?.stop();

    this.eventDispatcher.emit("session:cancelled", {
      sessionId: this.sessionId,
      cancelTime: this.sessionState.endTime,
    });
  }

  // ============================================================================
  // Input Processing
  // ============================================================================

  /**
   * Process keyboard input
   */
  processInput(event: KeyboardEvent): void {
    if (this.sessionState.status !== "active") {
      return;
    }

    if (!this.cursorManager) {
      throw new TypingEngineError("Cursor manager not initialized", "NOT_INITIALIZED");
    }

    const currentCursor = this.cursorManager.getPosition();
    const { action, shouldPreventDefault } = this.inputManager.processKeyEvent(
      event,
      currentCursor,
      this.words,
    );

    if (shouldPreventDefault) {
      event.preventDefault();
    }

    if (action) {
      this.handleInputAction(action);
    }
  }

  /**
   * Handle input action
   */
  private handleInputAction(action: InputAction): void {
    if (!this.cursorManager) return;

    if (action.type === "character") {
      this.handleCharacterInput(action.value);
    } else if (action.type === "backspace") {
      this.handleBackspace();
    }

    // Update cursor position
    const previousCursor = this.cursorManager.getPosition();
    this.cursorManager.setPosition(action.cursorAfter);
    this.eventDispatcher.emit("cursor:moved", action.cursorAfter);

    // Track word start times for duration and consistency metrics
    if (action.cursorAfter.wordIndex > previousCursor.wordIndex) {
      const nextWord = this.words[action.cursorAfter.wordIndex];
      if (nextWord && nextWord.startTime === null) {
        nextWord.startTime = Date.now();
      }
    }

    // Update statistics
    this.liveStats = this.calculateStatistics();
    this.eventDispatcher.emit("statistics:updated", this.liveStats);

    // Check for completion
    if (this.cursorManager.isAtEnd()) {
      this.complete();
    }

    // Check for timer expiration
    if (this.sessionState.status === "active" && this.timerManager?.isExpired()) {
      this.complete();
    }
  }

  /**
   * Handle character input
   */
  private handleCharacterInput(char: string): void {
    if (!this.cursorManager) return;

    const cursor = this.cursorManager.getPosition();
    const word = this.words[cursor.wordIndex];
    if (!word) return;

    // Handle space (word completion)
    if (char === " ") {
      this.completeWord(word);
      return;
    }

    // Get expected character
    const expectedChar = word.text[cursor.charIndex];
    if (!expectedChar) return;

    const character = word.characters[cursor.charIndex];
    if (!character) return;

    // Check if correct
    const isCorrect = char === expectedChar;
    character.isCorrect = isCorrect;
    character.typed = true;
    character.timestamp = Date.now();

    // Record mistake if incorrect
    if (!isCorrect) {
      this.mistakeTracker.recordMistake(
        cursor.wordIndex,
        cursor.charIndex,
        expectedChar,
        char,
      );

      this.eventDispatcher.emit("character:incorrect", {
        expected: expectedChar,
        typed: char,
        position: cursor,
      });
    } else {
      this.eventDispatcher.emit("character:correct", {
        char,
        position: cursor,
      });
    }

    this.eventDispatcher.emit("character:typed", {
      char,
      isCorrect,
      position: cursor,
    });
  }

  /**
   * Handle backspace
   */
  private handleBackspace(): void {
    if (!this.cursorManager) return;

    const cursor = this.cursorManager.getPosition();
    const word = this.words[cursor.wordIndex];
    if (!word) return;

    const charIndex = cursor.charIndex - 1;
    if (charIndex < 0) return;

    const character = word.characters[charIndex];
    if (!character) return;

    // Reset character state
    character.isCorrect = null;
    character.typed = false;
    character.timestamp = null;

    this.eventDispatcher.emit("character:deleted", {
      char: character.char,
      position: cursor,
    });
  }

  /**
   * Complete a word
   */
  private completeWord(word: Word): void {
    word.isCompleted = true;
    word.endTime = Date.now();

    // Check if word is correct
    word.isCorrect = word.characters.every((c) => c.typed && c.isCorrect);

    this.eventDispatcher.emit("word:completed", {
      word: word.text,
      isCorrect: word.isCorrect,
      time: word.endTime - (word.startTime ?? word.endTime),
    });
  }

  // ============================================================================
  // Statistics
  // ============================================================================

  /**
   * Calculate current statistics
   */
  private calculateStatistics(): LiveStatistics {
    const elapsedTime = this.getElapsedTime();
    return StatisticsCalculator.calculateLive(
      this.words,
      elapsedTime,
      this.words.length,
    );
  }

  /**
   * Get live statistics
   */
  getStatistics(): LiveStatistics | null {
    return this.liveStats;
  }

  // ============================================================================
  // Getters
  // ============================================================================

  getSessionId(): string {
    return this.sessionId;
  }

  getStatus(): SessionStatus {
    return this.sessionState.status;
  }

  getWords(): ReadonlyArray<Readonly<Word>> {
    return this.words;
  }

  getTextContent(): string {
    return this.textContent;
  }

  getCursorPosition(): CursorPosition | null {
    return this.cursorManager?.getPosition() ?? null;
  }

  getElapsedTime(): number {
    if (!this.sessionState.startTime) return 0;

    const now = Date.now();
    const elapsed = now - this.sessionState.startTime;

    let adjustedPausedTime = this.sessionState.pausedTime;
    if (this.sessionState.pauseStartTime) {
      adjustedPausedTime += now - this.sessionState.pauseStartTime;
    }

    return Math.max(0, elapsed - adjustedPausedTime);
  }

  getConfig(): Readonly<TypingEngineConfig> {
    return this.configManager.getConfig();
  }

  /**
   * Update configuration (takes effect on next initialize)
   */
  updateConfig(updates: Partial<TypingEngineConfig>): void {
    this.configManager.updateConfig(updates);
  }

  // ============================================================================
  // Events
  // ============================================================================

  on<T = unknown>(
    eventType: EngineEventType,
    listener: EventListener<T>,
  ): EventUnsubscribe {
    return this.eventDispatcher.on(eventType, listener);
  }

  once<T = unknown>(
    eventType: EngineEventType,
    listener: EventListener<T>,
  ): EventUnsubscribe {
    return this.eventDispatcher.once(eventType, listener);
  }

  // ============================================================================
  // Persistence
  // ============================================================================

  /**
   * Create a snapshot of current session
   */
  createSnapshot(): SessionSnapshot {
    return {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      config: this.configManager.getConfig(),
      state: { ...this.sessionState },
      words: this.words.map((w) => ({ ...w })),
      cursor: this.cursorManager?.getPosition() ?? {
        wordIndex: 0,
        charIndex: 0,
        absoluteIndex: 0,
      },
      statistics: this.liveStats ?? this.calculateStatistics(),
      mistakes: this.mistakeTracker.getMistakes(),
      inputHistory: this.inputManager.getInputHistory(),
    };
  }

  /**
   * Restore from snapshot
   */
  restoreFromSnapshot(snapshot: SessionSnapshot): void {
    this.sessionId = snapshot.sessionId;
    this.sessionState = { ...snapshot.state };
    this.words = snapshot.words.map((w) => ({ ...w }));
    this.textContent = snapshot.words.map((w) => w.text).join(" ");

    this.configManager.fromJSON(snapshot.config);
    this.cursorManager = new CursorManager(this.words);
    this.cursorManager.setPosition(snapshot.cursor);

    this.liveStats = snapshot.statistics;
  }

  // ============================================================================
  // Result Generation
  // ============================================================================

  private generateResult(): SessionResult {
    const finalStats = this.calculateStatistics();
    const segments = StatisticsCalculator.generateSegments(this.words);
    const consistency = StatisticsCalculator.calculateConsistency(segments);
    const wordStats = StatisticsCalculator.findWordExtremes(this.words);
    const characterStats = StatisticsCalculator.calculateCharacterStats(this.words);

    return {
      sessionId: this.sessionId,
      timestamp: this.sessionState.startTime ?? Date.now(),
      duration: this.getElapsedTime(),
      mode: this.configManager.get("mode"),
      config: this.configManager.getConfig(),
      finalStats,
      averageWpm: finalStats.wpm,
      peakWpm: Math.max(...segments.map((s) => s.wpm), finalStats.wpm),
      finalWpm: finalStats.wpm,
      averageAccuracy: finalStats.accuracy,
      finalAccuracy: finalStats.accuracy,
      consistency,
      mistakes: this.mistakeTracker.getMistakes(),
      segments,
      characterStats,
      wordStats: {
        averageWordTime: StatisticsCalculator.calculateAverageWordTime(this.words),
        fastestWord: wordStats.fastest,
        slowestWord: wordStats.slowest,
      },
      completed: this.cursorManager?.isAtEnd() ?? false,
      completionPercentage: this.cursorManager?.getProgress() ?? 0,
      inputHistory: this.inputManager.getInputHistory(),
      textContent: this.textContent,
    };
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  private createInitialSessionState(): SessionState {
    return {
      status: "idle",
      startTime: null,
      endTime: null,
      pausedTime: 0,
      pauseStartTime: null,
      elapsedTime: 0,
    };
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean up and destroy the engine
   */
  destroy(): void {
    this.timerManager?.destroy();
    this.eventDispatcher.destroy();
  }
}
