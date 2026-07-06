import React from "react";

export default function CommunityLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-8 px-4 py-8">
      <div className="space-y-2">
        <div className="bg-secondary h-10 w-64 rounded-lg" />
        <div className="bg-secondary/50 h-4 w-96 max-w-full rounded-lg" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border-border/50 bg-secondary/10 flex gap-6 rounded-xl border p-6"
          >
            <div className="bg-secondary h-12 w-12 shrink-0 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between">
                <div className="bg-secondary h-5 w-32 rounded" />
                <div className="bg-secondary/50 h-4 w-16 rounded" />
              </div>
              <div className="mt-4 flex items-start gap-3">
                <div className="bg-secondary h-10 w-10 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="bg-secondary h-4 w-48 rounded" />
                  <div className="bg-secondary/50 h-3 w-64 max-w-full rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
