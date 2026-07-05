"use client";

import { Brain, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AiRecommendation } from "@/features/ai-coach/types";
import { cn } from "@/lib/utils";

const priorityVariant: Record<string, "default" | "warning" | "destructive" | "secondary"> = {
  low: "secondary",
  medium: "default",
  high: "warning",
  urgent: "destructive",
};

interface AIRecommendationCardProps {
  recommendation: AiRecommendation | {
    title: string;
    description: string;
    priority?: string;
    recommendation_type?: string;
    reasoning?: string | null;
  };
  onAccept?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function AIRecommendationCard({
  recommendation,
  onAccept,
  onDismiss,
  className,
}: AIRecommendationCardProps) {
  const priority = recommendation.priority ?? "medium";

  return (
    <Card className={cn("border-border/50 bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Brain className="text-primary h-5 w-5 shrink-0" />
            <CardTitle className="text-base">{recommendation.title}</CardTitle>
          </div>
          <Badge variant={priorityVariant[priority] ?? "default"}>{priority}</Badge>
        </div>
        {"recommendation_type" in recommendation && recommendation.recommendation_type && (
          <Badge variant="outline" className="w-fit capitalize">
            {recommendation.recommendation_type.replace(/_/g, " ")}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <CardDescription className="text-sm leading-relaxed">
          {recommendation.description}
        </CardDescription>
        {recommendation.reasoning && (
          <p className="text-muted-foreground text-xs italic">{recommendation.reasoning}</p>
        )}
      </CardContent>
      {(onAccept || onDismiss) && (
        <CardFooter className="gap-2">
          {onAccept && (
            <Button size="sm" onClick={onAccept}>
              Accept
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          )}
          {onDismiss && (
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
