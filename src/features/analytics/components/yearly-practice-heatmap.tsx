"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "lucide-react";
import { AnalyticsService } from "@/features/analytics/services/analytics.service";

interface YearlyPracticeHeatmapProps {
  userId: string;
}

export function YearlyPracticeHeatmap({ userId }: YearlyPracticeHeatmapProps) {
  const [data, setData] = useState<Record<string, { count: number; duration: number }>>(
    {},
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const heatmap = await AnalyticsService.getYearlyActivity(userId);
        setData(heatmap);
      } catch (e) {
        console.error("Failed to load yearly activity:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userId]);

  // Compute 53 weeks (365 days) ending today
  const getGridDays = () => {
    const days = [];
    const today = new Date();

    // Adjust to start on a Sunday 365 days ago to build a neat grid
    const startDate = new Date();
    startDate.setDate(today.getDate() - 365);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const currentDate = new Date(startDate);
    while (currentDate <= today) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const gridDays = getGridDays();

  // Helper to resolve level color
  const getCellColor = (count: number) => {
    if (!count || count === 0)
      return "bg-secondary hover:bg-secondary/80 border border-border/10";
    if (count <= 2) return "bg-primary/20 hover:bg-primary/30 border border-primary/10";
    if (count <= 5) return "bg-primary/50 hover:bg-primary/60 border border-primary/30";
    return "bg-primary hover:bg-primary/90 border border-primary/50";
  };

  if (isLoading) {
    return (
      <Card className="surface-card">
        <CardHeader>
          <CardTitle>Practice Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex h-48 items-center justify-center">
          <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2" />
        </CardContent>
      </Card>
    );
  }

  // Chunk days into weeks (columns)
  const columns: Date[][] = [];
  for (let i = 0; i < gridDays.length; i += 7) {
    columns.push(gridDays.slice(i, i + 7));
  }

  // Find overall yearly stats
  const totalPracticeSessions = Object.values(data).reduce(
    (acc, val) => acc + val.count,
    0,
  );
  const totalPracticeSeconds = Object.values(data).reduce(
    (acc, val) => acc + val.duration,
    0,
  );
  const totalHours = Math.round((totalPracticeSeconds / 3600) * 10) / 10;

  return (
    <Card className="surface-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="text-primary h-5 w-5" />
            Yearly Practice Heatmap
          </CardTitle>
          <CardDescription>
            Visual tracker of your consistent training progress
          </CardDescription>
        </div>
        <div className="text-muted-foreground text-right text-xs font-semibold">
          <p className="text-foreground text-sm font-bold">
            {totalPracticeSessions} sessions
          </p>
          <p>{totalHours} hours practice time</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <TooltipProvider delayDuration={0}>
          <div className="flex flex-col overflow-x-auto pb-2">
            <div className="mx-auto flex min-w-[720px] gap-[3px] select-none">
              {/* Day Labels Column */}
              <div className="text-muted-foreground flex h-[88px] w-6 flex-col justify-between pt-3 pr-2 pb-2 text-[9px] font-semibold">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* Grid Columns */}
              {columns.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day) => {
                    const dateStr = day.toISOString().split("T")[0]!;
                    const stats = data[dateStr];
                    const sessionCount = stats?.count || 0;
                    const durationMins = stats ? Math.round(stats.duration / 60) : 0;

                    return (
                      <Tooltip key={dateStr}>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-[10px] w-[10px] cursor-pointer rounded-[2px] transition-all duration-150 ${getCellColor(
                              sessionCount,
                            )}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="rounded-xl border p-3">
                          <p className="text-foreground text-xs font-bold">
                            {day.toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-muted-foreground mt-0.5 text-xs font-medium">
                            {sessionCount === 0
                              ? "No practice sessions completed"
                              : `${sessionCount} sessions (${durationMins}m practice)`}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Heatmap Legend */}
            <div className="text-muted-foreground mt-4 flex items-center justify-end gap-1.5 pr-4 text-[10px] font-semibold">
              <span>Less</span>
              <div className="bg-secondary border-border/10 h-2.5 w-2.5 rounded-[1.5px] border" />
              <div className="bg-primary/20 border-primary/10 h-2.5 w-2.5 rounded-[1.5px] border" />
              <div className="bg-primary/50 border-primary/30 h-2.5 w-2.5 rounded-[1.5px] border" />
              <div className="bg-primary border-primary/50 h-2.5 w-2.5 rounded-[1.5px] border" />
              <span>More</span>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
