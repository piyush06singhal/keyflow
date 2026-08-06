"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { useSafeReducedMotion } from "./use-safe-reduced-motion";

export interface StaggerListProps extends HTMLMotionProps<"div"> {
  /** Delay between each child's entrance animation, in seconds. */
  staggerDelay?: number;
  children?: React.ReactNode;
}

const containerVariants = (staggerDelay: number) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerDelay },
  },
});

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

/**
 * Wraps a list/grid of children, staggering each direct child's entrance.
 * Children should use `staggerItemVariants` (or their own `variants` prop)
 * to participate in the stagger; plain elements simply won't animate.
 */
export function StaggerList({
  staggerDelay = 0.06,
  children,
  ...props
}: StaggerListProps) {
  const reducedMotion = useSafeReducedMotion();

  if (reducedMotion) {
    return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants(staggerDelay)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
