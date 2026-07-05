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
 * Displays real-time typing statistics in a premium card layout.
 * Updates smoothly as the user types.
 */

export interface LiveStatisticsProps {
  statistics: Stats | null;
  elapsedTime: number;
  className?: string;
}

export const LiveStatistics = memo(function LiveStatistics({
  statistics,
  elapsedTime,
  className,
}: LiveStatisticsProps) {
  if (!statistics) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-muted-foreground flex items-center justify-center text-sm">
          Start typing to see statistics
        </div>
      </Card>
    );
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

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
      subValue: `${statistics.correctChars} chars`,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <Card className={cn("border-border/40 shadow-key-md rounded-2xl p-6", className)}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-tight">
          Live Statistics
        </h3>
        <div className="bg-primary/10 flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm">
          <Timer className="text-primary size-4" />
          <span className="text-primary font-mono font-semibold tabular-nums">
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Progress Bar */}
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
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-2xl leading-none font-bold tracking-tight"
        >
          {value}
        </motion.p>
        <p className="text-muted-foreground text-xs">{subValue}</p>
      </div>
    </div>
  );
});
