/**
 * Difficulty Badge Component
 *
 * Displays a difficulty level badge with appropriate styling.
 */

import { Badge } from "@/components/ui/badge";
import type { CodingDifficulty } from "@/lib/coding-practice/types";

interface DifficultyBadgeProps {
  difficulty: CodingDifficulty;
  size?: "sm" | "md" | "lg";
}

// Colors are darkened from the more saturated #10b981/#3b82f6/#f59e0b/#ef4444
// so the text (rendered at full color on a ~8%-tint background) clears
// WCAG AA 4.5:1 — the brighter originals landed as low as 2.15:1.
const DIFFICULTY_CONFIG: Record<
  CodingDifficulty,
  { label: string; color: string; bgColor: string }
> = {
  beginner: {
    label: "Beginner",
    color: "#0c855d",
    bgColor: "#0c855d15",
  },
  intermediate: {
    label: "Intermediate",
    color: "#1e6ff5",
    bgColor: "#1e6ff515",
  },
  advanced: {
    label: "Advanced",
    color: "#a36907",
    bgColor: "#a3690715",
  },
  expert: {
    label: "Expert",
    color: "#eb1515",
    bgColor: "#eb151515",
  },
};

export function DifficultyBadge({ difficulty, size = "md" }: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[difficulty];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <Badge
      variant="secondary"
      className={`${sizeClasses[size]} shadow-pop-sm font-bold`}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.color,
        color: config.color,
      }}
    >
      {config.label}
    </Badge>
  );
}
