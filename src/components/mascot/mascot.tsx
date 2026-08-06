"use client";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useSafeReducedMotion } from "@/components/motion";
import { MascotBody } from "./mascot-body";
import { MascotFace } from "./mascot-face";
import type { MascotState } from "./types";

export interface MascotProps {
  state: MascotState;
  size?: number;
  className?: string;
}

const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function CelebrationParticles() {
  return (
    <g>
      {PARTICLE_ANGLES.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const dx = Math.cos(rad) * 46;
        const dy = Math.sin(rad) * 46;
        return (
          <motion.circle
            key={angle}
            cx="50"
            cy="52"
            r="3"
            fill="var(--mascot-happy, #10b981)"
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0], x: dx, y: dy, scale: [0.4, 1, 0.6] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: (angle / 360) * 0.3 }}
          />
        );
      })}
    </g>
  );
}

/**
 * KeyFlow's original mascot: an animated "keycap sprite" that reacts to
 * live typing performance. Purely presentational — pass a `MascotState`
 * (see `useMascotState` for deriving one from the typing engine).
 */
export function Mascot({ state, size = 96, className }: MascotProps) {
  const reducedMotion = useSafeReducedMotion();
  const effectiveState = reducedMotion && state === "celebrating" ? "idle" : state;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("overflow-visible", className)}
      role="img"
      aria-label={`Mascot: ${state}`}
    >
      <MascotBody state={reducedMotion ? "idle" : effectiveState}>
        <MascotFace state={effectiveState} />
      </MascotBody>
      <AnimatePresence>
        {!reducedMotion && effectiveState === "celebrating" && <CelebrationParticles />}
      </AnimatePresence>
    </svg>
  );
}
