import { useEffect, useRef, useState, useCallback } from "react";
import { TypingEngine } from "@/lib/typing-engine";
import type {
  TypingEngineConfig,
  LiveStatistics,
  SessionStatus,
  Word,
  CursorPosition,
  SessionResult,
  EngineEvent,
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
  // Engine reference
  engine: TypingEngine | null;
  
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
  restart: () => void;
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
  
  // Local state
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [statistics, setStatistics] = useState<LiveStatistics | null>(null);
  const [words, setWords] = useState<ReadonlyArray<Readonly<Word>>>([]);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Initialize engine
  useEffect(() => {
    const engine = new TypingEngine(config);
    engine.initialize();
    engineRef.current = engine;
    
    // Update initial state
    setWords(engine.getWords());
    setCursorPosition(engine.getCursorPosition());
    
    // Auto-start if requested
    if (autoStart) {
      engine.start();
    }
    
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []); // Only initialize once
  
  // Event subscriptions
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    
    const unsubscribers = [
      // Session events
      engine.on("session:started", () => {
        setStatus("active");
      }),
      
      engine.on("session:paused", () => {
        setStatus("paused");
      }),
      
      engine.on("session:resumed", () => {
        setStatus("active");
      }),
      
      engine.on("session:completed", (event) => {
        setStatus("completed");
        const result = event.data as SessionResult;
        onComplete?.(result);
      }),
      
      engine.on("session:cancelled", () => {
        setStatus("cancelled");
      }),
      
      // Statistics updates
      engine.on("statistics:updated", (event) => {
        const stats = event.data as LiveStatistics;
        setStatistics(stats);
        onStatisticsUpdate?.(stats);
      }),
      
      // Cursor updates
      engine.on("cursor:moved", (event) => {
        const position = event.data as CursorPosition;
        setCursorPosition(position);
      }),
      
      // Timer updates
      engine.on("timer:tick", (event) => {
        const elapsed = event.data as number;
        setElapsedTime(elapsed);
      }),
      
      // Character/word events trigger word state updates
      engine.on("character:typed", () => {
        setWords([...engine.getWords()]);
      }),
      
      engine.on("character:deleted", () => {
        setWords([...engine.getWords()]);
      }),
    ];
    
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [onComplete, onStatisticsUpdate]);
  
  // Keyboard event handler
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if engine is active
      if (engine.getStatus() === "active") {
        engine.processInput(e);
      }
    };
    
    // Attach to window for global keyboard handling
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  // Actions
  const start = useCallback(() => {
    engineRef.current?.start();
  }, []);
  
  const pause = useCallback(() => {
    engineRef.current?.pause();
  }, []);
  
  const resume = useCallback(() => {
    engineRef.current?.resume();
  }, []);
  
  const restart = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    
    // Cancel current session
    if (engine.getStatus() !== "idle") {
      engine.cancel();
    }
    
    // Reinitialize
    engine.initialize();
    setWords(engine.getWords());
    setCursorPosition(engine.getCursorPosition());
    setStatistics(null);
    setElapsedTime(0);
    
    // Auto-start
    engine.start();
  }, []);
  
  const cancel = useCallback(() => {
    engineRef.current?.cancel();
  }, []);
  
  return {
    engine: engineRef.current,
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
