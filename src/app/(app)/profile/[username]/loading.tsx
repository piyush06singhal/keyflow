import React from "react";

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-8">
      {/* Profile Header & Banner Skeleton */}
      <div className="border-border/50 bg-card relative overflow-hidden rounded-2xl border">
        <div className="bg-secondary/30 h-48 w-full" />

        <div className="relative -mt-16 flex flex-col items-end gap-6 px-8 pt-4 pb-8 md:flex-row md:items-center">
          <div className="border-background bg-secondary h-32 w-32 shrink-0 rounded-full border-4" />

          <div className="mt-16 flex-1 space-y-3 md:mt-0">
            <div className="bg-secondary h-8 w-48 rounded" />
            <div className="bg-secondary/50 h-4 w-32 rounded" />

            <div className="mt-2 flex gap-4">
              <div className="bg-secondary/30 h-4 w-24 rounded" />
              <div className="bg-secondary/30 h-4 w-24 rounded" />
            </div>
          </div>

          <div className="mt-4 flex w-full gap-3 md:mt-0 md:w-auto">
            <div className="bg-secondary h-10 w-24 rounded-lg md:w-28" />
            <div className="bg-secondary h-10 w-28 rounded-lg md:w-32" />
          </div>
        </div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Stats */}
        <div className="space-y-8 lg:col-span-1">
          <div className="bg-secondary/10 border-border/50 h-32 rounded-xl border p-6" />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/10 border-border/50 h-32 rounded-xl border" />
            <div className="bg-secondary/10 border-border/50 h-32 rounded-xl border" />
            <div className="bg-secondary/10 border-border/50 col-span-2 h-32 rounded-xl border" />
          </div>
        </div>

        {/* Right Column: Activity & Badges */}
        <div className="space-y-8 lg:col-span-2">
          <div className="bg-secondary/10 border-border/50 h-40 rounded-xl border" />
          <div className="bg-secondary/10 border-border/50 h-48 rounded-xl border" />
          <div className="bg-secondary/10 border-border/50 h-64 rounded-xl border" />
        </div>
      </div>
    </div>
  );
}
