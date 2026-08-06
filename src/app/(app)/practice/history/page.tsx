"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, TrendingUp, Clock, Zap } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageContainer, PageHeader } from "@/components/app-shell";
import { SessionHistoryCard } from "@/components/session-results";
import { Card } from "@/components/ui/card";
import { TiltCard } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSessionHistory } from "@/lib/local-storage/practice-history";
import { getPersonalBests } from "@/lib/local-storage/personal-bests";
import { getAggregatedAnalytics } from "@/lib/session-lifecycle";

/**
 * Session History Page
 *
 * All practice history lives in the browser (no account, no backend).
 * "Sessions" lists individual runs; "Trends" shows day-over-day progress
 * from the local analytics aggregator.
 */

type SortKey = "date" | "wpm" | "accuracy" | "duration";

export default function SessionHistoryPage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // localStorage is written to by the practice pages, not this one, so it
  // can't be read once on mount — re-read whenever this page becomes
  // visible again (tab focus, back-navigation) so a session completed
  // elsewhere actually shows up without a hard reload.
  const [sessions, setSessions] = useState<ReturnType<typeof getSessionHistory>>([]);
  const [bests, setBests] = useState<ReturnType<typeof getPersonalBests> | null>(null);
  const [analytics, setAnalytics] = useState<ReturnType<
    typeof getAggregatedAnalytics
  > | null>(null);

  useEffect(() => {
    const refresh = () => {
      setSessions(getSessionHistory());
      setBests(getPersonalBests());
      setAnalytics(getAggregatedAnalytics());
    };

    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const sortedSessions = useMemo(() => {
    const sortValue = (s: (typeof sessions)[number]) => {
      switch (sortBy) {
        case "wpm":
          return s.finalWpm;
        case "accuracy":
          return s.finalAccuracy;
        case "duration":
          return s.duration;
        default:
          return s.completedAt;
      }
    };

    return [...sessions].sort((a, b) =>
      sortOrder === "asc" ? sortValue(a) - sortValue(b) : sortValue(b) - sortValue(a),
    );
  }, [sessions, sortBy, sortOrder]);

  const avgWpm =
    sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.finalWpm, 0) / sessions.length
      : 0;
  const avgAccuracy =
    sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.finalAccuracy, 0) / sessions.length
      : 0;
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / 1000 / 60 / 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const trendData = (analytics?.daily ?? []).map((d) => ({
    date: new Date(d.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    avgWpm: Math.round(d.avgWpm),
    avgAccuracy: Math.round(d.avgAccuracy * 10) / 10,
  }));

  return (
    <PageContainer maxWidth="full">
      <PageHeader
        title="Practice History"
        description="Everything here is stored locally in your browser — no account needed"
      />

      {/* Summary Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <TiltCard maxTilt={6} className="surface-card border-t-4 border-t-blue-500 p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <TrendingUp className="size-3" />
            <span>Average WPM</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold">{avgWpm.toFixed(0)}</p>
        </TiltCard>

        <TiltCard
          maxTilt={6}
          className="surface-card border-t-4 border-t-green-500 p-4"
        >
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Zap className="size-3" />
            <span>Best WPM</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-green-500">
            {(bests?.bestWpm ?? 0).toFixed(0)}
          </p>
        </TiltCard>

        <TiltCard
          maxTilt={6}
          className="surface-card border-t-4 border-t-purple-500 p-4"
        >
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <TrendingUp className="size-3" />
            <span>Average Accuracy</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold">{avgAccuracy.toFixed(1)}%</p>
        </TiltCard>

        <TiltCard
          maxTilt={6}
          className="surface-card border-t-4 border-t-orange-500 p-4"
        >
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Calendar className="size-3" />
            <span>Total Sessions</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold">{sessions.length}</p>
        </TiltCard>

        <TiltCard maxTilt={6} className="surface-card border-t-4 border-t-pink-500 p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Clock className="size-3" />
            <span>Total Time</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold">
            {formatDuration(totalDuration)}
          </p>
        </TiltCard>
      </div>

      <Tabs defaultValue="sessions">
        <TabsList className="mb-6">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          {sessions.length > 0 && (
            <Card className="mb-6 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Select
                  value={sortBy}
                  onValueChange={(value: SortKey) => setSortBy(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="wpm">WPM</SelectItem>
                    <SelectItem value="accuracy">Accuracy</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sortOrder}
                  onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          )}

          {sessions.length === 0 ? (
            <Card className="flex min-h-[400px] items-center justify-center p-12">
              <div className="text-center">
                <Calendar className="text-muted-foreground mx-auto mb-4 size-12" />
                <h3 className="mb-2 text-lg font-semibold">No Sessions Yet</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Complete your first typing session to see it here!
                </p>
                <Button onClick={() => router.push("/practice")}>
                  Start Practicing
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedSessions.map((session, index) => (
                <SessionHistoryCard
                  key={session.id}
                  session={session}
                  isPersonalBest={
                    (bests?.bestWpm ?? 0) > 0 && session.finalWpm >= bests!.bestWpm
                  }
                  delay={index * 0.05}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends">
          {trendData.length === 0 ? (
            <Card className="flex min-h-[300px] items-center justify-center p-12">
              <p className="text-muted-foreground text-sm">
                Practice on a few different days to see your trend here.
              </p>
            </Card>
          ) : (
            <Card className="p-6">
              <h3 className="mb-4 text-sm font-semibold">Daily Average WPM</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "2px solid var(--border)",
                      borderRadius: "12px",
                      boxShadow: "var(--shadow-pop-sm)",
                      fontWeight: 600,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgWpm"
                    stroke="var(--chart-speed)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
