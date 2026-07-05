"use client";

/**
 * Coding Statistics Panel
 *
 * Real-time statistics display for coding practice sessions.
 * Shows WPM, accuracy, and coding-specific metrics.
 */

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Target, Zap, TrendingUp, Clock, Code2 } from "lucide-react";
import { motion } from "framer-motion";

interface CodingStatisticsPanelProps {
  statistics?: {
    wpm: number;
    accuracy: number;
    progress: number;
    elapsedTime: number;
    correctChars: number;
    totalChars: number;
  } | null;
}

export function CodingStatisticsPanel({ statistics }: CodingStatisticsPanelProps) {
  const stats = statistics || {
    wpm: 0,
    accuracy: 100,
    progress: 0,
    elapsedTime: 0,
    correctChars: 0,
    totalChars: 0,
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const statCards = [
    {
      icon: Zap,
      label: "WPM",
      value: stats.wpm.toFixed(0),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Target,
      label: "Accuracy",
      value: `${stats.accuracy.toFixed(1)}%`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Clock,
      label: "Time",
      value: formatTime(stats.elapsedTime),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Activity,
      label: "Progress",
      value: `${stats.progress.toFixed(0)}%`,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="sticky top-24 space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-muted-foreground text-xs">{stat.label}</div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{stats.progress.toFixed(0)}%</span>
          </div>
          <Progress value={stats.progress} className="h-2" />
        </div>
      </Card>

      {/* Character Stats */}
      <Card className="p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <Code2 className="h-4 w-4" />
          Character Stats
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Correct</span>
            <span className="font-medium text-green-500">{stats.correctChars}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Typed</span>
            <span className="font-medium">{stats.totalChars}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Errors</span>
            <span className="font-medium text-red-500">
              {stats.totalChars - stats.correctChars}
            </span>
          </div>
        </div>
      </Card>

      {/* Tips Card */}
      <Card className="bg-primary/5 border-primary/20 p-4">
        <h3 className="mb-2 flex items-center gap-2 font-semibold">
          <TrendingUp className="text-primary h-4 w-4" />
          Quick Tip
        </h3>
        <p className="text-muted-foreground text-sm">
          Focus on accuracy first. Speed will come naturally with practice.
        </p>
      </Card>
    </div>
  );
}
