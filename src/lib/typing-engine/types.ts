/**
 * Core Typing Engine - Type Definitions
 *
 * Framework-independent type definitions for the typing engine.
 * These types are used across all engine modules.
 */

// ============================================================================
// Configuration Types
// ============================================================================

export type PracticeMode =
  | "word"
  | "paragraph"
  | "quote"
  | "story"
  | "custom"
  | "infinite"
  | "zen"
  | "coding"
  | "ai-generated"
  | "multiplayer"
  | "game";

export type TimerMode = "countdown" | "elapsed" | "untimed";

export type Language = "english" | "spanish" | "french" | "german" | "custom";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface TypingEngineConfig {
  // Mode settings
  mode: PracticeMode;
  timerMode: TimerMode;
  duration?: number; // in seconds, required for countdown mode

  // Content settings
  language: Language;
  includePunctuation: boolean;
  includeNumbers: boolean;
  includeCapitalization: boolean;
  wordCount?: number;
  customText?: string;
  customWords?: string[];

  // Difficulty settings
  difficulty?: Difficulty;

  // Feature flags
  allowBackspace: boolean;
  blindMode: boolean; // Hide text until typed (rendered by the UI layer)
  strictMode: boolean; // Require exact match including whitespace

  // Accessibility
  soundEnabled: boolean;

  // Advanced
  seedValue?: string; // For reproducible sessions
  multiplayerSessionId?: string;
  gameRules?: Record<string, unknown>;
}

// ============================================================================
// Session State Types
// ============================================================================

export type SessionStatus =
  "idle" | "ready" | "active" | "paused" | "completed" | "cancelled" | "failed";

export interface SessionState {
  status: SessionStatus;
  startTime: number | null;
  endTime: number | null;
  pausedTime: number;
  pauseStartTime: number | null;
  elapsedTime: number;
}

// ============================================================================
// Text & Cursor Types
// ============================================================================

export interface Character {
  char: string;
  index: number;
  wordIndex: number;
  isSpace: boolean;
  isCorrect: boolean | null;
  typed: boolean;
  skipped: boolean;
  timestamp: number | null;
}

export interface Word {
  text: string;
  index: number;
  characters: Character[];
  isCompleted: boolean;
  isCorrect: boolean | null;
  startTime: number | null;
  endTime: number | null;
}

export interface CursorPosition {
  wordIndex: number;
  charIndex: number;
  absoluteIndex: number;
}

// ============================================================================
// Input Types
// ============================================================================

export interface KeyEvent {
  key: string;
  code: string;
  timestamp: number;
  isBackspace: boolean;
  isSpace: boolean;
  isModifier: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export interface InputAction {
  type: "character" | "backspace" | "skip" | "paste";
  value: string;
  timestamp: number;
  cursorBefore: CursorPosition;
  cursorAfter: CursorPosition;
}

// ============================================================================
// Statistics Types
// ============================================================================

export interface LiveStatistics {
  // Speed metrics
  wpm: number; // Words Per Minute (adjusted for errors)
  rawWpm: number; // Raw WPM (without error adjustment)
  cpm: number; // Characters Per Minute

  // Accuracy metrics
  accuracy: number; // Percentage
  errorRate: number; // Percentage

  // Character counts
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  extraChars: number;
  missedChars: number;

  // Word counts
  correctWords: number;
  incorrectWords: number;
  totalWords: number;

  // Consistency
  consistency: number; // Variation in WPM over time (lower is better)

  // Progress
  progress: number; // Percentage
  completedWords: number;
  remainingWords: number;

  // Time
  elapsedTime: number; // milliseconds
  remainingTime: number | null; // milliseconds, null for untimed
}

export interface MistakeRecord {
  id: string;
  timestamp: number;
  wordIndex: number;
  charIndex: number;
  expected: string;
  typed: string;
  corrected: boolean;
  correctionTime: number | null;
}

export interface TypingSegment {
  startTime: number;
  endTime: number;
  wpm: number;
  accuracy: number;
  characterCount: number;
}

// ============================================================================
// Result Types
// ============================================================================

export interface SessionResult {
  // Session metadata
  sessionId: string;
  timestamp: number;
  duration: number; // milliseconds
  mode: PracticeMode;
  config: TypingEngineConfig;

  // Final statistics
  finalStats: LiveStatistics;

  // Performance metrics
  averageWpm: number;
  peakWpm: number;
  finalWpm: number;
  averageAccuracy: number;
  finalAccuracy: number;
  consistency: number;

  // Detailed data
  mistakes: MistakeRecord[];
  segments: TypingSegment[]; // Time-based performance segments

  // Character analysis
  characterStats: Map<
    string,
    {
      total: number;
      correct: number;
      incorrect: number;
      accuracy: number;
    }
  >;

  // Word analysis
  wordStats: {
    averageWordTime: number;
    fastestWord: { text: string; time: number } | null;
    slowestWord: { text: string; time: number } | null;
  };

  // Completion
  completed: boolean;
  completionPercentage: number;

  // Raw data for replay
  inputHistory: InputAction[];
  textContent: string;
}

// ============================================================================
// Event Types
// ============================================================================

export type EngineEventType =
  | "session:started"
  | "session:paused"
  | "session:resumed"
  | "session:completed"
  | "session:cancelled"
  | "session:failed"
  | "character:typed"
  | "character:correct"
  | "character:incorrect"
  | "character:deleted"
  | "word:completed"
  | "word:correct"
  | "word:incorrect"
  | "mistake:recorded"
  | "mistake:corrected"
  | "statistics:updated"
  | "timer:tick"
  | "timer:expired"
  | "cursor:moved"
  | "progress:updated"
  | "config:changed"
  | "content:extended";

export interface EngineEvent<T = unknown> {
  type: EngineEventType;
  timestamp: number;
  data: T;
}

export type EventListener<T = unknown> = (event: EngineEvent<T>) => void;

export type EventUnsubscribe = () => void;

// ============================================================================
// Persistence Types
// ============================================================================

export interface SessionSnapshot {
  sessionId: string;
  timestamp: number;
  config: TypingEngineConfig;
  state: SessionState;
  words: Word[];
  cursor: CursorPosition;
  statistics: LiveStatistics;
  mistakes: MistakeRecord[];
  inputHistory: InputAction[];
}

// ============================================================================
// Error Types
// ============================================================================

export class TypingEngineError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "TypingEngineError";
  }
}
