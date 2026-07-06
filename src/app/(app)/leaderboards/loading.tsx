import React from "react";
import { Loader2 } from "lucide-react";

export default function LeaderboardsLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-8 px-4 py-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="bg-secondary h-10 w-64 rounded-lg" />
          <div className="bg-secondary/50 h-4 w-96 max-w-full rounded-lg" />
        </div>
        <div className="bg-secondary h-10 w-48 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-secondary/30 border-border/50 h-32 rounded-xl border"
          />
        ))}
      </div>

      <div className="border-border/50 bg-card overflow-hidden rounded-xl border">
        <div className="bg-secondary/50 border-border/50 h-16 border-b" />
        <div className="divide-border/50 divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex h-20 items-center gap-4 px-6">
              <div className="bg-secondary h-8 w-8 rounded-full" />
              <div className="bg-secondary h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="bg-secondary h-4 w-32 rounded" />
                <div className="bg-secondary/50 h-3 w-24 rounded" />
              </div>
              <div className="bg-secondary h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
