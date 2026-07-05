"use client";

import { Clock, Keyboard, Code2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PracticeExercise {
  title: string;
  description: string;
  duration?: number;
  estimatedTime?: number;
  difficulty?: string;
  focusArea?: string;
  language?: string;
}

interface PracticeSuggestionCardProps {
  exercise: PracticeExercise;
  type: "typing" | "coding";
  onStart?: () => void;
  className?: string;
}

export function PracticeSuggestionCard({
  exercise,
  type,
  onStart,
  className,
}: PracticeSuggestionCardProps) {
  const Icon = type === "typing" ? Keyboard : Code2;
  const duration = exercise.duration ?? exercise.estimatedTime ?? 0;
  const minutes = Math.round(duration / 60);

  return (
    <Card className={cn("border-border/50 bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className="text-primary h-5 w-5 shrink-0" />
            <CardTitle className="text-base">{exercise.title}</CardTitle>
          </div>
          {exercise.difficulty && (
            <Badge variant="outline" className="capitalize">
              {exercise.difficulty}
            </Badge>
          )}
        </div>
        {exercise.focusArea && (
          <CardDescription className="capitalize">{exercise.focusArea}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">{exercise.description}</p>
        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
          {minutes > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {minutes} min
            </span>
          )}
          {exercise.language && (
            <Badge variant="secondary" className="text-xs">
              {exercise.language}
            </Badge>
          )}
        </div>
        {onStart && (
          <Button size="sm" onClick={onStart} className="w-full sm:w-auto">
            Start Practice
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
