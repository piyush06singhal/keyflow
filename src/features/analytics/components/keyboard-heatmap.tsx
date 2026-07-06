"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { AnalyticsService } from "@/features/analytics/services/analytics.service";
import type {
  AnalyticsTimeframe,
  KeyboardHeatmapData,
} from "@/features/analytics/types";

interface KeyboardHeatmapProps {
  userId: string;
  timeframe: AnalyticsTimeframe;
}

export function KeyboardHeatmap({ userId, timeframe }: KeyboardHeatmapProps) {
  const [data, setData] = useState<KeyboardHeatmapData | null>(null);
  const [mode, setMode] = useState<"frequency" | "error">("frequency");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const heatmap = await AnalyticsService.getKeyboardHeatmapData(
          userId,
          timeframe,
        );
        setData(heatmap);
      } catch (e) {
        console.error("Failed to load keyboard heatmap:", e);
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

  // Keyboard layout rows configuration
  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
    [" "],
  ];

  // Helper to determine key colors based on selected mode
  const getKeyStyle = (key: string) => {
    const lowerKey = key.toLowerCase();
    const stats = data.keys[lowerKey];
    if (!stats || stats.pressedCount === 0) {
      return { backgroundColor: "var(--muted)", color: "var(--muted-foreground)" };
    }

    if (mode === "frequency") {
      // Find max pressed key to scale background opacity
      const maxPressed = Math.max(
        ...Object.values(data.keys).map((k) => k.pressedCount),
      );
      const intensity = stats.pressedCount / (maxPressed || 1);
      // Indigo scaling
      return {
        backgroundColor: `rgba(99, 102, 241, ${Math.max(0.1, intensity * 0.95)})`,
        color: intensity > 0.5 ? "white" : "var(--foreground)",
        border: "1px solid rgba(99, 102, 241, 0.4)",
      };
    } else {
      // Error Mode - Scale with destructive red
      const intensity = Math.min(1, stats.errorRate / 15); // cap error scaling at 15% rate
      return {
        backgroundColor: `rgba(239, 68, 68, ${Math.max(0.08, intensity * 0.9)})`,
        color: intensity > 0.5 ? "white" : "var(--foreground)",
        border: "1px solid rgba(239, 68, 68, 0.4)",
      };
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Keyboard Grid section */}
      <Card className="surface-card lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Keystroke Intel Profile</CardTitle>
            <CardDescription>
              Hover over keys to view individual error rates and keypresses
            </CardDescription>
          </div>
          <div className="bg-muted flex gap-1.5 rounded-xl p-1">
            <Button
              variant={mode === "frequency" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-lg text-xs"
              onClick={() => setMode("frequency")}
            >
              Frequency
            </Button>
            <Button
              variant={mode === "error" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-lg text-xs"
              onClick={() => setMode("error")}
            >
              Error Rate
            </Button>
          </div>
        </CardHeader>
        <CardContent className="bg-card/40 flex flex-col items-center justify-center overflow-x-auto rounded-b-2xl p-6">
          <TooltipProvider delayDuration={0}>
            <div className="bg-muted/30 w-[680px] space-y-1.5 rounded-2xl border p-4">
              {rows.map((row, i) => (
                <div key={i} className="flex justify-center gap-1.5">
                  {row.map((key) => {
                    const stats = data.keys[key.toLowerCase()];
                    const pressCount = stats?.pressedCount || 0;
                    const errRate = stats?.errorRate || 0;

                    return (
                      <Tooltip key={key}>
                        <TooltipTrigger asChild>
                          <button
                            style={getKeyStyle(key)}
                            className={`flex h-11 cursor-help items-center justify-center rounded-lg text-sm font-semibold uppercase transition-all duration-200 ${
                              key === " " ? "w-[240px]" : "w-11"
                            }`}
                          >
                            {key === " " ? "Space" : key}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] rounded-xl border p-3">
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs font-bold uppercase">
                              Key: {key === " " ? "Spacebar" : key}
                            </p>
                            <p className="text-foreground text-sm font-bold">
                              Presses: {pressCount}
                            </p>
                            <p className="text-foreground text-sm font-bold">
                              Errors: {stats?.errorCount || 0}
                            </p>
                            <p className="text-primary text-xs font-semibold">
                              Error Rate: {errRate}%
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Hand Load Profile */}
      <Card className="surface-card">
        <CardHeader>
          <CardTitle>Finger Usage Breakdown</CardTitle>
          <CardDescription>
            Estimated muscular load distribution per finger
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(data.fingerUsage).map(([finger, presses]) => {
            const totalPresses =
              Object.values(data.fingerUsage).reduce((a, b) => a + b, 0) || 1;
            const percent = Math.round((presses / totalPresses) * 100);

            return (
              <div key={finger} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">{finger}</span>
                  <span className="text-foreground">{percent}%</span>
                </div>
                <Progress value={percent} className="h-1.5" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
