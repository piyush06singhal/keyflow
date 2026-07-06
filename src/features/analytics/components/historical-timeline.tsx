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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  Keyboard,
  Code2,
  Clock,
  Percent,
  ArrowLeft,
  ArrowRight,
  Filter,
  TrendingUp,
} from "lucide-react";

interface HistoricalTimelineProps {
  userId: string;
}

export function HistoricalTimeline({ userId }: HistoricalTimelineProps) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState<"all" | "typing" | "coding">("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  useEffect(() => {
    async function fetchSessions() {
      setIsLoading(true);
      const supabase = createSupabaseBrowserClient();

      try {
        let typingData: any[] = [];
        let codingData: any[] = [];

        // 1. Fetch typing sessions if applicable
        if (typeFilter === "all" || typeFilter === "typing") {
          const { data } = await supabase
            .from("typing_sessions")
            .select(
              "id, created_at, final_wpm, final_accuracy, consistency, duration, practice_mode",
            )
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(50);

          if (data) {
            typingData = data.map((s: any) => ({
              id: s.id,
              type: "typing",
              date: new Date(s.created_at),
              wpm: s.final_wpm,
              accuracy: s.final_accuracy,
              consistency: s.consistency,
              duration: s.duration,
              detail: s.practice_mode,
            }));
          }
        }

        // 2. Fetch coding sessions if applicable
        if (typeFilter === "all" || typeFilter === "coding") {
          let query = supabase
            .from("coding_sessions")
            .select("id, created_at, wpm, accuracy, consistency, duration, language")
            .eq("user_id", userId);

          if (languageFilter !== "all") {
            query = query.eq("language", languageFilter);
          }

          const { data } = await query
            .order("created_at", { ascending: false })
            .limit(50);

          if (data) {
            codingData = data.map((s: any) => ({
              id: s.id,
              type: "coding",
              date: new Date(s.created_at),
              wpm: s.wpm,
              accuracy: s.accuracy,
              consistency: s.consistency,
              duration: s.duration,
              detail: s.language,
            }));
          }
        }

        // 3. Merge and sort descending
        const merged = [...typingData, ...codingData].sort(
          (a, b) => b.date.getTime() - a.date.getTime(),
        );
        setSessions(merged);
      } catch (e) {
        console.error("Failed to load historical timeline:", e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessions();
  }, [userId, typeFilter, languageFilter]);

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(sessions.length / pageSize));
  const paginatedSessions = sessions.slice((page - 1) * pageSize, page * pageSize);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card className="surface-card">
      <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Historical Timeline</CardTitle>
          <CardDescription>
            Explore your completed sessions and overall progress logs
          </CardDescription>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          <Select
            value={typeFilter}
            onValueChange={(val: any) => {
              setTypeFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8.5 w-[120px] rounded-lg text-xs">
              <SelectValue placeholder="Session Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">
                All Types
              </SelectItem>
              <SelectItem value="typing" className="rounded-lg">
                Typing
              </SelectItem>
              <SelectItem value="coding" className="rounded-lg">
                Coding
              </SelectItem>
            </SelectContent>
          </Select>

          {typeFilter !== "typing" && (
            <Select
              value={languageFilter}
              onValueChange={(val) => {
                setLanguageFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8.5 w-[120px] rounded-lg text-xs">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="rounded-lg">
                  All Languages
                </SelectItem>
                <SelectItem value="javascript" className="rounded-lg">
                  JavaScript
                </SelectItem>
                <SelectItem value="typescript" className="rounded-lg">
                  TypeScript
                </SelectItem>
                <SelectItem value="python" className="rounded-lg">
                  Python
                </SelectItem>
                <SelectItem value="html" className="rounded-lg">
                  HTML
                </SelectItem>
                <SelectItem value="css" className="rounded-lg">
                  CSS
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2" />
          </div>
        ) : paginatedSessions.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center">
            <p className="text-muted-foreground text-sm font-semibold">
              No historical sessions found matching your filters
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedSessions.map((session) => (
              <div
                key={session.id}
                className="bg-card border-border/40 hover:border-primary/20 flex flex-col gap-3 rounded-xl border p-4 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      session.type === "coding"
                        ? "bg-indigo-500/10 text-indigo-500"
                        : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {session.type === "coding" ? (
                      <Code2 className="h-5 w-5" />
                    ) : (
                      <Keyboard className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-foreground flex items-center gap-2 text-sm leading-none font-semibold">
                      {session.type === "coding" ? "Coding Session" : "Typing Session"}
                      <Badge
                        variant="secondary"
                        className="rounded-md px-2 py-0.5 font-mono text-[10px] capitalize"
                      >
                        {session.detail}
                      </Badge>
                    </h5>
                    <span className="text-muted-foreground text-[11px] font-semibold">
                      {session.date.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Session performance details */}
                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div className="text-right">
                    <p className="text-foreground flex items-center gap-1 text-sm font-bold">
                      <TrendingUp className="text-primary h-3.5 w-3.5" />
                      {session.wpm}{" "}
                      <span className="text-muted-foreground text-[11px] font-semibold">
                        WPM
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground flex items-center gap-1 text-sm font-bold">
                      <Percent className="h-3.5 w-3.5 text-emerald-500" />
                      {session.accuracy}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground flex items-center gap-1 text-sm font-bold">
                      <Clock className="h-3.5 w-3.5 text-orange-500" />
                      {formatDuration(session.duration)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg px-3"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Previous
                </Button>
                <span className="text-muted-foreground text-xs font-semibold">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg px-3"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
