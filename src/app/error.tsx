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
      <div className="bg-destructive/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <AlertCircle className="text-destructive h-8 w-8" />
      </div>

      <h2 className="mb-2 text-2xl font-bold tracking-tight">Something went wrong</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected error while trying to load this section.
        {process.env.NODE_ENV === "development"
          ? ` Details: ${error.message}`
          : " Please try refreshing."}
      </p>

      <button
        onClick={() => reset()}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium shadow-sm transition-colors"
      >
        <RotateCcw className="h-4 w-4" /> Try Again
      </button>
    </div>
  );
}
