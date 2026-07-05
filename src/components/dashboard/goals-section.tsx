"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Target, Trophy, Flame, Zap } from "lucide-react";

interface Goal {
  title: string;
  current: number;
  target: number;
  icon: React.ElementType;
  unit: string;
}

interface GoalsSectionProps {
  dailyGoal: { current: number; target: number };
  weeklyGoal: { current: number; target: number };
  monthlyGoal: { current: number; target: number };
  xpProgress: { current: number; target: number };
}

export function GoalsSection({
  dailyGoal,
  weeklyGoal,
  monthlyGoal,
  xpProgress,
}: GoalsSectionProps) {
  const goals: Goal[] = [
    {
      title: "Daily Goal",
      current: dailyGoal.current,
      target: dailyGoal.target,
      icon: Target,
      unit: "min",
    },
    {
      title: "Weekly Goal",
      current: weeklyGoal.current,
      target: weeklyGoal.target,
      icon: Flame,
      unit: "min",
    },
    {
      title: "Monthly Goal",
      current: monthlyGoal.current,
      target: monthlyGoal.target,
      icon: Trophy,
      unit: "min",
    },
    {
      title: "Level Progress",
      current: xpProgress.current,
      target: xpProgress.target,
      icon: Zap,
      unit: "XP",
    },
  ];

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Goals & Progress</CardTitle>
        <CardDescription>
          Track your daily, weekly, and monthly objectives
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal, index) => (
          <GoalProgress key={goal.title} goal={goal} index={index} />
        ))}
      </CardContent>
    </Card>
  );
}

function GoalProgress({ goal, index }: { goal: Goal; index: number }) {
  const Icon = goal.icon;
  const percentage = Math.min((goal.current / goal.target) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="text-primary h-4 w-4" />
          <span className="font-medium">{goal.title}</span>
        </div>
        <span className="text-muted-foreground text-sm">
          {goal.current} / {goal.target} {goal.unit}
        </span>
      </div>
      <div className="relative">
        <Progress value={percentage} className="h-2" />
        {percentage >= 100 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-success absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white"
          >
            ✓
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
