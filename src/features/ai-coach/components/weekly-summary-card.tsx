"use client";

import { Calendar, TrendingDown, TrendingUp, Minus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeeklyProgressReport } from "@/features/ai-coach/types";
import { cn } from "@/lib/utils";

interface WeeklySummaryCardProps {
  report: WeeklyProgressReport;
  source?: "ai" | "cache" | "fallback";
  className?: string;
}

function ChangeIndicator({ value, suffix = "" }: { value: number; suffix?: string }) {
  if (value > 0) {
    return (
      <span className="text-success flex items-center gap-0.5 text-sm font-medium">
        <TrendingUp className="h-3.5 w-3.5" />+{value.toFixed(1)}
        {suffix}
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="text-destructive flex items-center gap-0.5 text-sm font-medium">
        <TrendingDown className="h-3.5 w-3.5" />
        {value.toFixed(1)}
        {suffix}
      </span>
    );
  }
  return (
    <span className="text-muted-foreground flex items-center gap-0.5 text-sm">
      <Minus className="h-3.5 w-3.5" />0{suffix}
    </span>
  );
}

export function WeeklySummaryCard({ report, source, className }: WeeklySummaryCardProps) {
  return (
    <Card className={cn("border-border/50 bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>Weekly Progress</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {report.weekStart} – {report.weekEnd}
            </CardDescription>
          </div>
          {source && source !== "ai" && (
            <Badge variant="secondary" className="capitalize">
              {source === "fallback" ? "Offline" : source}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{report.summary}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-muted-foreground mb-1 text-xs font-medium">Typing WPM</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {report.typingProgress.averageWpm.toFixed(0)}
              </span>
              <ChangeIndicator value={report.typingProgress.wpmChange} />
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              {report.typingProgress.totalSessions} sessions
            </p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-muted-foreground mb-1 text-xs font-medium">Accuracy</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {report.typingProgress.averageAccuracy.toFixed(1)}%
              </span>
              <ChangeIndicator value={report.typingProgress.accuracyChange} suffix="%" />
            </div>
          </div>
        </div>

        {report.nextWeekGoals.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">Next Week Goals</p>
            <ul className="text-muted-foreground space-y-1 text-sm">
              {report.nextWeekGoals.slice(0, 3).map((goal) => (
                <li key={goal}>• {goal}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
