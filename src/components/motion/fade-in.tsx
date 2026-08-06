"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { useSafeReducedMotion } from "./use-safe-reduced-motion";

export interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
  /** Pixels the element rises from on enter. */
  distance?: number;
  children?: React.ReactNode;
}

/**
 * Standard fade + rise entrance, used in place of hand-rolled
 * `initial/animate` blocks scattered across the app.
 */
export function FadeIn({
  delay = 0,
  duration = 0.4,
  distance = 12,
  children,
  ...props
}: FadeInProps) {
  const reducedMotion = useSafeReducedMotion();

  if (reducedMotion) {
    return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: distance }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
