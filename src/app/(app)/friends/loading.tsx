import React from "react";

export default function FriendsLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-10 px-4 py-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="bg-secondary h-10 w-72 rounded-lg" />
          <div className="bg-secondary/50 h-4 w-96 max-w-full rounded-lg" />
        </div>
        <div className="bg-secondary h-10 w-full rounded-lg md:w-72" />
      </div>

      <div className="space-y-4">
        <div className="bg-secondary h-6 w-48 rounded" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border-border/50 bg-secondary/10 rounded-xl border p-5"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary h-12 w-12 shrink-0 rounded-full" />
                  <div className="space-y-2">
                    <div className="bg-secondary h-4 w-32 rounded" />
                    <div className="bg-secondary/50 h-3 w-20 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="bg-secondary h-9 flex-1 rounded-lg" />
                <div className="bg-secondary h-9 flex-1 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
