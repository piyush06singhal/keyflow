"use client";

import Link from "next/link";
import { Brain, ChevronRight, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";
import { useAiCoachContext } from "@/features/ai-coach/context/ai-provider";
import { AiLoadingSkeleton } from "./loading-skeleton";
import { AiErrorFallback } from "./error-fallback";
import { cn } from "@/lib/utils";

const severityVariant: Record<string, "default" | "success" | "warning" | "destructive"> = {
  info: "default",
  success: "success",
  warning: "warning",
  critical: "destructive",
};

export function AiCoachDashboardSection({ className }: { className?: string }) {
  const { insights, dailyPlan, source, isLoading, error, refresh } = useAiCoachContext();

  if (isLoading) {
    return (
      <Card className={cn("border-border/50 bg-card/50 backdrop-blur-sm", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="text-primary h-5 w-5" />
            AI Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AiLoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border/50 bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="text-primary h-5 w-5" />
              AI Coach
            </CardTitle>
            <CardDescription className="mt-1">
              Personalized insights embedded in your practice flow
            </CardDescription>
          </div>
          {source !== "ai" && source !== "unknown" && (
            <Badge variant="secondary" className="capitalize">
              {source === "fallback" ? "Offline mode" : source}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && source === "fallback" && (
          <AiErrorFallback onRetry={refresh} source="fallback" />
        )}

        {dailyPlan?.motivationalMessage && (
          <div className="bg-primary/5 flex items-start gap-2 rounded-xl p-3">
            <Sparkles className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-sm">{dailyPlan.motivationalMessage}</p>
          </div>
        )}

        {insights.length > 0 ? (
          <ul className="space-y-2">
            {insights.slice(0, 3).map((insight) => (
              <li
                key={insight.title}
                className="border-border/50 flex items-start gap-2 rounded-lg border p-3"
              >
                <Badge variant={severityVariant[insight.severity] ?? "default"} className="mt-0.5 shrink-0">
                  {insight.category}
                </Badge>
                <div>
                  <p className="text-sm font-medium">{insight.title}</p>
                  <p className="text-muted-foreground text-xs">{insight.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">
            Complete a few practice sessions to unlock personalized insights.
          </p>
        )}

        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={routes.aiCoach}>
            Open AI Coach
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export { AiCoachDashboardSection as AiCoachSection };
