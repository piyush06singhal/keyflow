"use client";

import { useState } from "react";
import { PageContainer } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Trophy, Clock, Zap, Star, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number; // 0-100
  currentVal: number;
  targetVal: number;
  unit: string;
  timeRemaining: string;
  joined: boolean;
  completed: boolean;
  type: "daily" | "weekly";
}

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "ch1",
    title: "Daily Sprint",
    description: "Complete 3 typing practice sessions today.",
    xpReward: 50,
    progress: 66,
    currentVal: 2,
    targetVal: 3,
    unit: "sessions",
    timeRemaining: "12 hours remaining",
    joined: true,
    completed: false,
    type: "daily",
  },
  {
    id: "ch2",
    title: "Perfect Accuracy Sprint",
    description: "Achieve over 98% accuracy in a coding snippet.",
    xpReward: 100,
    progress: 0,
    currentVal: 0,
    targetVal: 1,
    unit: "session",
    timeRemaining: "18 hours remaining",
    joined: false,
    completed: false,
    type: "daily",
  },
  {
    id: "ch3",
    title: "Weekly Marathon",
    description: "Practice for a total duration of 30 minutes.",
    xpReward: 200,
    progress: 40,
    currentVal: 12,
    targetVal: 30,
    unit: "mins",
    timeRemaining: "4 days remaining",
    joined: true,
    completed: false,
    type: "weekly",
  },
  {
    id: "ch4",
    title: "Bracket Blitz",
    description: "Type 50 bracket/scope keys accurately in coding modules.",
    xpReward: 150,
    progress: 100,
    currentVal: 50,
    targetVal: 50,
    unit: "keys",
    timeRemaining: "2 days remaining",
    joined: true,
    completed: true,
    type: "weekly",
  },
];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);

  const handleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, joined: true } : c)),
    );
  };

  return (
    <PageContainer maxWidth="full">
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Practice Challenges</h1>
            <p className="text-muted-foreground text-sm">
              Take on daily speed objectives and weekly developer modules to score
              massive XP.
            </p>
          </div>
        </div>

        {/* Challenge list */}
        <div className="grid gap-6 md:grid-cols-2">
          {challenges.map((challenge) => {
            const isCompleted = challenge.progress >= 100 || challenge.completed;

            return (
              <Card
                key={challenge.id}
                className={`surface-card flex flex-col justify-between ${
                  isCompleted ? "border-emerald-500/20 bg-emerald-500/5" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`px-2 py-0 font-mono text-[9px] uppercase ${
                            challenge.type === "daily"
                              ? "border-blue-500/20 bg-blue-500/10 text-blue-500"
                              : "border-purple-500/20 bg-purple-500/10 text-purple-500"
                          }`}
                        >
                          {challenge.type}
                        </Badge>
                        <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-semibold">
                          <Clock className="h-3 w-3" />
                          {challenge.timeRemaining}
                        </span>
                      </div>
                      <CardTitle className="pt-1.5 text-base font-bold">
                        {challenge.title}
                      </CardTitle>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-none font-mono">
                      +{challenge.xpReward} XP
                    </Badge>
                  </div>
                  <CardDescription className="pt-1.5 text-xs leading-normal">
                    {challenge.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {challenge.joined || isCompleted ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-muted-foreground">
                          Progress: {challenge.currentVal} / {challenge.targetVal}{" "}
                          {challenge.unit}
                        </span>
                        <span className="text-foreground">{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-1.5" />
                    </div>
                  ) : (
                    <div className="bg-muted/40 border-border/20 text-muted-foreground rounded-xl border p-3 text-xs font-semibold">
                      Join this challenge to track your metrics and score bonus XP
                      rewards.
                    </div>
                  )}

                  <div className="flex items-center justify-end border-t pt-2">
                    {isCompleted ? (
                      <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-500">
                        <CheckCircle2 className="h-4 w-4" />
                        Challenge Completed
                      </span>
                    ) : challenge.joined ? (
                      <Button
                        size="sm"
                        className="h-8.5 rounded-lg px-4 text-xs"
                        asChild
                      >
                        <Link href="/practice">Practice Now</Link>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8.5 rounded-lg px-4 text-xs"
                        onClick={() => handleJoin(challenge.id)}
                      >
                        <Sparkles className="text-primary mr-1 h-3.5 w-3.5" />
                        Join Challenge
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
