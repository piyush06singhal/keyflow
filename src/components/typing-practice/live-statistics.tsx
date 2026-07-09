"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Timer, Zap, Target, TrendingUp, Activity } from "lucide-react";
import type { LiveStatistics as Stats } from "@/lib/typing-engine";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/**
 * Live Statistics Component
 *
 * Displays real-time typing statistics.
 * For countdown mode: shows remaining time prominently.
 * For elapsed mode: shows elapsed time.
 */

export interface LiveStatisticsProps {
  statistics: Stats | null;
  /** Milliseconds — either remaining (countdown) or elapsed (other modes) */
  elapsedTime: number;
  timerMode?: "countdown" | "elapsed" | "untimed";
  duration?: number; // seconds
  className?: string;
}

export const LiveStatistics = memo(function LiveStatistics({
  statistics,
  elapsedTime,
  timerMode = "countdown",
  duration = 60,
  className,
}: LiveStatisticsProps) {
  // elapsedTime is ms; for countdown it's remaining ms
  const totalMs = duration * 1000;
  const isCountdown = timerMode === "countdown";
  const progressPct = isCountdown
    ? Math.max(0, Math.min(100, (elapsedTime / totalMs) * 100))
    : Math.max(0, Math.min(100, (elapsedTime / totalMs) * 100));

  const displaySeconds = Math.ceil(elapsedTime / 1000);
  const displayMinutes = Math.floor(displaySeconds / 60);
  const displaySec = displaySeconds % 60;
  const timeStr =
    displayMinutes > 0
      ? `${displayMinutes}:${String(displaySec).padStart(2, "0")}`
      : `${displaySeconds}s`;

  const isLowTime = isCountdown && elapsedTime < 10_000; // under 10 sec remaining

  if (!statistics) {
    return (
      <Card className={cn("p-6", className)}>
        {/* Timer always visible even before typing starts */}
        <div className="mb-4 text-center">
          <div
            className={cn(
              "font-mono text-5xl font-black tracking-tight tabular-nums",
              isLowTime ? "text-red-500" : "text-foreground",
            )}
          >
            {isCountdown ? `${duration}s` : "0s"}
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            {isCountdown ? "time remaining" : "elapsed"}
          </p>
        </div>
        <div className="text-muted-foreground flex items-center justify-center text-sm">
          Start typing to see statistics
        </div>
      </Card>
    );
  }

  const stats = [
    {
      icon: Zap,
      label: "WPM",
      value: statistics.wpm.toFixed(0),
      subValue: `${statistics.rawWpm.toFixed(0)} raw`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Target,
      label: "Accuracy",
      value: `${statistics.accuracy.toFixed(1)}%`,
      subValue: `${statistics.correctChars}/${statistics.totalChars}`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: TrendingUp,
      label: "Consistency",
      value: `${statistics.consistency.toFixed(0)}%`,
      subValue: `${statistics.errorRate.toFixed(1)}% errors`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Activity,
      label: "CPM",
      value: statistics.cpm.toFixed(0),
      subValue: `${statistics.correctChars} correct`,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <Card className={cn("border-border/40 shadow-key-md rounded-2xl p-6", className)}>
      {/* Timer — big and prominent at the top */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Timer
              className={cn("h-4 w-4", isLowTime ? "text-red-500" : "text-primary")}
            />
            <span className="text-muted-foreground text-xs font-medium">
              {isCountdown ? "Time Remaining" : "Time Elapsed"}
            </span>
          </div>
        </div>

        {/* Timer number */}
        <motion.div
          key={displaySeconds}
          initial={{ scale: isLowTime ? 1.15 : 1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "font-mono text-5xl leading-none font-black tracking-tight tabular-nums",
            isLowTime ? "text-red-500" : "text-foreground",
          )}
        >
          {timeStr}
        </motion.div>

        {/* Progress bar */}
        {isCountdown && (
          <div className="bg-secondary/50 mt-3 h-1.5 w-full overflow-hidden rounded-full">
            <motion.div
              className={cn(
                "h-full rounded-full transition-all",
                isLowTime ? "bg-red-500" : "bg-primary",
              )}
              style={{ width: `${progressPct}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Progress */}
      <div className="mt-6 space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-medium">Progress</span>
          <span className="font-semibold tabular-nums">
            {statistics.progress.toFixed(0)}%
          </span>
        </div>
        <div className="bg-secondary/50 h-2.5 overflow-hidden rounded-full">
          <motion.div
            className="bg-primary h-full rounded-full shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${statistics.progress}%` }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
          <span>{statistics.completedWords} words</span>
          <span>{statistics.remainingWords} remaining</span>
        </div>
      </div>
    </Card>
  );
});

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subValue: string;
  color: string;
  bgColor: string;
}

const StatCard = memo(function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  color,
  bgColor,
}: StatCardProps) {
  return (
    <div className="bg-card/50 border-border/40 shadow-key-xs hover:border-border/60 hover:shadow-key-sm flex items-start gap-3 rounded-xl border p-4 backdrop-blur-sm transition-all duration-200">
      <div className={cn("shadow-key-xs rounded-xl p-2.5", bgColor)}>
        <Icon className={cn("size-5", color)} />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-muted-foreground text-xs font-medium tracking-tight">
          {label}
        </p>
        <motion.p
          key={value}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="text-2xl leading-none font-bold tracking-tight"
        >
          {value}
        </motion.p>
        <p className="text-muted-foreground text-xs">{subValue}</p>
      </div>
    </div>
  );
});
