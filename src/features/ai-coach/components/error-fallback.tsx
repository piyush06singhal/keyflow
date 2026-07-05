"use client";

import { AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AiErrorFallbackProps {
  title?: string;
  message?: string;
  source?: "ai" | "cache" | "fallback";
  onRetry?: () => void;
  className?: string;
}

export function AiErrorFallback({
  title = "AI temporarily unavailable",
  message = "We're showing rule-based recommendations instead. Your practice features work normally.",
  source = "fallback",
  onRetry,
  className,
}: AiErrorFallbackProps) {
  return (
    <Alert className={cn("border-border/50 bg-card/50", className)}>
      {source === "fallback" ? (
        <Sparkles className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
