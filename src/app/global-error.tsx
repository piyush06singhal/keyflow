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
          <div className="border-border bg-card shadow-pop-lg w-full max-w-md space-y-6 rounded-2xl border-2 p-8 text-center">
            <div className="border-border bg-destructive shadow-pop-sm mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="mb-2 text-2xl">Application Error</h1>
              <p className="text-muted-foreground text-sm">
                A critical error occurred that could not be automatically recovered. Our
                team has been notified.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && (
              <div className="bg-secondary/60 text-muted-foreground border-border max-h-48 overflow-auto rounded-xl border-2 p-4 text-left font-mono text-xs">
                {error.message}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => reset()}
                className="border-border bg-primary text-primary-foreground shadow-pop-sm hover:shadow-pop-md active:shadow-pop-press flex w-full items-center justify-center gap-2 rounded-full border-2 px-4 py-2.5 font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
              >
                <RefreshCw className="h-4 w-4" /> Try Again
              </button>

              <Link
                href="/"
                className="border-border bg-secondary hover:bg-secondary/80 text-foreground shadow-pop-sm hover:shadow-pop-md flex w-full items-center justify-center gap-2 rounded-full border-2 px-4 py-2.5 font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
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
