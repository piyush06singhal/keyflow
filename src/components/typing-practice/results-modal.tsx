"use client";

import { motion } from "framer-motion";
import { Award, TrendingUp, Target, Zap, RotateCcw, Share2 } from "lucide-react";
import type { SessionResult } from "@/lib/typing-engine";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Results Modal Component
 *
 * Displays detailed session results after completing a typing practice.
 * Shows final statistics, achievements, and charts.
 */

export interface ResultsModalProps {
  result: SessionResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestart?: () => void;
}

export function ResultsModal({
  result,
  open,
  onOpenChange,
  onRestart,
}: ResultsModalProps) {
  if (!result) return null;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getPerformanceRating = (wpm: number) => {
    if (wpm >= 70) return { label: "Excellent", color: "text-green-500" };
    if (wpm >= 50) return { label: "Great", color: "text-blue-500" };
    if (wpm >= 30) return { label: "Good", color: "text-yellow-500" };
    return { label: "Keep Practicing", color: "text-orange-500" };
  };

  const rating = getPerformanceRating(result.finalWpm);

  const stats = [
    {
      icon: Zap,
      label: "Final WPM",
      value: result.finalWpm.toFixed(0),
      subValue: `Peak: ${result.peakWpm.toFixed(0)}`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Target,
      label: "Accuracy",
      value: `${result.finalAccuracy.toFixed(1)}%`,
      subValue: `Avg: ${result.averageAccuracy.toFixed(1)}%`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: TrendingUp,
      label: "Consistency",
      value: `${result.consistency.toFixed(0)}%`,
      subValue: `${result.mistakes.length} mistakes`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Award,
      label: "Completion",
      value: `${result.completionPercentage.toFixed(0)}%`,
      subValue: formatTime(result.duration),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Award className="text-primary size-6" />
            Practice Complete!
          </DialogTitle>
          <DialogDescription>Here&apos;s how you performed</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Performance Rating */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-6 text-center"
          >
            <p className="text-muted-foreground text-sm">Your Performance</p>
            <p className={cn("mt-2 text-3xl font-bold", rating.color)}>
              {rating.label}
            </p>
            <p className="mt-1 text-5xl font-bold">{result.finalWpm.toFixed(0)} WPM</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("rounded-lg p-2", stat.bgColor)}>
                      <stat.icon className={cn("size-5", stat.color)} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-muted-foreground text-xs">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-muted-foreground text-xs">{stat.subValue}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Character Stats */}
          {result.characterStats.size > 0 && (
            <Card className="p-4">
              <h3 className="mb-3 text-sm font-semibold">Character Accuracy</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Correct Characters</span>
                  <span className="font-medium">{result.finalStats.correctChars}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Incorrect Characters</span>
                  <span className="text-destructive font-medium">
                    {result.finalStats.incorrectChars}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Extra Characters</span>
                  <span className="font-medium">{result.finalStats.extraChars}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Word Stats */}
          <Card className="p-4">
            <h3 className="mb-3 text-sm font-semibold">Word Analysis</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average Word Time</span>
                <span className="font-medium">
                  {(result.wordStats.averageWordTime / 1000).toFixed(2)}s
                </span>
              </div>
              {result.wordStats.fastestWord && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fastest Word</span>
                  <span className="font-medium">
                    &quot;{result.wordStats.fastestWord.text}&quot; (
                    {(result.wordStats.fastestWord.time / 1000).toFixed(2)}s)
                  </span>
                </div>
              )}
              {result.wordStats.slowestWord && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Slowest Word</span>
                  <span className="font-medium">
                    &quot;{result.wordStats.slowestWord.text}&quot; (
                    {(result.wordStats.slowestWord.time / 1000).toFixed(2)}s)
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="default"
              className="flex-1"
              onClick={() => {
                onRestart?.();
                onOpenChange(false);
              }}
            >
              <RotateCcw className="mr-2 size-4" />
              Practice Again
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 size-4" />
              Share Results
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
