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
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { Info, Sparkles } from "lucide-react";
import { AnalyticsService } from "../services/analytics.service";
import type { PerformanceForecastPoint } from "../types";

interface ForecastCardProps {
  userId: string;
}

export function ForecastCard({ userId }: ForecastCardProps) {
  const [data, setData] = useState<PerformanceForecastPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const points = await AnalyticsService.getForecast(userId);
        setData(points);
      } catch (e) {
        console.error("Failed to load forecast data:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userId]);

  if (isLoading) {
    return (
      <Card className="surface-card">
        <CardHeader>
          <CardTitle>WPM Growth Forecast</CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Growth Forecasting
        </CardTitle>
        <CardDescription>
          Estimated progression speed based on historical trend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Forecast Area Line Chart */}
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorForecastRange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="label"
                stroke="var(--muted-foreground)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={["dataMin - 10", "dataMax + 10"]}
                stroke="var(--muted-foreground)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "12px",
                }}
              />
              {/* Projected boundary band */}
              <Area
                type="monotone"
                dataKey="wpmUpperBound"
                stroke="transparent"
                fill="url(#colorForecastRange)"
                dataKey-2="wpmLowerBound" // Recharts ranges syntax
              />
              <Line
                type="monotone"
                dataKey="wpmActual"
                name="Actual WPM"
                stroke="var(--primary)"
                strokeWidth={2.5}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="wpmPredicted"
                name="Predicted WPM"
                stroke="var(--primary)"
                strokeWidth={2}
                strokeDasharray="4 4"
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast disclaimer warning */}
        <div className="text-muted-foreground bg-muted/60 flex items-start gap-1.5 rounded-xl border p-2.5 text-[11px] font-semibold">
          <Info className="text-primary mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Forecasts are calculated via mathematical linear progression metrics using
            your recent 15 completed sessions. Actual performance may vary depending on
            content difficulty, focus levels, and daily consistency.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
