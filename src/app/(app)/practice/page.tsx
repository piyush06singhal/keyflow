"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer } from "@/components/app-shell";
import {
  PracticeToolbar,
  TypingCanvas,
  LiveStatistics,
  VirtualKeyboard,
  SettingsDrawer,
  ResultsModal,
  QuickStartGuide,
  PracticeFAB,
} from "@/components/typing-practice";
import { useTypingEngine } from "@/hooks/use-typing-engine";
import { useKeyboardShortcuts, TYPING_SHORTCUTS } from "@/hooks/use-keyboard-shortcuts";
import { useTypingPracticeStore } from "@/stores/typing-practice-store";
import { usePracticePreferences } from "@/hooks/use-practice-preferences";
import { useAuth } from "@/hooks/use-auth";
import { useSessionLifecycle } from "@/hooks/use-session-lifecycle";
import type { SessionResult } from "@/lib/typing-engine";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * Typing Practice Page
 *
 * Main page for typing practice sessions.
 * Orchestrates all typing practice components and handles user interactions.
 * Syncs preferences and saves sessions to Supabase in real-time.
 */

export default function PracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    config,
    uiSettings,
    viewMode,
    setViewMode,
    setSettingsOpen,
    updateUISettings,
  } = useTypingPracticeStore();

  const { user } = useAuth();
  usePracticePreferences();

  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  // Session lifecycle management
  const {
    completeSession,
    isProcessing: _isProcessing,
    syncStatus: _syncStatus,
  } = useSessionLifecycle();

  // Initialize typing engine
  const typing = useTypingEngine({
    config: {
      mode: config.mode,
      timerMode: config.timerMode,
      duration: config.duration,
      language: "english",
      includePunctuation: config.includePunctuation,
      includeNumbers: config.includeNumbers,
      includeCapitalization: config.includeCapitalization,
      wordCount: config.wordCount,
      customText: config.customText,
      allowBackspace: config.allowBackspace,
      allowSkip: false,
      blindMode: config.blindMode,
      instantDeath: false,
      strictMode: config.strictMode,
      soundEnabled: uiSettings.soundEnabled,
      hapticEnabled: false,
    },
    onComplete: async (result) => {
      setSessionResult(result);

      // Process session completion through lifecycle
      if (user) {
        try {
          const completionResult = await completeSession(result, config.mode);

          // Store results for results page
          sessionStorage.setItem("lastSessionResult", JSON.stringify(result));
          sessionStorage.setItem(
            "lastCompletionResult",
            JSON.stringify(completionResult),
          );

          // Show appropriate toast based on result
          if (completionResult.saved) {
            toast.success("Session Complete! 🎉", {
              description: `+${completionResult.xpGained} XP${completionResult.levelUp ? ` • Level ${completionResult.newLevel}!` : ""}`,
            });
          } else if (completionResult.warnings.length > 0) {
            toast.warning("Session saved offline", {
              description: "Will sync when connection is restored",
            });
          }

          // Navigate to results page
          router.push("/practice/results");
        } catch (error) {
          console.error("Error processing session:", error);
          toast.error("Session processing failed", {
            description: "Your session data may not have been saved properly",
          });
        }
      } else {
        // Not logged in - show basic results modal
        setIsResultsOpen(true);
      }
    },
    autoStart: false,
  });

  // Check for restart param
  useEffect(() => {
    if (searchParams?.get("restart") === "true") {
      typing.restart();
    }
  }, [searchParams]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        ...TYPING_SHORTCUTS.RESTART,
        action: typing.restart,
      },
      {
        ...TYPING_SHORTCUTS.PAUSE,
        action: () => {
          if (typing.status === "active") {
            typing.pause();
          } else if (typing.status === "paused") {
            typing.resume();
          }
        },
      },
      {
        ...TYPING_SHORTCUTS.SETTINGS,
        action: () => setSettingsOpen(true),
      },
      {
        ...TYPING_SHORTCUTS.FOCUS_MODE,
        action: () => {
          setViewMode(viewMode.mode === "focus" ? "default" : "focus");
        },
      },
      {
        ...TYPING_SHORTCUTS.ZEN_MODE,
        action: () => {
          setViewMode(viewMode.mode === "zen" ? "default" : "zen");
        },
      },
    ],
    enabled: typing.status !== "active", // Disable during active typing
  });

  const isZenMode = viewMode.mode === "zen";
  const isFocusMode = viewMode.mode === "focus";
  const showUI = !isZenMode;

  return (
    <>
      <PageContainer
        maxWidth={isZenMode ? "full" : "2xl"}
        className={cn({
          "p-0": isZenMode,
        })}
      >
        <div className="space-y-6">
          {/* Quick Start Guide */}
          <AnimatePresence>
            {showUI && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                <QuickStartGuide />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toolbar */}
          <AnimatePresence>
            {showUI && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PracticeToolbar
                  onRestart={typing.restart}
                  disabled={typing.status === "active"}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div
            className={cn("grid gap-6", {
              "lg:grid-cols-[1fr_350px]": showUI && !isFocusMode,
              "lg:grid-cols-1": isFocusMode || isZenMode,
            })}
          >
            {/* Left Column: Typing Area */}
            <div className="space-y-6">
              <TypingCanvas typing={typing} />

              {/* Virtual Keyboard */}
              <AnimatePresence>
                {showUI && uiSettings.showKeyboard && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VirtualKeyboard layout={uiSettings.keyboardLayout} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Statistics (not in focus/zen mode) */}
            <AnimatePresence>
              {showUI && !isFocusMode && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <LiveStatistics
                    statistics={typing.statistics}
                    elapsedTime={typing.elapsedTime}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Zen Mode Minimal Stats */}
          {isZenMode && typing.status === "active" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-background/80 fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full border px-6 py-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">WPM: </span>
                  <span className="font-mono font-bold">
                    {typing.statistics?.wpm.toFixed(0) ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Acc: </span>
                  <span className="font-mono font-bold">
                    {typing.statistics?.accuracy.toFixed(0) ?? 0}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Time: </span>
                  <span className="font-mono font-bold">
                    {Math.floor(typing.elapsedTime / 1000)}s
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </PageContainer>

      {/* Settings Drawer */}
      <SettingsDrawer />

      {/* Results Modal */}
      <ResultsModal
        result={sessionResult}
        open={isResultsOpen}
        onOpenChange={setIsResultsOpen}
        onRestart={typing.restart}
      />

      {/* Floating Action Button (for quick actions) */}
      {(isFocusMode || isZenMode) && (
        <PracticeFAB
          isActive={typing.status === "active"}
          isPaused={typing.status === "paused"}
          onRestart={typing.restart}
          onPauseToggle={() => {
            if (typing.status === "active") {
              typing.pause();
            } else if (typing.status === "paused") {
              typing.resume();
            }
          }}
          onSettings={() => setSettingsOpen(true)}
          onKeyboardToggle={() =>
            updateUISettings({ showKeyboard: !uiSettings.showKeyboard })
          }
          showKeyboard={uiSettings.showKeyboard}
        />
      )}
    </>
  );
}
