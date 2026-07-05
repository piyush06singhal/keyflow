/**
 * Language Badge Component
 *
 * Displays a programming language badge with icon and color.
 */

import { Badge } from "@/components/ui/badge";
import { getLanguageConfig, getLanguageColor } from "@/lib/coding-practice/languages";
import type { ProgrammingLanguage } from "@/lib/coding-practice/types";
import {
  Code2,
  Database,
  Terminal,
  FileCode,
  FileText,
  GitBranch,
  Container,
} from "lucide-react";

const ICON_MAP: Record<string, typeof Code2> = {
  FileCode,
  Database,
  Terminal,
  FileText,
  GitBranch,
  Container,
  Code2,
};

interface LanguageBadgeProps {
  language: ProgrammingLanguage;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function LanguageBadge({
  language,
  size = "md",
  showIcon = true,
}: LanguageBadgeProps) {
  const config = getLanguageConfig(language);
  const color = getLanguageColor(language);
  const Icon = ICON_MAP[config.icon] || Code2;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <Badge
      variant="secondary"
      className={`${sizeClasses[size]} inline-flex items-center gap-1.5 font-medium`}
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}40`,
        color: color,
      }}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.displayName}</span>
    </Badge>
  );
}
