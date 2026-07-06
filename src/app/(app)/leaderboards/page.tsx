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
import { Badge } from "@/components/ui/badge";
import { Flame, Globe } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  wpm: number;
  accuracy: number;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

const WEEKLY_USERS: LeaderboardUser[] = [
  { rank: 1, name: "Alex Mercer", wpm: 96, accuracy: 98.4, xp: 1240, streak: 12 },
  { rank: 2, name: "Sofia Chen", wpm: 89, accuracy: 97.8, xp: 950, streak: 8 },
  { rank: 3, name: "Marcus Brody", wpm: 84, accuracy: 96.5, xp: 870, streak: 5 },
  {
    rank: 4,
    name: "Piyush Singhal",
    wpm: 82,
    accuracy: 97.2,
    xp: 810,
    streak: 3,
    isCurrentUser: true,
  },
  { rank: 5, name: "Elena Rostova", wpm: 78, accuracy: 95.9, xp: 620, streak: 6 },
  { rank: 6, name: "Hiroshi Tanaka", wpm: 76, accuracy: 96.1, xp: 580, streak: 4 },
  { rank: 7, name: "David Kim", wpm: 71, accuracy: 94.8, xp: 490, streak: 0 },
];

const ALLTIME_USERS: LeaderboardUser[] = [
  { rank: 1, name: "Alex Mercer", wpm: 104, accuracy: 99.1, xp: 14800, streak: 45 },
  { rank: 2, name: "Sofia Chen", wpm: 97, accuracy: 98.6, xp: 11200, streak: 22 },
  { rank: 3, name: "David Kim", wpm: 92, accuracy: 97.5, xp: 9800, streak: 15 },
  { rank: 4, name: "Marcus Brody", wpm: 90, accuracy: 96.8, xp: 8900, streak: 10 },
  {
    rank: 5,
    name: "Piyush Singhal",
    wpm: 85,
    accuracy: 97.5,
    xp: 7500,
    streak: 8,
    isCurrentUser: true,
  },
  { rank: 6, name: "Elena Rostova", wpm: 82, accuracy: 96.4, xp: 6500, streak: 14 },
];

export default function LeaderboardsPage() {
  const [timeframe, setTimeframe] = useState<"weekly" | "alltime">("weekly");
  const users = timeframe === "weekly" ? WEEKLY_USERS : ALLTIME_USERS;

  const podiumUsers = users
    .filter((u) => u.rank <= 3)
    .sort((a, b) => {
      // Order visually: #2, #1, #3
      if (a.rank === 1) return 0;
      if (b.rank === 1) return 1;
      if (a.rank === 2) return -1;
      return 1;
    });

  const listUsers = users.filter((u) => u.rank > 3);

  return (
    <PageContainer maxWidth="full">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Global Leaderboards</h1>
            <p className="text-muted-foreground text-sm">
              See how your typing and coding performance stacks up against the
              community.
            </p>
          </div>

          <div className="bg-muted flex w-fit items-center gap-2 rounded-xl p-1">
            <Button
              variant={timeframe === "weekly" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-lg text-xs"
              onClick={() => setTimeframe("weekly")}
            >
              Weekly Speed
            </Button>
            <Button
              variant={timeframe === "alltime" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-lg text-xs"
              onClick={() => setTimeframe("alltime")}
            >
              All-Time XP
            </Button>
          </div>
        </div>

        {/* Podium Top 3 visualization */}
        <div className="mx-auto grid max-w-4xl items-end gap-6 pt-8 pb-4 md:grid-cols-3">
          {podiumUsers.map((user) => {
            const isFirst = user.rank === 1;
            const isSecond = user.rank === 2;
            const heightClass = isFirst
              ? "h-64 border-primary/40 bg-primary/5"
              : isSecond
                ? "h-52"
                : "h-44";
            const badgeColor = isFirst
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
              : isSecond
                ? "bg-slate-400/10 text-slate-400 border-slate-400/20"
                : "bg-amber-700/10 text-amber-700 border-amber-700/20";

            return (
              <Card
                key={user.rank}
                className={`surface-card hover:border-primary/20 flex flex-col items-center justify-between p-6 text-center transition-all duration-300 ${heightClass} order-${user.rank === 1 ? "2" : user.rank === 2 ? "1" : "3"}`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Badge
                    variant="outline"
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold ${badgeColor}`}
                  >
                    {user.rank}
                  </Badge>
                  <div>
                    <h4 className="text-foreground text-sm font-bold">{user.name}</h4>
                    <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[11px] font-semibold">
                      <Flame className="h-3 w-3 text-orange-500" />
                      {user.streak} day streak
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-foreground text-2xl font-bold tracking-tight">
                    {user.wpm}{" "}
                    <span className="text-muted-foreground text-xs">WPM</span>
                  </p>
                  <p className="text-muted-foreground text-[10px] font-semibold">
                    {user.accuracy}% Accuracy | {user.xp} XP
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Table for ranks 4+ */}
        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-sm font-bold">
              <Globe className="text-primary h-4.5 w-4.5" />
              Community Standings
            </CardTitle>
            <CardDescription>
              Ranks 4 and below in the community database
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground border-b font-semibold">
                    <th className="w-16 p-4">Rank</th>
                    <th className="p-4">User</th>
                    <th className="p-4 text-center">Net WPM</th>
                    <th className="p-4 text-center">Accuracy</th>
                    <th className="p-4 text-center">Weekly XP</th>
                    <th className="p-4 text-center">Streak</th>
                    <th className="p-4 text-right">Compare</th>
                  </tr>
                </thead>
                <tbody className="divide-border/40 divide-y">
                  {listUsers.map((user) => (
                    <tr
                      key={user.rank}
                      className={`hover:bg-accent/40 transition-colors duration-200 ${
                        user.isCurrentUser ? "bg-primary/5 font-semibold" : ""
                      }`}
                    >
                      <td className="text-muted-foreground flex items-center gap-2 p-4 font-bold">
                        {user.rank}
                        {user.isCurrentUser && (
                          <Badge className="bg-primary/10 text-primary rounded-sm border-none px-1 text-[9px] leading-none">
                            You
                          </Badge>
                        )}
                      </td>
                      <td className="text-foreground p-4 font-bold">{user.name}</td>
                      <td className="text-foreground p-4 text-center font-bold">
                        {user.wpm} WPM
                      </td>
                      <td className="text-muted-foreground p-4 text-center font-medium">
                        {user.accuracy}%
                      </td>
                      <td className="text-muted-foreground p-4 text-center font-medium">
                        {user.xp} XP
                      </td>
                      <td className="text-muted-foreground p-4 text-center font-medium">
                        {user.streak} days
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 rounded-lg text-[10px]"
                        >
                          Inspect Profile
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
