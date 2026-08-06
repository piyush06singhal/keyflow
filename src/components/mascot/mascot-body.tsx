"use client";

import { motion, type Variants } from "framer-motion";

import type { MascotState } from "./types";

const bodyVariants: Variants = {
  idle: {
    y: [0, -3, 0],
    rotate: 0,
    transition: { y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } },
  },
  typing: {
    y: [0, -1.5, 0],
    rotate: 0,
    transition: { y: { duration: 0.28, repeat: Infinity, ease: "easeInOut" } },
  },
  celebrating: {
    y: [0, -14, 0],
    rotate: [0, -6, 6, 0],
    transition: { duration: 0.6, repeat: Infinity, ease: "easeOut" },
  },
  sad: {
    y: 4,
    rotate: -4,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  error: {
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

const stateColorVar: Record<MascotState, string> = {
  idle: "var(--mascot-idle, #6366f1)",
  typing: "var(--mascot-idle, #6366f1)",
  celebrating: "var(--mascot-happy, #10b981)",
  sad: "var(--mascot-sad, #f59e0b)",
  error: "var(--mascot-sad, #ef4444)",
};

export interface MascotBodyProps {
  state: MascotState;
  children?: React.ReactNode;
}

/**
 * The "keycap sprite" body — a rounded-square keycap shape with a raised
 * top face, evoking the app's keyboard theme without copying any existing
 * mascot design.
 */
export function MascotBody({ state, children }: MascotBodyProps) {
  return (
    <motion.g
      variants={bodyVariants}
      animate={state}
      style={{ transformOrigin: "50% 60%" }}
    >
      {/* Keycap well (darker base) */}
      <rect x="8" y="14" width="84" height="80" rx="20" fill="rgba(0,0,0,0.12)" />
      {/* Keycap top face */}
      <motion.rect
        x="8"
        y="8"
        width="84"
        height="80"
        rx="20"
        fill={stateColorVar[state]}
        stroke="var(--ink)"
        strokeWidth={3}
        animate={{ fill: stateColorVar[state] }}
        transition={{ duration: 0.3 }}
      />
      {/* Top highlight */}
      <rect
        x="16"
        y="14"
        width="68"
        height="24"
        rx="12"
        fill="rgba(255,255,255,0.18)"
      />
      {children}
    </motion.g>
  );
}
