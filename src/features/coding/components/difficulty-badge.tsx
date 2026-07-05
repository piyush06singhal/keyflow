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

const DIFFICULTY_CONFIG: Record<
  CodingDifficulty,
  { label: string; color: string; bgColor: string }
> = {
  beginner: {
    label: "Beginner",
    color: "#10b981",
    bgColor: "#10b98115",
  },
  intermediate: {
    label: "Intermediate",
    color: "#3b82f6",
    bgColor: "#3b82f615",
  },
  advanced: {
    label: "Advanced",
    color: "#f59e0b",
    bgColor: "#f59e0b15",
  },
  expert: {
    label: "Expert",
    color: "#ef4444",
    bgColor: "#ef444415",
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
      className={`${sizeClasses[size]} font-medium`}
      style={{
        backgroundColor: config.bgColor,
        borderColor: `${config.color}40`,
        color: config.color,
      }}
    >
      {config.label}
    </Badge>
  );
}
