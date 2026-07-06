import React from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full animate-pulse flex-col gap-6 p-4 sm:p-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="bg-secondary h-8 w-48 rounded-lg" />
          <div className="bg-secondary/50 h-4 w-64 rounded-lg" />
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-secondary/30 border-border/50 flex h-64 w-full items-center justify-center rounded-xl border">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
          <div className="bg-secondary/30 border-border/50 h-48 w-full rounded-xl border" />
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <div className="bg-secondary/30 border-border/50 h-96 w-full rounded-xl border" />
          <div className="bg-secondary/30 border-border/50 h-48 w-full rounded-xl border" />
        </div>
      </div>
    </div>
  );
}
