"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/app-shell";

/**
 * Loading skeleton for session results page
 */
export function SessionResultsLoadingSkeleton() {
  return (
    <PageContainer maxWidth="full">
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {/* Header Skeleton */}
        <div className="text-center">
          <Skeleton className="mx-auto mb-6 h-48 w-full max-w-2xl rounded-2xl" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>

        {/* XP Card Skeleton */}
        <Skeleton className="h-40 w-full" />

        {/* Charts Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>

        <Skeleton className="h-64 w-full" />

        {/* Detailed Stats Skeleton */}
        <Card className="p-6">
          <Skeleton className="mb-4 h-6 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </Card>

        {/* Actions Skeleton */}
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
