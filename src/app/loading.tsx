import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="bg-background text-foreground min-h-dvh px-6 py-16">
      <section className="mx-auto w-full max-w-6xl">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-6 h-14 w-full max-w-2xl" />
        <Skeleton className="mt-4 h-6 w-full max-w-xl" />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </section>
    </main>
  );
}
