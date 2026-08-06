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
    // Official per-language brand colors (JS yellow, Python blue, etc.) stay
    // on the border/icon as an identity accent — real dev-facing brand
    // colors we don't want to repaint — but the readable label uses the
    // theme's normal text color instead of the raw brand hex, since several
    // of these brand colors (JS yellow especially) fail WCAG contrast as
    // text on a light tint background.
    <Badge
      variant="secondary"
      className={`${sizeClasses[size]} shadow-pop-sm inline-flex items-center gap-1.5 font-bold`}
      style={{
        backgroundColor: `${color}20`,
        borderColor: color,
      }}
    >
      {showIcon && <Icon className={iconSizes[size]} style={{ color }} />}
      <span>{config.displayName}</span>
    </Badge>
  );
}
