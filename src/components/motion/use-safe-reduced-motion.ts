"use client";

import { useReducedMotion } from "framer-motion";
import { useTypingPracticeStore } from "@/stores/typing-practice-store";

/**
 * Thin wrapper that returns `true` when either:
 *  1. The user toggled "Reduced Motion" in the typing-practice settings drawer, OR
 *  2. The OS reports `prefers-reduced-motion: reduce`.
 *
 * Every motion primitive in this folder calls this so the app-level toggle
 * and the OS preference are both honored consistently.
 */
export function useSafeReducedMotion(): boolean {
  const osPrefersReduced = useReducedMotion() ?? false;
  const userPrefersReduced = useTypingPracticeStore((s) => s.uiSettings.reducedMotion);
  return osPrefersReduced || userPrefersReduced;
}
