"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Clock,
  Type,
  Code2,
  Trophy,
  Flame,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ElementType;
  index: number;
}

function StatCard({ title, value, change, trend, icon: Icon, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className="group border-border/40 bg-card/80 hover:border-primary/30 hover:shadow-key-lg relative overflow-hidden backdrop-blur-sm transition-all duration-300">
        {/* Gradient Background on Hover */}
        <div className="from-primary/8 via-primary/4 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium tracking-tight">{title}</CardTitle>
          <div className="bg-primary/10 text-primary group-hover:bg-primary/15 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105">
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold tracking-tight tabular-nums">{value}</div>
          {change && (
            <p
              className={cn(
                "mt-1.5 flex items-center gap-1 text-xs font-medium",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "neutral" && "text-muted-foreground",
              )}
            >
              {trend === "up" && <TrendingUp className="h-3 w-3" />}
              {trend === "down" && <TrendingDown className="h-3 w-3" />}
              {change}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatsGridProps {
  stats: {
    avgWpm: number;
    bestWpm: number;
    avgAccuracy: number;
    typingTime: number;
    totalWords: number;
    totalCharacters: number;
    codingSessions: number;
    currentLevel: number;
    currentXp: number;
    currentRank: number;
    currentStreak: number;
    longestStreak: number;
    dailyGoalCompletion: number;
    weeklyImprovement: number;
    monthlyImprovement: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statCards = [
    {
      title: "Average WPM",
      value: stats.avgWpm || "—",
      change:
        stats.weeklyImprovement > 0
          ? `+${stats.weeklyImprovement.toFixed(1)}% this week`
          : "Start practicing",
      trend: stats.weeklyImprovement > 0 ? ("up" as const) : ("neutral" as const),
      icon: Zap,
    },
    {
      title: "Best WPM",
      value: stats.bestWpm || "—",
      change: stats.bestWpm > 0 ? "Personal record" : "No sessions yet",
      trend: "neutral" as const,
      icon: Trophy,
    },
    {
      title: "Accuracy",
      value: stats.avgAccuracy ? `${stats.avgAccuracy.toFixed(1)}%` : "—",
      change: stats.avgAccuracy > 0 ? "Average" : "No sessions yet",
      trend:
        stats.avgAccuracy >= 95
          ? ("up" as const)
          : stats.avgAccuracy >= 85
            ? ("neutral" as const)
            : ("down" as const),
      icon: Target,
    },
    {
      title: "Practice Time",
      value: stats.typingTime > 0 ? formatTime(stats.typingTime) : "—",
      change: "Total time",
      trend: "neutral" as const,
      icon: Clock,
    },
    {
      title: "Words Typed",
      value: stats.totalWords > 0 ? formatNumber(stats.totalWords) : "—",
      change: "All time",
      trend: "neutral" as const,
      icon: Type,
    },
    {
      title: "Coding Sessions",
      value: stats.codingSessions || "—",
      change: stats.codingSessions > 0 ? "Completed" : "Start coding",
      trend: "neutral" as const,
      icon: Code2,
    },
    {
      title: "Current Level",
      value: stats.currentLevel,
      change: `${stats.currentXp} XP`,
      trend: "neutral" as const,
      icon: Award,
    },
    {
      title: "Current Streak",
      value: stats.currentStreak > 0 ? `${stats.currentStreak} days` : "—",
      change:
        stats.longestStreak > 0
          ? `Best: ${stats.longestStreak} days`
          : "Start your streak",
      trend: stats.currentStreak > 0 ? ("up" as const) : ("neutral" as const),
      icon: Flame,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <StatCard key={stat.title} {...stat} index={index} />
      ))}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function formatTime(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  return `${seconds}s`;
}
