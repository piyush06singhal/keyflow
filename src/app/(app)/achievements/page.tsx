"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AchievementDefinition } from "@/features/gamification/config/achievements";
import {
  ACHIEVEMENTS_REGISTRY,
  RARITY_STYLES,
} from "@/features/gamification/config/achievements";
import {
  DailyMissionsWidget,
  XPCard,
} from "@/features/gamification/components/gamification-widgets";
import { ProgressionTimeline } from "@/features/gamification/components/timeline";
import {
  Trophy,
  ShieldAlert,
  Award,
  Star,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AchievementsPage() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 2450,
    totalSessions: 12,
    totalWords: 3400,
    bestWpm: 72,
    bestAccuracy: 98,
    currentStreak: 7,
    longestStreak: 12,
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // all, unlocked, locked
  const [sortBy, setSortBy] = useState("rarity"); // rarity, xp, title

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function loadProgression() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // Load unlocked achievements
          const { data: userAch } = await supabase
            .from("user_achievements")
            .select("achievement_id")
            .eq("user_id", user.id);

          if (userAch) {
            setUnlockedIds(userAch.map((a: any) => a.achievement_id));
          }

          // Load stats
          const { data: statsData } = await supabase
            .from("user_statistics")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (statsData) {
            setUserStats({
              level: statsData.level || 1,
              xp: statsData.xp || 0,
              totalSessions: statsData.total_sessions || 0,
              totalWords: statsData.total_words_typed || 0,
              bestWpm: statsData.best_wpm || 0,
              bestAccuracy: statsData.best_accuracy || 0,
              currentStreak: statsData.current_streak || 0,
              longestStreak: statsData.longest_streak || 0,
            });
          }
        }
      } catch (err) {
        console.warn(
          "Table references not created yet or database offline. Using fallbacks.",
          err,
        );
      }

      // Fallback local storage check
      if (typeof window !== "undefined") {
        const localStats = localStorage.getItem("keyflow-user-stats");
        if (localStats) setUserStats(JSON.parse(localStats));

        const localAch = localStorage.getItem("keyflow-unlocked-achievements");
        if (localAch) setUnlockedIds(JSON.parse(localAch));
      }
    }

    loadProgression();
  }, [supabase]);

  // Compute current completion progress for a locked metric
  const getProgress = (ach: AchievementDefinition) => {
    let current = 0;
    switch (ach.metric) {
      case "wpm":
        current = userStats.bestWpm;
        break;
      case "accuracy":
        current = userStats.bestAccuracy;
        break;
      case "consistency":
        current = 92; // default high consistent value mock
        break;
      case "sessions":
        current = userStats.totalSessions;
        break;
      case "words":
        current = userStats.totalWords;
        break;
      case "streak":
        current = userStats.currentStreak;
        break;
      default:
        break;
    }
    const pct = Math.min(100, (current / ach.targetValue) * 100);
    return { current, percentage: pct };
  };

  // Filter list
  const filteredAchievements = ACHIEVEMENTS_REGISTRY.filter((ach) => {
    const isUnlocked = unlockedIds.includes(ach.id);
    if (statusFilter === "unlocked" && !isUnlocked) return false;
    if (statusFilter === "locked" && isUnlocked) return false;

    if (categoryFilter !== "all" && ach.category !== categoryFilter) return false;

    return (
      ach.title.toLowerCase().includes(search.toLowerCase()) ||
      ach.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Sort list
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sortBy === "xp") {
      return b.xpReward - a.xpReward;
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    // Sort by rarity score (mythic, legendary, epic, rare, uncommon, common)
    const rarityRank = {
      mythic: 6,
      legendary: 5,
      epic: 4,
      rare: 3,
      uncommon: 2,
      common: 1,
    };
    return rarityRank[b.rarity] - rarityRank[a.rarity];
  });

  const unlockedCount = ACHIEVEMENTS_REGISTRY.filter((a) =>
    unlockedIds.includes(a.id),
  ).length;
  const progressPercent = (unlockedCount / ACHIEVEMENTS_REGISTRY.length) * 100;

  return (
    <PageContainer maxWidth="full">
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Achievements & Badges</h1>
            <p className="text-muted-foreground text-sm">
              Review levels milestones, rarity classes, and unlock typing speed badges.
            </p>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main achievements grid list (col-span-2) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Completion Summary banner */}
            <Card className="surface-card from-primary/[0.03] to-primary/[0.01] bg-gradient-to-br">
              <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-foreground text-base font-bold">
                      Completion Milestone Tracker
                    </h3>
                  </div>
                  <Progress value={progressPercent} className="h-2 rounded-full" />
                  <p className="text-muted-foreground text-xs font-semibold">
                    You have unlocked{" "}
                    <span className="text-primary font-bold">{unlockedCount}</span> of{" "}
                    <span className="font-bold">{ACHIEVEMENTS_REGISTRY.length}</span>{" "}
                    badges ({Math.round(progressPercent)}%)
                  </p>
                </div>
                <div className="bg-primary/5 border-primary/10 flex w-28 shrink-0 flex-col items-center justify-center rounded-2xl border p-4.5">
                  <Award className="text-primary h-7 w-7 animate-pulse" />
                  <span className="text-muted-foreground mt-1.5 text-[10px] font-bold tracking-wider uppercase">
                    Unlocked
                  </span>
                  <span className="text-foreground text-lg font-bold">
                    {unlockedCount}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Filter toolbar */}
            <div className="bg-muted/30 flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative w-full sm:max-w-xs">
                  <Search className="text-muted-foreground absolute top-2 left-2.5 h-3.5 w-3.5" />
                  <Input
                    placeholder="Search badges..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 rounded-lg pl-8 text-xs"
                  />
                </div>

                {/* Category */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-8 w-[120px] rounded-lg text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="all" className="rounded-md text-xs">
                      All Categories
                    </SelectItem>
                    <SelectItem value="speed" className="rounded-md text-xs">
                      Speed
                    </SelectItem>
                    <SelectItem value="accuracy" className="rounded-md text-xs">
                      Accuracy
                    </SelectItem>
                    <SelectItem value="consistency" className="rounded-md text-xs">
                      Consistency
                    </SelectItem>
                    <SelectItem value="practice" className="rounded-md text-xs">
                      Practice
                    </SelectItem>
                    <SelectItem value="streaks" className="rounded-md text-xs">
                      Streaks
                    </SelectItem>
                    <SelectItem value="coding" className="rounded-md text-xs">
                      Coding
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Status */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 w-[120px] rounded-lg text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="all" className="rounded-md text-xs">
                      All Badges
                    </SelectItem>
                    <SelectItem value="unlocked" className="rounded-md text-xs">
                      Unlocked Only
                    </SelectItem>
                    <SelectItem value="locked" className="rounded-md text-xs">
                      Locked Only
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sorting */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 w-[120px] rounded-lg text-xs">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="rarity" className="rounded-md text-xs">
                    By Rarity
                  </SelectItem>
                  <SelectItem value="xp" className="rounded-md text-xs">
                    By XP Reward
                  </SelectItem>
                  <SelectItem value="title" className="rounded-md text-xs">
                    By Title
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Achievements lists */}
            <div className="grid gap-4 sm:grid-cols-2">
              {sortedAchievements.map((ach) => {
                const isUnlocked = unlockedIds.includes(ach.id);
                const style = RARITY_STYLES[ach.rarity];
                const progressInfo = getProgress(ach);

                return (
                  <Card
                    key={ach.id}
                    className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isUnlocked
                        ? `bg-card border-border/40 hover:scale-[1.01] ${style.glowClass}`
                        : "bg-muted/10 border-border/20 opacity-75 grayscale"
                    }`}
                  >
                    <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2.5">
                      {/* Badge Icon bubble */}
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl ${style.bgColor} ${style.borderColor}`}
                      >
                        {ach.icon}
                      </div>

                      <div className="space-y-0.5">
                        <CardTitle className="text-foreground flex items-center gap-1.5 text-xs font-bold">
                          {ach.title}
                        </CardTitle>
                        <span
                          className={`text-[9px] font-bold tracking-wider uppercase ${style.textColor}`}
                        >
                          {style.label}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 pt-0">
                      <p className="text-muted-foreground text-[11px] leading-normal">
                        {ach.description}
                      </p>

                      {/* Progression detail for locked or unlocked */}
                      {isUnlocked ? (
                        <div className="border-border/40 text-muted-foreground flex items-center justify-between border-t pt-1 text-[9px] font-semibold">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Unlocked
                          </span>
                          <span className="text-primary font-bold">
                            +{ach.xpReward} XP Gained
                          </span>
                        </div>
                      ) : (
                        <div className="border-border/30 space-y-1.5 border-t pt-1">
                          <div className="text-muted-foreground flex items-center justify-between text-[9px] font-semibold">
                            <span>Progress</span>
                            <span>
                              {Math.round(progressInfo.current)} / {ach.targetValue}
                            </span>
                          </div>
                          <Progress value={progressInfo.percentage} className="h-1" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {sortedAchievements.length === 0 && (
                <div className="col-span-full flex h-64 flex-col items-center justify-center space-y-2 text-center">
                  <ShieldAlert className="text-muted-foreground/30 h-10 w-10" />
                  <h4 className="text-foreground text-sm font-bold">
                    No badges matched your filters
                  </h4>
                  <p className="text-muted-foreground max-w-[240px] text-xs">
                    Try clearing filters or search queries to review alternative
                    milestones.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar widget columns (XP stats, daily challenges, timeline milestones) */}
          <div className="space-y-6">
            <XPCard
              xp={userStats.xp}
              level={userStats.level}
              streak={userStats.currentStreak}
            />
            <DailyMissionsWidget />
            <ProgressionTimeline
              nodes={[
                {
                  id: "1",
                  title: `Level ${userStats.level} Achieved`,
                  description: `Reached total passport value of ${userStats.xp} XP points.`,
                  date: "Today",
                  type: "level_up",
                  value: `Lvl ${userStats.level}`,
                },
                {
                  id: "2",
                  title: "Consistent Runs",
                  description: "Hit best typing runs precision score above 95%.",
                  date: "2 days ago",
                  type: "achievement",
                  value: "precision",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
