"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAiCoach } from "@/features/ai-coach/hooks/use-ai-coach";
import {
  AiCoachNav,
  AiLoadingSkeleton,
  AiErrorFallback,
  LessonPreviewCard,
} from "@/features/ai-coach/components";
import type { GeneratedLessonContent, LessonType } from "@/features/ai-coach/types";
import { routes } from "@/lib/constants/routes";
import { toast } from "sonner";

export function AiCoachGeneratorPage() {
  const { generateLesson, isLoading, error } = useAiCoach();
  const [lessonType, setLessonType] = useState<LessonType>("typing_drill");
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced" | "expert"
  >("intermediate");
  const [language, setLanguage] = useState("javascript");
  const [skills, setSkills] = useState("accuracy, speed");
  const [lesson, setLesson] = useState<GeneratedLessonContent | null>(null);

  const handleGenerate = async () => {
    const result = await generateLesson({
      lessonType,
      difficulty,
      language,
      targetSkills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    if (result) {
      setLesson(result);
      toast.success("Lesson generated!");
    } else {
      toast.error("Failed to generate lesson");
    }
  };

  return (
    <PageContainer maxWidth="xl">
      <PageHeader
        title="AI Practice Generator"
        description="Generate personalized typing drills and coding exercises."
      />
      <AiCoachNav />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border-border/50 space-y-4 rounded-2xl border p-6">
          <div className="space-y-2">
            <Label>Lesson Type</Label>
            <Select
              value={lessonType}
              onValueChange={(v) => setLessonType(v as LessonType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="typing_drill">Typing Drill</SelectItem>
                <SelectItem value="coding_practice">Coding Practice</SelectItem>
                <SelectItem value="weak_key_focus">Weak Key Focus</SelectItem>
                <SelectItem value="syntax_practice">Syntax Practice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(v) => setDifficulty(v as typeof difficulty)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Input value={language} onChange={(e) => setLanguage(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Target Skills (comma-separated)</Label>
            <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>

          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Generating…" : "Generate Lesson"}
          </Button>

          {error && <AiErrorFallback message={error} onRetry={handleGenerate} />}
        </div>

        <div>
          {isLoading && !lesson ? (
            <AiLoadingSkeleton />
          ) : lesson ? (
            <LessonPreviewCard
              lesson={{ ...lesson, difficulty, language }}
              onStart={() => {
                if (
                  lessonType === "coding_practice" ||
                  lessonType === "syntax_practice"
                ) {
                  const customSnippet = {
                    id: `ai-${Date.now()}`,
                    title: lesson.title,
                    description: lesson.description,
                    language: language,
                    difficulty: difficulty,
                    category: "full-snippets",
                    type: "full-code",
                    code: lesson.content,
                    metadata: {
                      lineCount: lesson.content.split("\n").length,
                      charCount: lesson.content.length,
                    },
                    tags: ["ai-generated", language],
                  };
                  sessionStorage.setItem(
                    "customPracticeSnippet",
                    JSON.stringify(customSnippet),
                  );
                  window.location.href = "/practice/code";
                } else {
                  sessionStorage.setItem("customPracticeText", lesson.content);
                  sessionStorage.setItem("customPracticeTitle", lesson.title);
                  window.location.href = routes.typingPractice;
                }
              }}
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              Configure options and generate a personalized lesson.
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
