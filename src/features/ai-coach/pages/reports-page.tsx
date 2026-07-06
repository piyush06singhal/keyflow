"use client";

import { RefreshCw } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useAiCoach } from "@/features/ai-coach/hooks/use-ai-coach";
import {
  AiCoachNav,
  AiLoadingSkeleton,
  AiErrorFallback,
  WeeklySummaryCard,
  AIReportCard,
} from "@/features/ai-coach/components";
import { useEffect, useState } from "react";
import type { WeeklyProgressReport } from "@/features/ai-coach/types";
import type { AiPerformanceReport } from "@/features/ai-coach/types";

export function AiCoachReportsPage() {
  const { getWeeklyReport, getReports, isLoading, source, error } = useAiCoach();
  const [report, setReport] = useState<WeeklyProgressReport | null>(null);
  const [pastReports, setPastReports] = useState<AiPerformanceReport[]>([]);

  const load = async () => {
    const [weeklyResult, reportsResult] = await Promise.all([
      getWeeklyReport(),
      getReports(),
    ]);
    if (weeklyResult) setReport(weeklyResult.report);
    if (reportsResult) setPastReports(reportsResult as AiPerformanceReport[]);
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      if (isMounted) {
        await load();
      }
    };

    void loadInitialData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer maxWidth="xl">
      <PageHeader
        title="Progress Reports"
        description="Weekly summaries and historical AI analysis."
      >
        <Button variant="outline" size="sm" onClick={load} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </PageHeader>
      <AiCoachNav />

      <div className="mt-6 space-y-6">
        {source && source !== "ai" && (
          <AiErrorFallback source={source} onRetry={load} />
        )}
        {error && !report && <AiErrorFallback message={error} onRetry={load} />}

        {isLoading && !report ? (
          <AiLoadingSkeleton />
        ) : (
          <>
            {report && (
              <WeeklySummaryCard report={report} source={source ?? undefined} />
            )}

            {pastReports.length > 0 && (
              <section className="space-y-3">
                <h2 className="font-semibold">Past Reports</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {pastReports.slice(0, 6).map((r) => (
                    <AIReportCard key={r.id} report={r} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
