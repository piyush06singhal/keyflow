"use client";

import { useEffect, useRef, useState } from "react";

import type { SessionStatus } from "@/lib/typing-engine";
import type { MascotState } from "./types";

export interface UseMascotStateOptions {
  engineStatus: SessionStatus;
  wpm: number;
  accuracy: number;
  /** WPM a completed session needs to trigger the celebrating state. */
  celebrateWpmThreshold?: number;
  /** Accuracy below which the mascot droops instead of celebrating/typing. */
  sadAccuracyThreshold?: number;
  /**
   * Bump this to any changing value (e.g. `Date.now()`) whenever a
   * mistyped keystroke happens, to briefly show the error/shake state.
   */
  errorPulse?: number;
  errorPulseDurationMs?: number;
}

/**
 * Derives the mascot's visual state directly from `useTypingEngine`'s
 * existing status/statistics — no extra data plumbing required beyond
 * passing those values through.
 */
export function useMascotState({
  engineStatus,
  wpm,
  accuracy,
  celebrateWpmThreshold = 40,
  sadAccuracyThreshold = 85,
  errorPulse,
  errorPulseDurationMs = 450,
}: UseMascotStateOptions): MascotState {
  const [isErrorPulsing, setIsErrorPulsing] = useState(false);
  const previousPulse = useRef(errorPulse);

  useEffect(() => {
    if (errorPulse === undefined || errorPulse === previousPulse.current) return;

    previousPulse.current = errorPulse;
    setIsErrorPulsing(true);
    const timeout = setTimeout(() => setIsErrorPulsing(false), errorPulseDurationMs);
    return () => clearTimeout(timeout);
  }, [errorPulse, errorPulseDurationMs]);

  if (isErrorPulsing) return "error";

  if (engineStatus === "active") {
    return accuracy < sadAccuracyThreshold ? "sad" : "typing";
  }

  if (engineStatus === "completed") {
    if (accuracy < sadAccuracyThreshold) return "sad";
    if (wpm >= celebrateWpmThreshold) return "celebrating";
    return "idle";
  }

  return "idle";
}
