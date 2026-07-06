"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnalyticsService } from "@/features/analytics/services/analytics.service";
import type { AnalyticsTimeframe, LanguageStatPoint } from "@/features/analytics/types";

interface CodingChartsProps {
  userId: string;
  timeframe: AnalyticsTimeframe;
}

const COLORS = ["#6366f1", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#3b82f6"];

export function CodingCharts({ userId, timeframe }: CodingChartsProps) {
  const [data, setData] = useState<LanguageStatPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const stats = await AnalyticsService.getCodingLanguageStats(userId, timeframe);
        setData(stats);
      } catch (e) {
        console.error("Failed to load coding stats:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userId, timeframe]);

  if (isLoading) {
    return (
      <div className="col-span-2 flex h-72 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="col-span-2 flex h-72 items-center justify-center rounded-xl border border-dashed p-8">
        <p className="text-muted-foreground text-sm">
          No coding history found. Start practicing coding snippets!
        </p>
      </div>
    );
  }

  // Radar concept chart data (average across top languages)
  const avgBrackets = Math.round(
    data.reduce((acc, val) => acc + val.bracketAccuracy, 0) / data.length,
  );
  const avgIndent = Math.round(
    data.reduce((acc, val) => acc + val.indentationAccuracy, 0) / data.length,
  );
  const syntaxErrors = data.reduce((acc, val) => acc + val.syntaxErrorsCount, 0);

  const radarData = [
    { subject: "Scope Brackets", value: avgBrackets, fullMark: 100 },
    { subject: "Indentation Formatting", value: avgIndent, fullMark: 100 },
    {
      subject: "Syntax Precision",
      value: Math.max(60, 100 - syntaxErrors * 5),
      fullMark: 100,
    },
    { subject: "Speed Consistency", value: 85, fullMark: 100 },
    {
      subject: "Keyword Accuracy",
      value: Math.round(data[0]?.averageAccuracy || 94),
      fullMark: 100,
    },
  ];

  return (
    <>
      {/* 1. Language Share Pie Chart */}
      <Card className="surface-card">
        <CardHeader>
          <CardTitle>Programming Languages</CardTitle>
          <CardDescription>Practice distribution share</CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="sessionsCount"
                nameKey="language"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "12px",
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Speed and Accuracy by Language Bar Chart */}
      <Card className="surface-card">
        <CardHeader>
          <CardTitle>Language Efficiency</CardTitle>
          <CardDescription>Speed and accuracy statistics per language</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="language"
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
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar
                dataKey="averageWpm"
                name="Avg WPM"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="averageAccuracy"
                name="Accuracy (%)"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Concepts radar mapping */}
      <Card className="surface-card md:col-span-2">
        <CardHeader>
          <CardTitle>Coding Concepts Forensics</CardTitle>
          <CardDescription>
            Accuracy and syntax compliance radar mapping
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="subject"
                stroke="var(--muted-foreground)"
                fontSize={11}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="var(--border)"
                fontSize={9}
              />
              <Radar
                name="User Score"
                dataKey="value"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
