"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";
import { useSafeReducedMotion } from "./use-safe-reduced-motion";

type DivPropsSansMotionConflicts = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>;

export interface TiltCardProps extends DivPropsSansMotionConflicts {
  /** Maximum tilt rotation in degrees. */
  maxTilt?: number;
  /** Whether the card scales up slightly while hovered. */
  scaleOnHover?: boolean;
}

/**
 * CSS 3D tilt card: rotates on X/Y based on pointer position within the
 * element, using CSS `perspective`/`transform` driven by Framer Motion
 * springs (no WebGL/3D library required).
 */
export function TiltCard({
  maxTilt = 10,
  scaleOnHover = true,
  className,
  style,
  children,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useSafeReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 18 };
  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]),
    springConfig,
  );
  const scale = useSpring(1, springConfig);

  if (reducedMotion) {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    x.set((event.clientX - bounds.left) / bounds.width - 0.5);
    y.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const handlePointerEnter = () => {
    if (scaleOnHover) scale.set(1.02);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{ ...style, perspective: 800 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={handlePointerEnter}
      {...props}
    >
      <motion.div style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
