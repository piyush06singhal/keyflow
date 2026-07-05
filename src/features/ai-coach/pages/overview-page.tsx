"use client";

import { RefreshCw, Target } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAiCoachContext } from "@/features/ai-coach/context/ai-provider";
import {
  AiCoachNav,
  AiLoadingSkeleton,
  AiErrorFallback,
  PracticeSuggestionCard,
  AIRecommendationCard,
} from "@/features/ai-coach/components";
import { routes } from "@/lib/constants/routes";
import Link from "next/link";

export function AiCoachOverviewPage() {
  const { dailyPlan, insights, source, isLoading, refresh, refreshPlan } = useAiCoachContext();

  return (
    <PageContainer maxWidth="xl">
      <PageHeader
        title="AI Coach"
        description="Your embedded intelligent assistant — personalized guidance without a chatbot."
      >
        <Button variant="outline" size="sm" onClick={() => refresh()} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </PageHeader>

      <AiCoachNav />

      {isLoading ? (
        <AiLoadingSkeleton className="mt-6" />
      ) : (
        <div className="mt-6 space-y-8">
          {source !== "ai" && (
            <AiErrorFallback source={source === "unknown" ? "fallback" : source} onRetry={refresh} />
          )}

          {dailyPlan && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Today&apos;s Plan</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{dailyPlan.date}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => refreshPlan(true)}>
                    Regenerate
                  </Button>
                </div>
              </div>
              {dailyPlan.motivationalMessage && (
                <p className="text-muted-foreground text-sm italic">
                  {dailyPlan.motivationalMessage}
                </p>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                {dailyPlan.typingExercises.map((ex) => (
                  <PracticeSuggestionCard
                    key={ex.title}
                    exercise={ex}
                    type="typing"
                    onStart={() => (window.location.href = routes.typingPractice)}
                  />
                ))}
                {dailyPlan.codingExercises.map((ex) => (
                  <PracticeSuggestionCard
                    key={ex.title}
                    exercise={ex}
                    type="coding"
                    onStart={() => (window.location.href = routes.codingPractice)}
                  />
                ))}
              </div>
            </section>
          )}

          {insights.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Top Insights</h2>
                <Button asChild variant="link" size="sm">
                  <Link href={routes.aiCoachInsights}>View all</Link>
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {insights.slice(0, 2).map((insight) => (
                  <AIRecommendationCard
                    key={insight.title}
                    recommendation={{
                      title: insight.title,
                      description: insight.description,
                      priority: insight.severity === "critical" ? "urgent" : "medium",
                      reasoning: insight.actions?.join(" • "),
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {dailyPlan?.goals && dailyPlan.goals.length > 0 && (
            <section className="space-y-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Target className="text-primary h-5 w-5" />
                Daily Goals
              </h2>
              <ul className="space-y-2">
                {dailyPlan.goals.map((goal) => (
                  <li
                    key={goal.title}
                    className="border-border/50 flex items-center justify-between rounded-xl border p-3 text-sm"
                  >
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-muted-foreground">{goal.target}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </PageContainer>
  );
}
