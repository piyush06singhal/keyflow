/**
 * Typing Engine - Public API
 *
 * Exports all public interfaces and classes for the typing engine.
 */

// Main Engine
export { TypingEngine } from "./typing-engine";

// Types
export type {
  // Configuration
  TypingEngineConfig,
  PracticeMode,
  TimerMode,
  Language,
  Difficulty,

  // Session
  SessionStatus,
  SessionState,
  SessionResult,
  SessionSnapshot,

  // Text & Cursor
  Character,
  Word,
  CursorPosition,

  // Input
  KeyEvent,
  InputAction,

  // Statistics
  LiveStatistics,
  MistakeRecord,
  TypingSegment,

  // Events
  EngineEventType,
  EngineEvent,
  EventListener,
  EventUnsubscribe,
} from "./types";

// Errors
export { TypingEngineError } from "./types";

// Core Managers (for advanced usage)
export { EventDispatcher } from "./core/event-dispatcher";
export { ConfigManager, DEFAULT_CONFIG } from "./core/config-manager";
export { TimerManager } from "./core/timer-manager";
export { CursorManager } from "./core/cursor-manager";

// Input
export { InputManager } from "./input/input-manager";

// Text Generation
export { TextGenerator } from "./text/text-generator";
export { commonWords, programmingWords } from "./text/word-lists";

// Statistics
export { StatisticsCalculator } from "./statistics/statistics-calculator";
export { MistakeTracker } from "./statistics/mistake-tracker";
