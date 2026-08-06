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
import { StatisticsCalculator, type SessionResult } from "@/lib/typing-engine";
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

    const segments = sessionResult.segments;

    return segments.map((segment, index) => {
      // Raw WPM: same "before error adjustment" concept as the live-stats
      // rawWpm — segment.characterCount already counts every attempted
      // character (not just correct ones), so this is measured, not
      // estimated.
      const segmentMinutes = Math.max(
        (segment.endTime - segment.startTime) / 60000,
        1 / 60000,
      );
      const rawWpm = Math.round(segment.characterCount / 5 / segmentMinutes);

      // Rolling consistency: the same coefficient-of-variation algorithm
      // used for the headline consistency stat, computed over every
      // segment up to this point in time — so the last point on this
      // chart always matches the real session-level number shown
      // elsewhere on the page, instead of a different ad-hoc formula.
      const consistency = StatisticsCalculator.calculateConsistency(
        segments.slice(0, index + 1),
      );

      return {
        time: Math.floor((segment.endTime - sessionResult.timestamp) / 1000),
        wpm: Math.round(segment.wpm),
        rawWpm,
        accuracy: Math.round(segment.accuracy * 10) / 10,
        consistency,
        index,
      };
    });
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
          color: "var(--chart-speed)",
          secondaryColor: "var(--pink)",
          unit: " WPM",
        };
      case "accuracy":
        return {
          title: "Accuracy Over Time",
          dataKey: "accuracy",
          color: "var(--chart-accuracy)",
          unit: "%",
        };
      case "consistency":
        return {
          title: "Consistency Over Time",
          dataKey: "consistency",
          color: "var(--chart-consistency)",
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
                backgroundColor: "var(--card)",
                border: "2px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-pop-sm)",
                fontWeight: 600,
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
                backgroundColor: "var(--card)",
                border: "2px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-pop-sm)",
                fontWeight: 600,
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
