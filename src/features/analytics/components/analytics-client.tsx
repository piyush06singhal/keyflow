"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Keyboard,
  Code2,
  Calendar,
  AlertCircle,
  TrendingUp,
  Printer,
  Target,
  FileSpreadsheet,
  FileJson,
  LayoutGrid,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalyticsService } from "@/features/analytics/services/analytics.service";
import type { AnalyticsTimeframe, AnalyticsSummary } from "@/features/analytics/types";

// Dynamic sub-components
import { OverviewCards } from "@/features/analytics/components/overview-cards";
import { PerformanceCharts } from "@/features/analytics/components/performance-charts";
import { CodingCharts } from "@/features/analytics/components/coding-charts";
import { KeyboardHeatmap } from "@/features/analytics/components/keyboard-heatmap";
import { MistakeAnalysis } from "@/features/analytics/components/mistake-analysis";
import { YearlyPracticeHeatmap } from "@/features/analytics/components/yearly-practice-heatmap";
import { GoalProgress } from "@/features/analytics/components/goal-progress";
import { HistoricalTimeline } from "@/features/analytics/components/historical-timeline";
import { ForecastCard } from "@/features/analytics/components/forecast-card";
import { AIInsightCard } from "@/features/analytics/components/ai-insight-card";

interface AnalyticsClientProps {
  userId: string;
}

export function AnalyticsClient({ userId }: AnalyticsClientProps) {
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>("month");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load summary and aggregations
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await AnalyticsService.getSummary(userId, timeframe);
        setSummary(data);
      } catch (err) {
        console.error("Failed to load analytics summary:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userId, timeframe]);

  // Export handlers
  const handleExportCSV = async () => {
    try {
      const data = await AnalyticsService.getWpmProgression(userId, "all");
      const headers = [
        "Date",
        "WPM",
        "Raw WPM",
        "Accuracy (%)",
        "Consistency (%)",
        "Sessions",
      ];
      const csvRows = [
        headers.join(","),
        ...data.map((row) =>
          [
            row.date,
            row.wpm,
            row.rawWpm,
            row.accuracy,
            row.consistency,
            row.sessionsCount,
          ].join(","),
        ),
      ];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", `keyflow_analytics_${timeframe}.csv`);
      a.click();
    } catch (e) {
      console.error("Failed to export CSV:", e);
    }
  };

  const handleExportJSON = () => {
    if (!summary) return;
    const blob = new Blob([JSON.stringify(summary, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `keyflow_analytics_${timeframe}.json`);
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading && !summary) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2" />
          <p className="text-muted-foreground text-sm">
            Loading intelligence dashboards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Top Banner Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Performance Intelligence
          </h1>
          <p className="text-muted-foreground text-sm">
            Deep insights, heatmap profiles, mistake forensics, and AI habit coaching.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe selector */}
          <Select value={timeframe} onValueChange={(val: any) => setTimeframe(val)}>
            <SelectTrigger className="w-[140px] rounded-xl">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="day" className="rounded-lg">
                Today
              </SelectItem>
              <SelectItem value="week" className="rounded-lg">
                Last 7 Days
              </SelectItem>
              <SelectItem value="month" className="rounded-lg">
                Last 30 Days
              </SelectItem>
              <SelectItem value="year" className="rounded-lg">
                This Year
              </SelectItem>
              <SelectItem value="all" className="rounded-lg">
                All Time
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Export & Actions Toolbar */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={handleExportCSV}
            >
              <FileSpreadsheet className="mr-1.5 h-4 w-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={handleExportJSON}
            >
              <FileJson className="mr-1.5 h-4 w-4" />
              JSON
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs list navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full print:hidden"
      >
        <TabsList className="bg-card shadow-key-xs grid w-full grid-cols-3 gap-1 rounded-2xl p-1 md:flex md:w-auto">
          <TabsTrigger value="overview" className="rounded-xl px-4 py-2.5">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="typing" className="rounded-xl px-4 py-2.5">
            <Keyboard className="mr-2 h-4 w-4" />
            Typing
          </TabsTrigger>
          <TabsTrigger value="coding" className="rounded-xl px-4 py-2.5">
            <Code2 className="mr-2 h-4 w-4" />
            Coding
          </TabsTrigger>
          <TabsTrigger value="keyboard" className="rounded-xl px-4 py-2.5">
            <Keyboard className="mr-2 h-4 w-4" />
            Keyboard Heatmap
          </TabsTrigger>
          <TabsTrigger value="mistakes" className="rounded-xl px-4 py-2.5">
            <AlertCircle className="mr-2 h-4 w-4" />
            Mistake Analysis
          </TabsTrigger>
          <TabsTrigger value="goals" className="rounded-xl px-4 py-2.5">
            <Target className="mr-2 h-4 w-4" />
            Goals & Forecasts
          </TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-xl px-4 py-2.5">
            <Calendar className="mr-2 h-4 w-4" />
            History Log
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Main content display blocks */}
      <div className="space-y-6">
        {summary && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${timeframe}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Aggregated KPI Cards */}
                  <OverviewCards summary={summary} />

                  {/* AI insights highlight and practice heatmap */}
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                      <YearlyPracticeHeatmap userId={userId} />
                    </div>
                    <div className="lg:col-span-1">
                      <AIInsightCard userId={userId} />
                    </div>
                  </div>

                  {/* High level quick progression summary */}
                  <Card className="surface-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="text-primary h-5 w-5" />
                        Speed and Accuracy Overview
                      </CardTitle>
                      <CardDescription>
                        Visual stats progression tracker
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PerformanceCharts userId={userId} timeframe={timeframe} simple />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "typing" && (
                <div className="space-y-6">
                  <OverviewCards summary={summary} typingOnly />
                  <Card className="surface-card">
                    <CardHeader>
                      <CardTitle>Typing Metrics Progression</CardTitle>
                      <CardDescription>
                        Progression of WPM, Accuracy, and Consistency rates
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PerformanceCharts userId={userId} timeframe={timeframe} />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "coding" && (
                <div className="space-y-6">
                  <OverviewCards summary={summary} codingOnly />
                  <div className="grid gap-6 md:grid-cols-2">
                    <CodingCharts userId={userId} timeframe={timeframe} />
                  </div>
                </div>
              )}

              {activeTab === "keyboard" && (
                <div className="space-y-6">
                  <KeyboardHeatmap userId={userId} timeframe={timeframe} />
                </div>
              )}

              {activeTab === "mistakes" && (
                <div className="space-y-6">
                  <MistakeAnalysis userId={userId} timeframe={timeframe} />
                </div>
              )}

              {activeTab === "goals" && (
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <GoalProgress userId={userId} />
                  </div>
                  <div className="lg:col-span-1">
                    <ForecastCard userId={userId} />
                  </div>
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="space-y-6">
                  <HistoricalTimeline userId={userId} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
