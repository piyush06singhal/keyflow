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
import { AlertTriangle, CornerDownLeft, RotateCcw, Percent } from "lucide-react";
import { AnalyticsService } from "../services/analytics.service";
import type { AnalyticsTimeframe, MistakeAnalysisData } from "../types";

interface MistakeAnalysisProps {
  userId: string;
  timeframe: AnalyticsTimeframe;
}

export function MistakeAnalysis({ userId, timeframe }: MistakeAnalysisProps) {
  const [data, setData] = useState<MistakeAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const analysis = await AnalyticsService.getMistakeAnalysis(userId, timeframe);
        setData(analysis);
      } catch (e) {
        console.error("Failed to load mistake analysis:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userId, timeframe]);

  if (isLoading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI header block */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="surface-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Correction Rate
            </span>
            <RotateCcw className="h-4.5 w-4.5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.correctionRate}%</div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              Percentage of typos corrected immediately
            </p>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Backspace Overuse
            </span>
            <CornerDownLeft className="h-4.5 w-4.5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.backspaceUsageRatio}%</div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              Backspace presses relative to total keys typed
            </p>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Rhythm Score
            </span>
            <Percent className="text-primary h-4.5 w-4.5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.rhythmScore}/100</div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              Timing interval consistency rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mistake splits grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Commonly mistyped letters */}
        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-sm font-bold text-balance">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              Mistyped Characters
            </CardTitle>
            <CardDescription>Most frequently mistyped alphabet letters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.mistypedCharacters.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="rounded-lg px-2.5 py-1 font-mono text-sm uppercase"
                >
                  {item.item === " " ? "Space" : item.item}
                </Badge>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="text-muted-foreground">{item.count} errors</span>
                  <Progress
                    value={Math.min(100, item.count * 8)}
                    className="h-1 w-16"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Commonly mistyped symbols */}
        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-sm font-bold text-balance">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Mistyped Symbols
            </CardTitle>
            <CardDescription>Common syntax and bracket symbol errors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.mistypedSymbols.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="rounded-lg px-2.5 py-1 font-mono text-sm"
                >
                  {item.item}
                </Badge>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="text-muted-foreground">{item.count} errors</span>
                  <Progress
                    value={Math.min(100, item.count * 8)}
                    className="h-1 w-16"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Commonly mistyped words */}
        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-sm font-bold text-balance">
              <AlertTriangle className="h-4 w-4 text-indigo-500" />
              Mistyped Words
            </CardTitle>
            <CardDescription>Keywords and complete words causing typos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.mistypedWords.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="rounded-lg px-2.5 py-1 font-mono text-sm"
                >
                  {item.item}
                </Badge>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="text-muted-foreground">{item.count} errors</span>
                  <Progress
                    value={Math.min(100, item.count * 15)}
                    className="h-1 w-16"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
