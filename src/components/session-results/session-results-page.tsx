"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Target,
  TrendingUp,
  Award,
  Clock,
  Type,
  AlertCircle,
  RotateCcw,
  Home,
  Share2,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SessionResult } from "@/lib/typing-engine";
import type { SessionCompletionResult } from "@/lib/session-lifecycle";
import { calculateLevel } from "@/lib/session-lifecycle";
import { StatisticCard } from "./statistic-card";
import { PerformanceChart } from "./performance-chart";
import {
  AchievementCelebration,
  PersonalBestCelebration,
} from "./achievement-celebration";
import { XpRewardCard } from "./xp-reward-card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface SessionResultsPageProps {
  sessionResult: SessionResult;
  completionResult: SessionCompletionResult;
  onRestart?: () => void;
  onDashboard?: () => void;
  onNewSession?: () => void;
}

export function SessionResultsPage({
  sessionResult,
  completionResult,
  onRestart,
  onDashboard,
  onNewSession,
}: SessionResultsPageProps) {
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievementsShown, setAchievementsShown] = useState(false);

  // Show achievements after a delay
  useEffect(() => {
    if (completionResult.newAchievements.length > 0 && !achievementsShown) {
      const timer = setTimeout(() => {
        setShowAchievements(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [completionResult.newAchievements, achievementsShown]);

  const handleAchievementsComplete = () => {
    setShowAchievements(false);
    setAchievementsShown(true);
  };

  // Calculate current level info
  const currentTotalXp = completionResult.xpGained; // Simplified - in real app, get from user stats
  const levelInfo = calculateLevel(currentTotalXp);

  // Format time
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
  };

  // Get performance rating
  const getPerformanceRating = (wpm: number) => {
    if (wpm >= 70)
      return { label: "Excellent", color: "text-green-500", bg: "bg-green-500/10" };
    if (wpm >= 50)
      return { label: "Great", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (wpm >= 30)
      return { label: "Good", color: "text-yellow-500", bg: "bg-yellow-500/10" };
    return {
      label: "Keep Practicing",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    };
  };

  const rating = getPerformanceRating(sessionResult.finalWpm);

  const mainStats = [
    {
      icon: Zap,
      label: "Final WPM",
      value: sessionResult.finalWpm.toFixed(0),
      subValue: `Peak: ${sessionResult.peakWpm.toFixed(0)} | Avg: ${sessionResult.averageWpm.toFixed(0)}`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Target,
      label: "Accuracy",
      value: `${sessionResult.finalAccuracy.toFixed(1)}%`,
      subValue: `${sessionResult.finalStats.correctChars} correct / ${sessionResult.finalStats.incorrectChars} errors`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: TrendingUp,
      label: "Consistency",
      value: `${sessionResult.consistency.toFixed(0)}%`,
      subValue: `${sessionResult.mistakes.length} mistakes made`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Award,
      label: "Completion",
      value: `${sessionResult.completionPercentage.toFixed(0)}%`,
      subValue: formatTime(sessionResult.duration),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const detailedStats = [
    {
      icon: Type,
      label: "Characters Per Minute",
      value: sessionResult.finalStats.cpm.toFixed(0),
      size: "sm" as const,
    },
    {
      icon: Clock,
      label: "Total Characters",
      value: sessionResult.finalStats.totalChars,
      size: "sm" as const,
    },
    {
      icon: Type,
      label: "Words Completed",
      value: sessionResult.finalStats.completedWords,
      size: "sm" as const,
    },
    {
      icon: AlertCircle,
      label: "Error Rate",
      value: `${sessionResult.finalStats.errorRate.toFixed(1)}%`,
      size: "sm" as const,
    },
  ];

  const handleShare = () => {
    toast.success("Share feature coming soon!", {
      description: "You'll be able to share your results on social media.",
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Achievement Celebration */}
      <AchievementCelebration
        achievements={completionResult.newAchievements}
        show={showAchievements}
        onComplete={handleAchievementsComplete}
      />

      {/* Personal Bests */}
      <PersonalBestCelebration
        personalBests={completionResult.newPersonalBests}
        show={completionResult.newPersonalBests.length > 0}
      />

      {/* Sync Status Warnings */}
      {completionResult.warnings.length > 0 && (
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            {completionResult.warnings.map((warning, i) => (
              <div key={i}>{warning}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Errors */}
      {completionResult.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {completionResult.errors.map((error, i) => (
              <div key={i}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className={cn(
            "from-primary/5 to-primary/10 mx-auto mb-6 rounded-2xl border bg-gradient-to-br p-8",
            rating.bg,
          )}
        >
          <Badge variant="outline" className="mb-3">
            Session Complete
          </Badge>
          <h1 className={cn("mb-2 text-4xl font-bold", rating.color)}>
            {rating.label}
          </h1>
          <p className="text-6xl font-bold">{sessionResult.finalWpm.toFixed(0)} WPM</p>
          <p className="text-muted-foreground mt-2">
            {sessionResult.mode.charAt(0).toUpperCase() + sessionResult.mode.slice(1)}{" "}
            Mode • {formatTime(sessionResult.duration)}
          </p>
        </motion.div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat, index) => (
          <StatisticCard key={stat.label} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* XP and Level */}
      <XpRewardCard
        xpGained={completionResult.xpGained}
        levelInfo={levelInfo}
        levelUp={completionResult.levelUp}
        newLevel={completionResult.newLevel}
      />

      {/* Performance Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart sessionResult={sessionResult} type="wpm" />
        <PerformanceChart sessionResult={sessionResult} type="accuracy" />
      </div>

      <PerformanceChart sessionResult={sessionResult} type="consistency" />

      {/* Detailed Stats */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Detailed Statistics</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {detailedStats.map((stat, index) => (
            <StatisticCard key={stat.label} {...stat} delay={0.5 + index * 0.05} />
          ))}
        </div>
      </Card>

      {/* Word Stats */}
      {(sessionResult.wordStats.fastestWord || sessionResult.wordStats.slowestWord) && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Word Analysis</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Average Word Time</span>
              <span className="font-mono font-medium">
                {(sessionResult.wordStats.averageWordTime / 1000).toFixed(2)}s
              </span>
            </div>
            {sessionResult.wordStats.fastestWord && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Fastest Word</span>
                <span className="font-mono font-medium">
                  "{sessionResult.wordStats.fastestWord.text}" (
                  {(sessionResult.wordStats.fastestWord.time / 1000).toFixed(2)}s)
                </span>
              </div>
            )}
            {sessionResult.wordStats.slowestWord && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Slowest Word</span>
                <span className="font-mono font-medium">
                  "{sessionResult.wordStats.slowestWord.text}" (
                  {(sessionResult.wordStats.slowestWord.time / 1000).toFixed(2)}s)
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      <Separator />

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button size="lg" onClick={onRestart}>
          <RotateCcw className="mr-2 size-4" />
          Practice Again
        </Button>
        <Button size="lg" variant="outline" onClick={onNewSession}>
          <Zap className="mr-2 size-4" />
          New Session
        </Button>
        <Button size="lg" variant="outline" onClick={onDashboard}>
          <Home className="mr-2 size-4" />
          Dashboard
        </Button>
        <Button size="lg" variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 size-4" />
          Share Results
        </Button>
        <Button size="lg" variant="outline">
          <BarChart3 className="mr-2 size-4" />
          View Analytics
        </Button>
      </div>
    </div>
  );
}
