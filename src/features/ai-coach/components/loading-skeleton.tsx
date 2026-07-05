import { cn } from "@/lib/utils";

export function AiLoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      <div className="bg-muted h-6 w-1/3 rounded-lg" />
      <div className="bg-muted h-4 w-full rounded-lg" />
      <div className="bg-muted h-4 w-5/6 rounded-lg" />
      <div className="bg-muted h-32 w-full rounded-xl" />
    </div>
  );
}

export function AiCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border-border/50 bg-card/50 animate-pulse rounded-2xl border p-6"
        >
          <div className="bg-muted mb-3 h-5 w-2/3 rounded-lg" />
          <div className="bg-muted mb-2 h-4 w-full rounded-lg" />
          <div className="bg-muted h-4 w-4/5 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
