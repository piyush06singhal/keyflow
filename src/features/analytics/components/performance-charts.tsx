"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsService } from "../services/analytics.service";
import type { AnalyticsTimeframe, WpmProgressionPoint } from "../types";

interface PerformanceChartsProps {
  userId: string;
  timeframe: AnalyticsTimeframe;
  simple?: boolean;
}

export function PerformanceCharts({
  userId,
  timeframe,
  simple = false,
}: PerformanceChartsProps) {
  const [data, setData] = useState<WpmProgressionPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const points = await AnalyticsService.getWpmProgression(userId, timeframe);
        setData(points);
      } catch (e) {
        console.error("Failed to load progression:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userId, timeframe]);

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed p-8">
        <p className="text-muted-foreground text-sm">
          No progression data found in this timeframe
        </p>
      </div>
    );
  }

  // Render a simple single area chart for the main dashboard overview
  if (simple) {
    return (
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
            />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "12px",
              }}
              labelClassName="font-semibold text-xs text-foreground"
            />
            <Area
              type="monotone"
              dataKey="wpm"
              name="Speed (WPM)"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorWpm)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Detailed tabbed view
  return (
    <Tabs defaultValue="wpm" className="w-full">
      <TabsList className="mb-6 grid w-full max-w-[400px] grid-cols-2">
        <TabsTrigger value="wpm">Speed Progression</TabsTrigger>
        <TabsTrigger value="accuracy">Accuracy & Rhythm</TabsTrigger>
      </TabsList>

      <TabsContent value="wpm" className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWpmFull" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRawWpm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
            />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "12px",
              }}
              labelClassName="font-semibold text-xs text-foreground"
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area
              type="monotone"
              dataKey="wpm"
              name="Net WPM"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorWpmFull)"
            />
            <Area
              type="monotone"
              dataKey="rawWpm"
              name="Raw WPM"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorRawWpm)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="accuracy" className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
            />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[50, 100]}
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "12px",
              }}
              labelClassName="font-semibold text-xs text-foreground"
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line
              type="monotone"
              dataKey="accuracy"
              name="Accuracy (%)"
              stroke="#10b981"
              strokeWidth={2.5}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="consistency"
              name="Consistency (%)"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
}
