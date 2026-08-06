"use client";

import { AnimatePresence, motion } from "framer-motion";

import type { MascotState } from "./types";

const EYE_Y: Record<MascotState, number> = {
  idle: 48,
  typing: 47,
  celebrating: 44,
  sad: 52,
  error: 46,
};

function Eyes({ state }: { state: MascotState }) {
  if (state === "celebrating") {
    // Happy closed-arc eyes (^ ^)
    return (
      <g stroke="#1f2937" strokeWidth={3.5} strokeLinecap="round" fill="none">
        <path d="M32 46 Q38 40 44 46" />
        <path d="M56 46 Q62 40 68 46" />
      </g>
    );
  }

  if (state === "sad") {
    return (
      <g fill="#1f2937">
        <ellipse cx="38" cy={EYE_Y[state]} rx="5" ry="6" />
        <ellipse cx="62" cy={EYE_Y[state]} rx="5" ry="6" />
      </g>
    );
  }

  if (state === "error") {
    return (
      <g fill="#1f2937">
        <circle cx="38" cy={EYE_Y[state]} r="6.5" />
        <circle cx="62" cy={EYE_Y[state]} r="6.5" />
      </g>
    );
  }

  // idle / typing — simple round eyes with a blink loop
  return (
    <motion.g
      fill="#1f2937"
      animate={{ scaleY: [1, 1, 0.1, 1] }}
      transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.92, 0.96, 1] }}
      style={{ transformOrigin: "50px 47px" }}
    >
      <circle cx="38" cy={EYE_Y[state]} r="5.5" />
      <circle cx="62" cy={EYE_Y[state]} r="5.5" />
    </motion.g>
  );
}

function Mouth({ state }: { state: MascotState }) {
  switch (state) {
    case "celebrating":
      return (
        <path
          d="M34 62 Q50 78 66 62"
          stroke="#1f2937"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      );
    case "typing":
      return <ellipse cx="50" cy="66" rx="6" ry="4" fill="#1f2937" />;
    case "sad":
      return (
        <path
          d="M36 70 Q50 58 64 70"
          stroke="#1f2937"
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
        />
      );
    case "error":
      return (
        <path
          d="M38 64 L44 70 L50 64 L56 70 L62 64"
          stroke="#1f2937"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    default:
      return (
        <path
          d="M38 64 Q50 70 62 64"
          stroke="#1f2937"
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
        />
      );
  }
}

export interface MascotFaceProps {
  state: MascotState;
}

export function MascotFace({ state }: MascotFaceProps) {
  return (
    <g>
      <AnimatePresence mode="wait">
        <motion.g
          key={`eyes-${state}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
        >
          <Eyes state={state} />
        </motion.g>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.g
          key={`mouth-${state}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Mouth state={state} />
        </motion.g>
      </AnimatePresence>
    </g>
  );
}
