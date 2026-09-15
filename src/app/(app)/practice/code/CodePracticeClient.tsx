"use client";

/**
 * Code Practice Client Component
 *
 * Main coding practice interface. The CodePracticeEditor owns the typing engine
 * and forwards live stats up via a callback so the CodingStatisticsPanel can
 * display real-time data.
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Settings2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCodingPracticeStore } from "@/stores/coding-practice-store";
import { SnippetProvider } from "@/lib/coding-practice/snippet-provider";
import { CodePracticeEditor } from "@/features/coding/components/code-practice-editor";
import { CodingStatisticsPanel } from "@/features/coding/components/coding-statistics-panel";
import { CodingConfigurationDrawer } from "@/features/coding/components/coding-configuration-drawer";
import type { CodeSnippet } from "@/lib/coding-practice/types";
import type { LiveStatistics } from "@/lib/typing-engine";
import { Badge } from "@/components/ui/badge";

export default function CodePracticeClient() {
  const router = useRouter();
  const {
    config,
    selectedSnippet,
    setSelectedSnippet,
    isConfigDrawerOpen,
    setConfigDrawerOpen,
    setLoading,
    isLoading,
  } = useCodingPracticeStore();

  const [snippet, setSnippet] = useState<CodeSnippet | null>(selectedSnippet);
  const [liveStats, setLiveStats] = useState<LiveStatistics | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Callback for receiving stats from the editor
  const handleStatsUpdate = useCallback((stats: LiveStatistics, time: number) => {
    setLiveStats(stats);
    setElapsedTime(time);
  }, []);

  // Load snippet on mount or when config changes
  useEffect(() => {
    async function loadSnippet() {
      // 1. If config.snippetSource is custom and we have a selectedSnippet, preserve it
      if (config.snippetSource === "custom" && selectedSnippet) {
        setSnippet(selectedSnippet);
        return;
      }

      // 2. Otherwise fetch as usual
      setLoading(true);
      setLiveStats(null);
      setElapsedTime(0);
      try {
        const loadedSnippet = await SnippetProvider.getSnippet({
          source: config.snippetSource || "static",
          filter: {
            language: config.language,
            framework: config.framework,
            difficulty: config.difficulty,
            category: config.category,
          },
          random: true,
        });

        if (loadedSnippet) {
          setSnippet(loadedSnippet);
          setSelectedSnippet(loadedSnippet);
        }
      } catch (error) {
        console.error("Failed to load snippet:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSnippet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.language,
    config.framework,
    config.difficulty,
    config.category,
    config.snippetSource,
  ]);

  const handleBack = () => {
    router.push("/practice/code/dashboard");
  };

  const handleNewSnippet = () => {
    // Reset and re-trigger the load
    setSnippet(null);
    setLoading(true);
    setLiveStats(null);
    SnippetProvider.getSnippet({
      source: config.snippetSource || "static",
      filter: {
        language: config.language,
        framework: config.framework,
        difficulty: config.difficulty,
        category: config.category,
      },
      random: true,
    })
      .then((s) => {
        if (s) {
          setSnippet(s);
          setSelectedSnippet(s);
        }
      })
      .finally(() => setLoading(false));
  };

  if (isLoading || !snippet) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          {isLoading ? (
            <>
              <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2" />
              <p className="text-muted-foreground">Loading code snippet…</p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground text-lg">
                No snippet available for {config.language}.
              </p>
              <p className="text-muted-foreground text-sm">
                {config.snippetSource === "ai-generated"
                  ? "AI generation is unavailable. Check that GROQ_API_KEYS is set in .env.local, or switch Content Source to Curated Snippets."
                  : "Switch to a language with curated snippets, or enable AI generation."}
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/practice/code/dashboard")}
                >
                  Back to Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    useCodingPracticeStore
                      .getState()
                      .updateConfig({ snippetSource: "static" });
                    setSnippet(null);
                    setLoading(true);
                  }}
                >
                  Try Curated Snippets
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/50 sticky top-0 z-40 border-b backdrop-blur-sm"
      >
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="bg-border h-6 w-px" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold">{snippet.title}</h1>
                  <Badge variant="outline" className="text-xs capitalize">
                    {snippet.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="text-xs uppercase">
                    {snippet.language}
                  </Badge>
                </div>
                {snippet.description && (
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {snippet.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleNewSnippet}>
                <RefreshCw className="mr-2 h-4 w-4" />
                New Snippet
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfigDrawerOpen(true)}
              >
                <Settings2 className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          {/* Editor - Takes up 3 columns */}
          <div className="xl:col-span-3">
            <CodePracticeEditor snippet={snippet} onStatsUpdate={handleStatsUpdate} />
          </div>

          {/* Statistics Panel */}
          <div className="xl:col-span-1">
            <CodingStatisticsPanel
              statistics={
                liveStats
                  ? {
                      wpm: liveStats.wpm,
                      accuracy: liveStats.accuracy,
                      progress: liveStats.progress,
                      elapsedTime,
                      correctChars: liveStats.correctChars,
                      totalChars: liveStats.totalChars,
                    }
                  : null
              }
            />
          </div>
        </div>
      </div>

      {/* Configuration Drawer */}
      <CodingConfigurationDrawer
        open={isConfigDrawerOpen}
        onOpenChange={setConfigDrawerOpen}
      />
    </div>
  );
}
