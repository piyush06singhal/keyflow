"use client";

import { BookOpen, Clock, Star } from "lucide-react";
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
import type { AiGeneratedLesson, GeneratedLessonContent } from "@/features/ai-coach/types";
import { cn } from "@/lib/utils";

interface LessonPreviewCardProps {
  lesson: AiGeneratedLesson | GeneratedLessonContent & { difficulty?: string; language?: string | null };
  onStart?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
  className?: string;
}

export function LessonPreviewCard({
  lesson,
  onStart,
  onFavorite,
  isFavorited,
  className,
}: LessonPreviewCardProps) {
  const duration =
    "estimated_duration" in lesson
      ? lesson.estimated_duration
      : lesson.estimatedDuration;
  const minutes = duration ? Math.round(duration / 60) : null;

  return (
    <Card className={cn("border-border/50 bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="text-primary h-5 w-5 shrink-0" />
            <CardTitle className="text-base">{lesson.title}</CardTitle>
          </div>
          {"difficulty" in lesson && lesson.difficulty && (
            <Badge variant="outline" className="capitalize">
              {lesson.difficulty}
            </Badge>
          )}
        </div>
        {lesson.description && (
          <CardDescription className="line-clamp-2">{lesson.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          {"language" in lesson && lesson.language && (
            <Badge variant="secondary">{lesson.language}</Badge>
          )}
          {minutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {minutes} min
            </span>
          )}
        </div>
        {"content" in lesson && (
          <pre className="bg-muted/50 mt-3 max-h-24 overflow-hidden rounded-lg p-3 text-xs">
            {lesson.content.slice(0, 200)}
            {lesson.content.length > 200 ? "…" : ""}
          </pre>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        {onStart && (
          <Button size="sm" onClick={onStart}>
            Start Lesson
          </Button>
        )}
        {onFavorite && (
          <Button size="sm" variant="ghost" onClick={onFavorite}>
            <Star
              className={cn("h-4 w-4", isFavorited && "fill-warning text-warning")}
            />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
