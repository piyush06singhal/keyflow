"use client";

import { RefreshCw } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAiCoach } from "@/features/ai-coach/hooks/use-ai-coach";
import {
  AiCoachNav,
  AiCardSkeleton,
  AiErrorFallback,
} from "@/features/ai-coach/components";
import { useEffect, useState } from "react";
import type { AiInsightData } from "@/features/ai-coach/types";

export function AiCoachInsightsPage() {
  const { getInsights, isLoading, source, error } = useAiCoach();
  const [insights, setInsights] = useState<AiInsightData[]>([]);

  const load = async () => {
    const result = await getInsights();
    if (result) setInsights(result.insights);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PageContainer maxWidth="xl">
      <PageHeader title="AI Insights" description="Patterns and opportunities from your practice data.">
        <Button variant="outline" size="sm" onClick={load} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </PageHeader>
      <AiCoachNav />

      <div className="mt-6 space-y-4">
        {source && source !== "ai" && (
          <AiErrorFallback source={source} onRetry={load} />
        )}
        {error && !insights.length && <AiErrorFallback message={error} onRetry={load} />}

        {isLoading && !insights.length ? (
          <AiCardSkeleton count={4} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {insights.map((insight) => (
              <div
                key={insight.title}
                className="border-border/50 bg-card/50 rounded-2xl border p-6 backdrop-blur-sm"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{insight.title}</h3>
                  <Badge variant="outline" className="capitalize">
                    {insight.severity}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3 text-sm">{insight.description}</p>
                {insight.actions && insight.actions.length > 0 && (
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    {insight.actions.map((action) => (
                      <li key={action}>→ {action}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
