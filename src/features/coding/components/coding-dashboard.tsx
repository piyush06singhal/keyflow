"use client";

/**
 * Coding Dashboard
 *
 * Main configuration interface for developer coding practice.
 * Allows users to select language, difficulty, topics, and start practice.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Code2, Zap, Target, Clock, TrendingUp, Play, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCodingPracticeStore } from "@/stores/coding-practice-store";
import { getAllLanguages, getLanguageConfig } from "@/lib/coding-practice/languages";
import { LanguageBadge } from "@/features/coding/components/language-badge";
import { DifficultyBadge } from "@/features/coding/components/difficulty-badge";
import type {
  ProgrammingLanguage,
  CodingDifficulty,
  CodingCategory,
  Framework,
} from "@/lib/coding-practice/types";

const DIFFICULTIES: { value: CodingDifficulty; label: string; description: string }[] =
  [
    {
      value: "beginner",
      label: "Beginner",
      description: "Simple syntax and basic concepts",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      description: "Common patterns and real-world examples",
    },
    {
      value: "advanced",
      label: "Advanced",
      description: "Complex algorithms and advanced features",
    },
    {
      value: "expert",
      label: "Expert",
      description: "Production-grade code and optimizations",
    },
  ];

const CATEGORIES: { value: CodingCategory; label: string }[] = [
  { value: "basic-syntax", label: "Basic Syntax" },
  { value: "functions", label: "Functions" },
  { value: "classes", label: "Classes & OOP" },
  { value: "algorithms", label: "Algorithms" },
  { value: "data-structures", label: "Data Structures" },
  { value: "react-components", label: "React Components" },
  { value: "api-calls", label: "API Calls" },
  { value: "sql-queries", label: "SQL Queries" },
  { value: "full-snippets", label: "Full Code Examples" },
];

const DURATIONS = [
  { value: 60, label: "1 minute" },
  { value: 180, label: "3 minutes" },
  { value: 300, label: "5 minutes" },
  { value: 600, label: "10 minutes" },
  { value: 900, label: "15 minutes" },
];

const SNIPPET_SOURCES = [
  {
    value: "static",
    label: "Static Snippets",
    description: "Pre-defined, always available",
    icon: "📚",
  },
  {
    value: "ai-generated",
    label: "AI Generated",
    description: "Custom code from AI (Groq)",
    icon: "✨",
    badge: "New",
  },
  {
    value: "database",
    label: "My Snippets",
    description: "Your saved custom snippets",
    icon: "💾",
  },
  {
    value: "community",
    label: "Community",
    description: "Shared by other users",
    icon: "👥",
  },
];

export function CodingDashboard() {
  const router = useRouter();
  const { config, updateConfig, setConfigDrawerOpen } = useCodingPracticeStore();
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>(
    config.language,
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<CodingDifficulty>(
    config.difficulty,
  );
  const [selectedCategory, setSelectedCategory] = useState<CodingCategory | undefined>(
    config.category,
  );
  const [selectedDuration, setSelectedDuration] = useState(config.duration || 300);
  const [snippetSource, setSnippetSource] = useState<
    "static" | "ai-generated" | "database" | "community"
  >("static");

  const languages = getAllLanguages();
  const currentLanguageConfig = getLanguageConfig(selectedLanguage);
  const availableFrameworks = currentLanguageConfig.frameworks;
  const availableCategories = currentLanguageConfig.categories;

  const handleStartPractice = () => {
    updateConfig({
      language: selectedLanguage,
      difficulty: selectedDifficulty,
      category: selectedCategory,
      duration: selectedDuration,
    });
    router.push("/practice/code");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <div className="flex items-center justify-center gap-3">
          <Code2 className="text-primary h-10 w-10" />
          <h1 className="text-4xl font-bold">Coding Practice</h1>
        </div>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Improve your typing speed while learning programming syntax. Practice real
          code from modern frameworks and languages.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Code2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">20+</div>
              <div className="text-muted-foreground text-sm">Languages</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/10 p-2">
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">100+</div>
              <div className="text-muted-foreground text-sm">Code Snippets</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <Zap className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">Live</div>
              <div className="text-muted-foreground text-sm">Syntax Highlight</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-500/10 p-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">AI</div>
              <div className="text-muted-foreground text-sm">Coming Soon</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Configuration */}
      <Card className="p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Configure Practice</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfigDrawerOpen(true)}
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Advanced Settings
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Language Selection */}
            <div className="space-y-3">
              <Label>Programming Language</Label>
              <Select
                value={selectedLanguage}
                onValueChange={(value) =>
                  setSelectedLanguage(value as ProgrammingLanguage)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      <div className="flex items-center gap-2">
                        <LanguageBadge language={lang.id} size="sm" />
                        <span>{lang.displayName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-3">
              <Label>Difficulty Level</Label>
              <Select
                value={selectedDifficulty}
                onValueChange={(value) =>
                  setSelectedDifficulty(value as CodingDifficulty)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((diff) => (
                    <SelectItem key={diff.value} value={diff.value}>
                      <div className="flex items-center gap-2">
                        <DifficultyBadge difficulty={diff.value} />
                        <div>
                          <div>{diff.label}</div>
                          <div className="text-muted-foreground text-xs">
                            {diff.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <Label>Practice Category (Optional)</Label>
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) =>
                  setSelectedCategory(
                    value === "all" ? undefined : (value as CodingCategory),
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.filter((cat) =>
                    availableCategories.includes(cat.value),
                  ).map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration Selection */}
            <div className="space-y-3">
              <Label>Practice Duration</Label>
              <Select
                value={selectedDuration.toString()}
                onValueChange={(value) => setSelectedDuration(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((dur) => (
                    <SelectItem key={dur.value} value={dur.value.toString()}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {dur.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-4">
            <Button
              size="lg"
              className="h-14 w-full text-lg"
              onClick={handleStartPractice}
            >
              <Play className="mr-2 h-5 w-5" />
              Start Coding Practice
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <Code2 className="text-primary h-5 w-5" />
            Real Code
          </h3>
          <p className="text-muted-foreground text-sm">
            Practice with production-quality code snippets from real projects and
            frameworks.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <Zap className="text-primary h-5 w-5" />
            Syntax Highlighting
          </h3>
          <p className="text-muted-foreground text-sm">
            Code editor with full syntax highlighting, line numbers, and indentation
            guides.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <TrendingUp className="text-primary h-5 w-5" />
            Track Progress
          </h3>
          <p className="text-muted-foreground text-sm">
            Detailed statistics including bracket accuracy, symbol accuracy, and more.
          </p>
        </Card>
      </div>
    </div>
  );
}
