"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Flame, Target, Trophy, Sparkles, TrendingUp } from "lucide-react";
import { calculateLevel } from "@/lib/session-lifecycle/achievement-detector";

interface XPProgressBarProps {
  currentXp: number;
  level: number;
}

export function XPProgressBar({ currentXp, level }: XPProgressBarProps) {
  const levelInfo = calculateLevel(currentXp);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-muted-foreground flex items-center gap-1">
          <Sparkles className="text-primary h-3.5 w-3.5" />
          Level {levelInfo.currentLevel}
        </span>
        <span className="text-foreground">
          {levelInfo.currentXp.toLocaleString()} /{" "}
          {levelInfo.xpForNextLevel.toLocaleString()} XP
        </span>
      </div>
      <Progress value={levelInfo.xpProgressPercentage} className="h-2 rounded-full" />
      <p className="text-muted-foreground text-right text-[10px] font-medium">
        {Math.round(levelInfo.xpProgressPercentage)}% to Level{" "}
        {levelInfo.currentLevel + 1}
      </p>
    </div>
  );
}

interface XPCardProps {
  xp: number;
  level: number;
  streak: number;
  className?: string;
}

export function XPCard({ xp, level, streak, className }: XPCardProps) {
  return (
    <Card className={`surface-card ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-bold">
            <Star className="h-4.5 w-4.5 fill-yellow-500 text-yellow-500" />
            Progression Passport
          </CardTitle>
          <Badge className="rounded-lg border-yellow-500/20 bg-yellow-500/10 text-[10px] font-bold text-yellow-600">
            +{xp} Total XP
          </Badge>
        </div>
        <CardDescription>Practice statistics and leveling achievements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 border-border/40 flex items-center gap-3 rounded-xl border p-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <TrendingUp className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Level
              </p>
              <p className="text-foreground text-lg font-bold">{level}</p>
            </div>
          </div>

          <div className="bg-muted/30 border-border/40 flex items-center gap-3 rounded-xl border p-3">
            <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-lg bg-orange-500/10">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Streak
              </p>
              <p className="text-foreground text-lg font-bold">{streak} Days</p>
            </div>
          </div>
        </div>

        <XPProgressBar currentXp={xp} level={level} />
      </CardContent>
    </Card>
  );
}

interface MissionCardProps {
  title: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
}

export function MissionCard({
  title,
  target,
  current,
  xpReward,
  completed,
}: MissionCardProps) {
  const percentage = Math.min(100, (current / target) * 100);

  return (
    <div
      className={`flex gap-3 rounded-2xl border p-4 transition-all duration-300 ${
        completed
          ? "border-emerald-500/20 bg-emerald-500/[0.02]"
          : "bg-card border-border/40 hover:border-primary/20"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
          completed
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
            : "bg-primary/10 border-primary/20 text-primary"
        }`}
      >
        <Target className="h-4.5 w-4.5" />
      </div>

      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <h5 className="text-foreground text-xs font-bold">{title}</h5>
          <Badge
            className={`${
              completed
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                : "border-yellow-500/20 bg-yellow-500/10 text-yellow-600"
            } rounded-md py-0 text-[9px] font-bold`}
          >
            {completed ? "Completed" : `+${xpReward} XP`}
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="text-muted-foreground flex items-center justify-between text-[10px] font-semibold">
            <span>Progress</span>
            <span>
              {current} / {target}
            </span>
          </div>
          <Progress
            value={percentage}
            className={`h-1.5 ${completed ? "bg-emerald-100 dark:bg-emerald-950/40" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}

export function DailyMissionsWidget() {
  // Grab from localstorage fallback
  let missions = [
    {
      id: "1",
      title: "Daily Sprint (3 runs)",
      target: 3,
      current: 1,
      xpReward: 100,
      completed: false,
    },
    {
      id: "2",
      title: "Vocabulary Target (300 words)",
      target: 300,
      current: 120,
      xpReward: 100,
      completed: false,
    },
  ];

  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("keyflow-daily-missions");
    if (cached) {
      try {
        missions = JSON.parse(cached);
      } catch (err) {}
    }
  }

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm font-bold">
          <Target className="text-primary h-4.5 w-4.5" />
          Daily Objectives
        </CardTitle>
        <CardDescription>
          Resets every 24 hours. Earn progression multipliers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            title={mission.title}
            target={mission.target}
            current={mission.current}
            xpReward={mission.xpReward}
            completed={mission.completed}
          />
        ))}
      </CardContent>
    </Card>
  );
}
