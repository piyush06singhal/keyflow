"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SessionResultsPage } from "@/components/session-results";
import { PageContainer } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import type { SessionResult } from "@/lib/typing-engine";
import type { SessionCompletionResult } from "@/lib/session-lifecycle";

/**
 * Practice Results Page
 *
 * Displays comprehensive results after a typing session completes.
 * Shows statistics, charts, achievements, and personal bests.
 */

export default function PracticeResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [completionResult, setCompletionResult] =
    useState<SessionCompletionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get session data from sessionStorage
    const sessionData = sessionStorage.getItem("lastSessionResult");
    const completionData = sessionStorage.getItem("lastCompletionResult");

    if (sessionData && completionData) {
      try {
        setSessionResult(JSON.parse(sessionData));
        setCompletionResult(JSON.parse(completionData));
      } catch (error) {
        console.error("Failed to parse session data:", error);
        router.push("/practice");
      }
    } else {
      // No session data, redirect to practice
      router.push("/practice");
    }

    setIsLoading(false);
  }, [router]);

  const handleRestart = () => {
    router.push("/practice?restart=true");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  const handleNewSession = () => {
    router.push("/practice");
  };

  if (isLoading) {
    return (
      <PageContainer maxWidth="2xl">
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (!sessionResult || !completionResult) {
    return (
      <PageContainer maxWidth="2xl">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">No Results Found</h2>
            <p className="text-muted-foreground mt-2">
              Complete a practice session to see your results.
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="full" className="pb-12">
      <SessionResultsPage
        sessionResult={sessionResult}
        completionResult={completionResult}
        onRestart={handleRestart}
        onDashboard={handleDashboard}
        onNewSession={handleNewSession}
      />
    </PageContainer>
  );
}
