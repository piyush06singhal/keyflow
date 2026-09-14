import { useEffect, useRef, useState, useCallback } from "react";
import { TypingEngine } from "@/lib/typing-engine";
import { playKeystrokeSound } from "@/lib/audio/keystroke-sound";
import type {
  TypingEngineConfig,
  LiveStatistics,
  SessionStatus,
  Word,
  CursorPosition,
  SessionResult,
} from "@/lib/typing-engine";

/**
 * React Hook for Typing Engine Integration
 *
 * Provides a clean React interface to the framework-independent TypingEngine.
 * Handles lifecycle, event subscriptions, and state synchronization.
 */

export interface UseTypingEngineOptions {
  config: Partial<TypingEngineConfig>;
  onComplete?: (result: SessionResult) => void;
  onStatisticsUpdate?: (stats: LiveStatistics) => void;
  autoStart?: boolean;
}

export interface UseTypingEngineReturn {
  // Engine reference getter (use getEngine() instead of accessing ref during render)
  getEngine: () => TypingEngine | null;

  // State
  status: SessionStatus;
  statistics: LiveStatistics | null;
  words: ReadonlyArray<Readonly<Word>>;
  cursorPosition: CursorPosition | null;
  elapsedTime: number;

  // Actions
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: (newConfig?: Partial<TypingEngineConfig>) => void;
  cancel: () => void;

  // Refs
  inputRef: React.RefObject<HTMLDivElement | null>;
}

export function useTypingEngine({
  config,
  onComplete,
  onStatisticsUpdate,
  autoStart = false,
}: UseTypingEngineOptions): UseTypingEngineReturn {
  const engineRef = useRef<TypingEngine | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const configRef = useRef(config);
  const onCompleteRef = useRef(onComplete);
  const onStatisticsUpdateRef = useRef(onStatisticsUpdate);

  // Keep refs current
  useEffect(() => {
    configRef.current = config;
  });
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });
  useEffect(() => {
    onStatisticsUpdateRef.current = onStatisticsUpdate;
  });

  // Local state
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [statistics, setStatistics] = useState<LiveStatistics | null>(null);
  const [words, setWords] = useState<ReadonlyArray<Readonly<Word>>>(() => []);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Initialize engine once on mount
  useEffect(() => {
    const engine = new TypingEngine(config);
    engine.initialize();
    engineRef.current = engine;

    // Subscribe to events
    const unsubscribers = [
      engine.on("session:started", () => setStatus("active")),
      engine.on("session:paused", () => setStatus("paused")),
      engine.on("session:resumed", () => setStatus("active")),
      engine.on("session:completed", (event) => {
        setStatus("completed");
        const result = event.data as SessionResult;
        onCompleteRef.current?.(result);
      }),
      engine.on("session:cancelled", () => setStatus("idle")),

      engine.on("statistics:updated", (event) => {
        const stats = event.data as LiveStatistics;
        setStatistics(stats);
        onStatisticsUpdateRef.current?.(stats);
      }),

      engine.on("cursor:moved", (event) => {
        const position = event.data as CursorPosition;
        setCursorPosition(position);
      }),

      engine.on("timer:tick", (event) => {
        const state = event.data as {
          elapsedTime: number;
          remainingTime: number | null;
        };
        const isCountdown = engine.getConfig().timerMode === "countdown";
        setElapsedTime(
          isCountdown && state.remainingTime !== null
            ? state.remainingTime
            : state.elapsedTime,
        );
      }),

      engine.on("character:typed", (event) => {
        setWords([...engine.getWords()]);
        if (engine.getConfig().soundEnabled) {
          const data = event.data as { isCorrect: boolean };
          playKeystrokeSound(data.isCorrect);
        }
      }),
      engine.on("character:deleted", () => setWords([...engine.getWords()])),
      // Content extension (extendContent in typing-engine.ts) mutates the
      // engine's word list without a character being typed, so it needs
      // its own event — otherwise React wouldn't pick up the new content
      // until the next keystroke fires character:typed.
      engine.on("content:extended", () => setWords([...engine.getWords()])),
    ];

    // Update initial state from engine
    requestAnimationFrame(() => {
      setWords(engine.getWords());
      setCursorPosition(engine.getCursorPosition());
      setStatus(engine.getStatus());
    });

    if (autoStart) {
      engine.start();
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard event handler — attached to window for global input capture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine) return;

      // Keystrokes fired while an IME composition is in progress (e.g. CJK
      // text entry) carry intermediate key values that aren't the final
      // composed character, so feeding them to the engine would garble the
      // session. `KeyboardEvent.isComposing` is the standards way to detect
      // this; the compositionstart/compositionend listeners below additionally
      // gate the engine for browsers/IMEs that don't set the flag on keydown.
      if (e.isComposing) return;

      const engineStatus = engine.getStatus();

      // If ready, start the session on first real keypress
      if (engineStatus === "ready") {
        const isModifier = [
          "Control",
          "Alt",
          "Shift",
          "Meta",
          "Escape",
          "F1",
          "F2",
          "F3",
          "F4",
          "F5",
          "F6",
          "F7",
          "F8",
          "F9",
          "F10",
          "F11",
          "F12",
          "Tab",
          "CapsLock",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
        ].includes(e.key);
        const isShortcut = e.ctrlKey || e.metaKey;
        if (!isModifier && !isShortcut) {
          engine.start();
          // Now process the key as well
          if (engine.getStatus() === "active") {
            engine.processInput(e);
          }
        }
        return;
      }

      // Normal active state processing
      if (engineStatus === "active") {
        engine.processInput(e);
      }
    };

    // While an IME composition is in progress, tell the engine to ignore
    // keydown events until the composition ends — both boundaries mirror
    // the same check as the isComposing guard above, but engine-side so any
    // other caller of processInput gets the same protection.
    const handleCompositionStart = () => engineRef.current?.setComposing(true);
    const handleCompositionEnd = () => engineRef.current?.setComposing(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("compositionstart", handleCompositionStart);
    window.addEventListener("compositionend", handleCompositionEnd);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("compositionstart", handleCompositionStart);
      window.removeEventListener("compositionend", handleCompositionEnd);
    };
  }, []);

  // Actions
  const start = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.getStatus() === "ready") {
      engine.start();
    }
  }, []);

  const pause = useCallback(() => {
    engineRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    engineRef.current?.resume();
  }, []);

  const restart = useCallback((newConfig?: Partial<TypingEngineConfig>) => {
    const engine = engineRef.current;
    if (!engine) return;

    // Update config if provided (merge with current)
    const latestConfig = { ...configRef.current, ...newConfig };
    engine.updateConfig(latestConfig);

    // Re-initialize (now safe to call multiple times)
    engine.initialize();

    // Reset React state
    setWords([...engine.getWords()]);
    setCursorPosition(engine.getCursorPosition());
    setStatistics(null);
    setElapsedTime(0);
    setStatus("ready");
  }, []);

  const cancel = useCallback(() => {
    engineRef.current?.cancel();
  }, []);

  const getEngine = useCallback(() => engineRef.current, []);

  return {
    getEngine,
    status,
    statistics,
    words,
    cursorPosition,
    elapsedTime,
    start,
    pause,
    resume,
    restart,
    cancel,
    inputRef,
  };
}
