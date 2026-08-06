"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Structured logging hook for standard route errors
    console.error("Route Error Caught:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="animate-in fade-in flex h-full min-h-[400px] w-full flex-col items-center justify-center p-6 text-center duration-500">
      <div className="border-border bg-destructive shadow-pop-sm mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2">
        <AlertCircle className="h-8 w-8 text-white" />
      </div>

      <h2 className="mb-2 text-2xl">Something went wrong</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected error while trying to load this section.
        {process.env.NODE_ENV === "development"
          ? ` Details: ${error.message}`
          : " Please try refreshing."}
      </p>

      <button
        onClick={() => reset()}
        className="border-border bg-primary text-primary-foreground shadow-pop-sm hover:shadow-pop-md active:shadow-pop-press flex items-center gap-2 rounded-full border-2 px-6 py-2.5 font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
      >
        <RotateCcw className="h-4 w-4" /> Try Again
      </button>
    </div>
  );
}
