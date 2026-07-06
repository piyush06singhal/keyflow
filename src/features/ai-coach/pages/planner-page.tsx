"use client";

import { RefreshCw } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useAiCoach } from "@/features/ai-coach/hooks/use-ai-coach";
import {
  AiCoachNav,
  AiLoadingSkeleton,
  AiErrorFallback,
  PracticeSuggestionCard,
} from "@/features/ai-coach/components";
import { routes } from "@/lib/constants/routes";
import { useEffect, useState } from "react";
import type { DailyPracticePlan } from "@/features/ai-coach/types";

export function AiCoachPlannerPage() {
  const { getDailyPlan, isLoading, source, error } = useAiCoach();
  const [plan, setPlan] = useState<DailyPracticePlan | null>(null);

  const load = async (force = false) => {
    const result = await getDailyPlan(force);
    if (result) setPlan(result.plan);
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      if (isMounted) {
        await load();
      }
    };

    void loadInitialData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer maxWidth="xl">
      <PageHeader
        title="Practice Planner"
        description="Your personalized daily typing and coding practice schedule."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => load(true)}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Regenerate
        </Button>
      </PageHeader>
      <AiCoachNav />

      <div className="mt-6 space-y-6">
        {source && source !== "ai" && (
          <AiErrorFallback source={source} onRetry={() => load(true)} />
        )}
        {error && !plan && (
          <AiErrorFallback message={error} onRetry={() => load(true)} />
        )}

        {isLoading && !plan ? (
          <AiLoadingSkeleton />
        ) : plan ? (
          <>
            {plan.motivationalMessage && (
              <p className="text-muted-foreground border-border/50 rounded-xl border p-4 text-sm italic">
                {plan.motivationalMessage}
              </p>
            )}
            <section className="space-y-3">
              <h2 className="font-semibold">Typing Exercises</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {plan.typingExercises.map((ex) => (
                  <PracticeSuggestionCard
                    key={ex.title}
                    exercise={ex}
                    type="typing"
                    onStart={() => (window.location.href = routes.typingPractice)}
                  />
                ))}
              </div>
            </section>
            <section className="space-y-3">
              <h2 className="font-semibold">Coding Exercises</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {plan.codingExercises.map((ex) => (
                  <PracticeSuggestionCard
                    key={ex.title}
                    exercise={ex}
                    type="coding"
                    onStart={() => (window.location.href = routes.codingPractice)}
                  />
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </PageContainer>
  );
}
