"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { AnalyticsService } from "@/features/analytics/services/analytics.service";
import type { GoalProgressItem } from "@/features/analytics/types";

interface GoalProgressProps {
  userId: string;
}

export function GoalProgress({ userId }: GoalProgressProps) {
  const [goals, setGoals] = useState<GoalProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const userGoals = await AnalyticsService.getGoals(userId);
        setGoals(userGoals);
      } catch (e) {
        console.error("Failed to load goals:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  // Format unit depending on type
  const formatGoalValue = (value: number, type: string) => {
    switch (type) {
      case "wpm":
        return `${value} WPM`;
      case "accuracy":
        return `${value}%`;
      case "xp":
        return `${value} XP`;
      case "duration":
        return `${Math.round(value / 60)} mins`;
      default:
        return `${value} sessions`;
    }
  };

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="text-primary h-5 w-5" />
          Active Training Goals
        </CardTitle>
        <CardDescription>
          Track daily, weekly, and monthly practice milestones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal) => {
          const isCompleted =
            goal.status === "completed" || goal.progressPercent >= 100;
          return (
            <div
              key={goal.id}
              className="bg-muted/30 border-border/40 space-y-3 rounded-2xl border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-foreground text-sm leading-tight font-semibold">
                    {goal.title}
                  </h4>
                  <div className="text-muted-foreground flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                    {goal.estimatedCompletionDate && (
                      <span className="text-primary flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Est. Completion:{" "}
                        {new Date(goal.estimatedCompletionDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <Badge
                  variant={isCompleted ? "default" : "secondary"}
                  className={`rounded-lg ${
                    isCompleted
                      ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15"
                      : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/15"
                  }`}
                >
                  {isCompleted ? "Completed" : "Active"}
                </Badge>
              </div>

              {/* Progress visual metrics */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">
                    Progress: {formatGoalValue(goal.currentValue, goal.goalType)} /{" "}
                    {formatGoalValue(goal.targetValue, goal.goalType)}
                  </span>
                  <span className="text-foreground">{goal.progressPercent}%</span>
                </div>
                <Progress value={goal.progressPercent} className="h-2" />
              </div>

              {/* Help tip / remaining metric */}
              {!isCompleted && (
                <div className="text-muted-foreground bg-card/60 border-border/20 flex items-center gap-1.5 rounded-xl border p-2 text-[11px] font-semibold">
                  <AlertCircle className="text-primary h-3.5 w-3.5 shrink-0" />
                  <span>
                    You need {formatGoalValue(goal.remainingValue, goal.goalType)} more
                    to complete this goal. Keep practicing!
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
