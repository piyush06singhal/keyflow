"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Thin wrapper around Framer Motion's `useReducedMotion` so every motion
 * primitive in this folder honors `prefers-reduced-motion` consistently.
 */
export function useSafeReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}
