"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, this is where you would log to Sentry or LogRocket
    console.error("Critical Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-4">
          <div className="border-border/50 bg-card w-full max-w-md space-y-6 rounded-2xl border p-8 text-center shadow-lg">
            <div className="bg-destructive/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-8 w-8" />
            </div>

            <div>
              <h1 className="mb-2 text-2xl font-bold tracking-tight">
                Application Error
              </h1>
              <p className="text-muted-foreground text-sm">
                A critical error occurred that could not be automatically recovered. Our
                team has been notified.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && (
              <div className="bg-secondary/50 text-muted-foreground border-border/50 max-h-48 overflow-auto rounded-lg border p-4 text-left font-mono text-xs">
                {error.message}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => reset()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-colors"
              >
                <RefreshCw className="h-4 w-4" /> Try Again
              </button>

              <Link
                href="/"
                className="border-border bg-secondary hover:bg-secondary/80 text-foreground flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-medium transition-colors"
              >
                <Home className="h-4 w-4" /> Return to Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
