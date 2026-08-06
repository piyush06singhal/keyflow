"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { useSafeReducedMotion } from "./use-safe-reduced-motion";

export interface SpringPopProps extends HTMLMotionProps<"div"> {
  delay?: number;
  /** Starting scale before the spring settles at 1. */
  fromScale?: number;
  children?: React.ReactNode;
}

/**
 * Spring-driven scale-in, for numbers/badges that should feel "popped in"
 * (WPM counters, personal-best toasts, stat tiles).
 */
export function SpringPop({
  delay = 0,
  fromScale = 0.85,
  children,
  ...props
}: SpringPopProps) {
  const reducedMotion = useSafeReducedMotion();

  if (reducedMotion) {
    return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: fromScale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
