"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/app-shell";
import { SessionHistoryCard } from "@/components/session-results";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import {
  getSessionHistory,
  getSessionStatsSummary,
} from "@/lib/supabase/session-history";
import type { SessionHistoryItem, SessionHistoryFilter } from "@/lib/session-lifecycle";

/**
 * Session History Page
 *
 * Displays all past typing sessions with filtering, sorting, and search.
 */

export default function SessionHistoryPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [_hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState<SessionHistoryFilter>({
    sortBy: "date",
    sortOrder: "desc",
  });
  const [summary, setSummary] = useState({
    avgWpm: 0,
    avgAccuracy: 0,
    totalSessions: 0,
    totalDuration: 0,
    bestWpm: 0,
  });

  const pageSize = 20;

  // Fetch sessions
  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      setIsLoading(true);
      const result = await getSessionHistory(user.id, filter, currentPage, pageSize);
      setSessions(result.sessions);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      setIsLoading(false);
    };

    fetchSessions();
  }, [user, filter, currentPage]);

  // Fetch summary stats
  useEffect(() => {
    if (!user) return;

    const fetchSummary = async () => {
      const result = await getSessionStatsSummary(user.id);
      setSummary(result);
    };

    fetchSummary();
  }, [user]);

  const handleSessionClick = (session: SessionHistoryItem) => {
    // TODO: Navigate to detailed session view
    console.log("Session clicked:", session);
  };

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / 1000 / 60 / 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <PageContainer maxWidth="full">
      <PageHeader
        title="Session History"
        description="View all your past typing sessions and track your progress over time"
      />

      {/* Summary Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <Card className="p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <TrendingUp className="size-3" />
            <span>Average WPM</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold">
            {summary.avgWpm.toFixed(0)}
          </p>
        </Card>

        <Card className="p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <TrendingUp className="size-3" />
            <span>Best WPM</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-green-500">
            {summary.bestWpm.toFixed(0)}
          </p>
        </Card>

        <Card className="p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <TrendingUp className="size-3" />
            <span>Avg Accuracy</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold">
            {summary.avgAccuracy.toFixed(1)}%
          </p>
        </Card>

        <Card className="p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Calendar className="size-3" />
            <span>Total Sessions</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold">{summary.totalSessions}</p>
        </Card>

        <Card className="p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Clock className="size-3" />
            <span>Total Time</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold">
            {formatDuration(summary.totalDuration)}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search sessions..."
                className="pl-10"
                // TODO: Implement search
              />
            </div>
          </div>

          <Select
            value={filter.sortBy || "date"}
            onValueChange={(value: "date" | "wpm" | "accuracy" | "duration") =>
              setFilter({ ...filter, sortBy: value })
            }
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
            value={filter.sortOrder || "desc"}
            onValueChange={(value: "asc" | "desc") =>
              setFilter({ ...filter, sortOrder: value })
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="size-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Download className="size-4" />
          </Button>
        </div>
      </Card>

      {/* Sessions Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <Card className="flex min-h-[400px] items-center justify-center p-12">
          <div className="text-center">
            <Calendar className="text-muted-foreground mx-auto mb-4 size-12" />
            <h3 className="mb-2 text-lg font-semibold">No Sessions Yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Complete your first typing session to see it here!
            </p>
            <Button onClick={() => router.push("/practice")}>Start Practicing</Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session, index) => (
              <SessionHistoryCard
                key={session.id}
                session={session}
                onClick={handleSessionClick}
                delay={index * 0.05}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-muted-foreground">...</span>
                    <Button
                      variant={currentPage === totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
