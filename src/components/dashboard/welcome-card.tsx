"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Zap, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface WelcomeCardProps {
  displayName: string;
  email?: string;
  level: number;
  streak: number;
  todayGoal: { current: number; target: number };
  xp: number;
  rank: number;
}

export function WelcomeCard({
  displayName,
  level,
  streak,
  todayGoal,
  rank,
}: WelcomeCardProps) {
  const greeting = getGreeting();
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const goalPercentage = Math.min((todayGoal.current / todayGoal.target) * 100, 100);

  return (
    <Card className="border-border/40 from-card via-card/95 to-primary/8 shadow-key-md overflow-hidden bg-gradient-to-br">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: User Info */}
          <div className="flex items-center gap-4">
            <Avatar className="border-primary/30 shadow-key-sm h-16 w-16 border-2">
              <AvatarFallback className="from-primary to-primary/90 bg-gradient-to-br text-lg font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="text-2xl font-bold tracking-tight"
              >
                {greeting}, {displayName}!
              </motion.h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                {getMotivationalMessage()}
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <Trophy className="text-primary h-3.5 w-3.5" />
                  Level {level}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  {streak} day streak
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <Target className="text-success h-3.5 w-3.5" />
                  Rank #{rank}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex flex-col gap-2.5">
            <Button asChild size="lg" className="group shadow-key-sm rounded-xl">
              <Link href="/practice/typing">
                <Zap className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                Start Typing
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1 rounded-xl">
                <Link href="/practice/coding">Coding</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1 rounded-xl">
                <Link href="/challenges">Challenge</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Today&apos;s Goal Progress */}
        <div className="mt-6">
          <div className="mb-2.5 flex items-center justify-between text-sm">
            <span className="font-medium tracking-tight">Today&apos;s Goal</span>
            <span className="text-muted-foreground tabular-nums">
              {todayGoal.current} / {todayGoal.target} minutes
            </span>
          </div>
          <div className="bg-secondary/50 h-2.5 overflow-hidden rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goalPercentage}%` }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="from-primary to-primary/90 h-full rounded-full bg-gradient-to-r shadow-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getMotivationalMessage(): string {
  const messages = [
    "Ready to crush your goals today?",
    "Let's make today count!",
    "Time to level up your skills!",
    "Every keystroke brings you closer to mastery",
    "Consistency is the key to success",
  ];

  return messages[Math.floor(Math.random() * messages.length)] ?? "Let's get started!";
}
