"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { SessionResult } from "@/lib/typing-engine";
import { cn } from "@/lib/utils";

export interface PerformanceChartProps {
  sessionResult: SessionResult;
  type: "wpm" | "accuracy" | "consistency";
  className?: string;
}

export function PerformanceChart({
  sessionResult,
  type,
  className,
}: PerformanceChartProps) {
  const chartData = useMemo(() => {
    if (!sessionResult.segments || sessionResult.segments.length === 0) {
      return [];
    }

    return sessionResult.segments.map((segment, index) => ({
      time: Math.floor((segment.endTime - sessionResult.timestamp) / 1000),
      wpm: Math.round(segment.wpm),
      rawWpm: Math.round(segment.wpm * 1.1), // Estimate raw WPM
      accuracy: Math.round(segment.accuracy * 10) / 10,
      consistency: 100 - Math.abs(segment.wpm - sessionResult.averageWpm),
      index,
    }));
  }, [sessionResult]);

  if (chartData.length === 0) {
    return (
      <Card className={cn("flex items-center justify-center p-8", className)}>
        <p className="text-muted-foreground text-sm">No chart data available</p>
      </Card>
    );
  }

  const getChartConfig = () => {
    switch (type) {
      case "wpm":
        return {
          title: "Words Per Minute Over Time",
          dataKey: "wpm",
          secondaryKey: "rawWpm",
          color: "#3b82f6",
          secondaryColor: "#93c5fd",
          unit: " WPM",
        };
      case "accuracy":
        return {
          title: "Accuracy Over Time",
          dataKey: "accuracy",
          color: "#10b981",
          unit: "%",
        };
      case "consistency":
        return {
          title: "Consistency Over Time",
          dataKey: "consistency",
          color: "#8b5cf6",
          unit: "",
        };
    }
  };

  const config = getChartConfig();

  return (
    <Card className={cn("p-6", className)}>
      <h3 className="mb-4 text-sm font-semibold">{config.title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        {type === "wpm" ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRawWpm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.secondaryColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={config.secondaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="time"
              className="text-xs"
              label={{ value: "Time (s)", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              className="text-xs"
              label={{ value: "WPM", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value, name) => [
                value !== undefined ? `${value}${config.unit}` : "N/A",
                name === "wpm" ? "WPM" : "Raw WPM",
              ]}
            />
            <Area
              type="monotone"
              dataKey="rawWpm"
              stroke={config.secondaryColor}
              strokeWidth={1}
              fill="url(#colorRawWpm)"
              strokeDasharray="3 3"
            />
            <Area
              type="monotone"
              dataKey={config.dataKey}
              stroke={config.color}
              strokeWidth={2}
              fill="url(#colorWpm)"
            />
          </AreaChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="time"
              className="text-xs"
              label={{ value: "Time (s)", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              className="text-xs"
              domain={type === "accuracy" ? [0, 100] : ["auto", "auto"]}
              label={{
                value: type === "accuracy" ? "Accuracy %" : "Score",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value) => [
                `${typeof value === "number" ? value.toFixed(1) : value}${config.unit}`,
                config.title.split(" Over")[0],
              ]}
            />
            <Line
              type="monotone"
              dataKey={config.dataKey}
              stroke={config.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
