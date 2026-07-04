"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logError } from "@/lib/errors/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, { boundary: "global", digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-6">
          <section className="border-border bg-card shadow-key-md w-full max-w-md rounded-2xl border p-8">
            <div className="bg-destructive/10 text-destructive mb-5 flex size-11 items-center justify-center rounded-lg">
              <AlertTriangle className="size-5" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              The application hit an unexpected error. You can retry the current view,
              and the error will be captured by the logging layer.
            </p>
            <Button onClick={reset} className="mt-6">
              <RotateCcw className="size-4" aria-hidden="true" />
              Retry
            </Button>
          </section>
        </main>
      </body>
    </html>
  );
}
