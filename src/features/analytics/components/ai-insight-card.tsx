"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Code2, AlertTriangle, ArrowRight } from "lucide-react";
import { AnalyticsService } from "../services/analytics.service";
import Link from "next/link";
import type { AIAnalyticsInsight } from "../types";

interface AIInsightCardProps {
  userId: string;
}

export function AIInsightCard({ userId }: AIInsightCardProps) {
  const [insights, setInsights] = useState<AIAnalyticsInsight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await AnalyticsService.getAIInsights(userId);
        setInsights(data);
      } catch (e) {
        console.error("Failed to load AI insights:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userId]);

  if (isLoading) {
    return (
      <Card className="surface-card">
        <CardHeader>
          <CardTitle>AI Coaching Observations</CardTitle>
        </CardHeader>
        <CardContent className="flex h-48 items-center justify-center">
          <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2" />
        </CardContent>
      </Card>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "habit":
        return <AlertTriangle className="h-4 w-4 text-rose-500" />;
      case "recommendation":
        return <Code2 className="h-4 w-4 text-indigo-500" />;
      default:
        return <Brain className="text-primary h-4 w-4" />;
    }
  };

  return (
    <Card className="surface-card border-primary/20 shadow-key-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-balance">
          <Sparkles className="h-5 w-5 animate-pulse text-amber-500" />
          AI Coach Insights
        </CardTitle>
        <CardDescription>
          Personalized observations and corrections based on your practice logs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="bg-accent/40 border-primary/10 space-y-2 rounded-xl border p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-foreground flex items-center gap-1.5 text-xs leading-none font-bold">
                {getIcon(insight.type)}
                {insight.title}
              </span>
              <Badge
                variant="outline"
                className="px-1.5 py-0 text-[9px] leading-none font-semibold uppercase"
              >
                {insight.impact} impact
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {insight.message}
            </p>

            {insight.suggestedAction && (
              <div className="pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/95 flex h-7 items-center gap-1 px-0 text-xs font-bold hover:bg-transparent"
                  asChild
                >
                  <Link href={insight.actionUrl || "#"}>
                    {insight.suggestedAction}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
