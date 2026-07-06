"use client";

/**
 * Code Practice Client Component
 *
 * Main coding practice interface with syntax highlighting and typing engine.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCodingPracticeStore } from "@/stores/coding-practice-store";
import { SnippetProvider } from "@/lib/coding-practice/snippet-provider";
import { CodePracticeEditor } from "@/features/coding/components/code-practice-editor";
import { CodingStatisticsPanel } from "@/features/coding/components/coding-statistics-panel";
import { CodingConfigurationDrawer } from "@/features/coding/components/coding-configuration-drawer";
import type { CodeSnippet } from "@/lib/coding-practice/types";

export default function CodePracticeClient() {
  const router = useRouter();
  const {
    config,
    selectedSnippet,
    setSelectedSnippet,
    isConfigDrawerOpen,
    setConfigDrawerOpen,
    setLoading,
  } = useCodingPracticeStore();

  const [snippet, setSnippet] = useState<CodeSnippet | null>(selectedSnippet);

  // Load snippet on mount or when config changes
  useEffect(() => {
    async function loadSnippet() {
      setLoading(true);
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
  }, [config.language, config.framework, config.difficulty, config.category]);

  const handleBack = () => {
    router.push("/practice/code/dashboard");
  };

  if (!snippet) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2" />
          <p className="text-muted-foreground">Loading code snippet...</p>
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
        <div className="mx-auto max-w-[1800px] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="bg-border h-6 w-px" />
              <div>
                <h1 className="font-semibold">{snippet.title}</h1>
                <p className="text-muted-foreground text-sm">{snippet.description}</p>
              </div>
            </div>

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
      </motion.div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1800px] px-6 py-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          {/* Editor - Takes up 3 columns */}
          <div className="xl:col-span-3">
            <CodePracticeEditor snippet={snippet} />
          </div>

          {/* Statistics Panel - Takes up 1 column */}
          <div className="xl:col-span-1">
            <CodingStatisticsPanel />
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
