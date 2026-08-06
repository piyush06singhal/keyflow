"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer } from "@/components/app-shell";
import {
  PracticeToolbar,
  TypingCanvas,
  LiveStatistics,
  VirtualKeyboard,
  SettingsDrawer,
  QuickStartGuide,
  PracticeFAB,
} from "@/components/typing-practice";
import { TimeUpModal } from "@/components/typing-practice/time-up-modal";
import { useTypingEngine } from "@/hooks/use-typing-engine";
import { useKeyboardShortcuts, TYPING_SHORTCUTS } from "@/hooks/use-keyboard-shortcuts";
import { useTypingPracticeStore } from "@/stores/typing-practice-store";
import { useSessionLifecycle } from "@/hooks/use-session-lifecycle";
import type { SessionResult } from "@/lib/typing-engine";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getDisplayName,
  recordChallengeRun,
} from "@/lib/local-storage/daily-challenge";

/**
 * Typing Practice Page
 *
 * Orchestrates all typing practice components.
 * - First keypress automatically starts the session
 * - Timer counts down visually; when it hits 0 a beautiful popup appears
 * - Restart uses the latest config (duration, mode, toggles)
 * - Support dynamic AI text generation using Groq
 */

const CATEGORY_TOPICS: Record<string, string> = {
  general: "general everyday topics",
  science: "science and nature",
  technology: "technology and software engineering",
  business: "business and finance",
  literature: "literature and the arts",
};

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
    updateConfig,
  } = useTypingPracticeStore();

  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [timeUpOpen, setTimeUpOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);

  // Session lifecycle management
  const { completeSession, isProcessing } = useSessionLifecycle();

  // Stable onComplete callback
  const handleComplete = useCallback(
    (result: SessionResult) => {
      setSessionResult(result);
      setTimeUpOpen(true);

      const completionResult = completeSession(result, config.mode);
      sessionStorage.setItem("lastSessionResult", JSON.stringify(result));
      sessionStorage.setItem("lastCompletionResult", JSON.stringify(completionResult));

      if (completionResult.newPersonalBests.length > 0) {
        toast.success("New personal best! 🎉", {
          description: completionResult.newPersonalBests
            .map((pb) => pb.type)
            .join(", "),
        });
      }

      if (sessionStorage.getItem("dailyChallengeActive") === "true") {
        sessionStorage.removeItem("dailyChallengeActive");
        recordChallengeRun({
          date: new Date().toDateString(),
          displayName: getDisplayName() || "You",
          wpm: Math.round(result.finalWpm),
          accuracy: Math.round(result.finalAccuracy),
        });
        toast.success("Daily challenge run recorded!");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.mode],
  );

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
    onComplete: handleComplete,
    autoStart: false,
  });

  // Fetch dynamic text from Groq API route, honoring the user's chosen
  // difficulty/category so generated text actually matches their selection
  const getPracticeText = async (mode: string, duration: number) => {
    try {
      const res = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          duration,
          wordCount: config.wordCount,
          difficulty: config.difficulty,
          topic: CATEGORY_TOPICS[config.category],
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.text) {
          return json.text;
        }
      }
    } catch (err) {
      console.error("Failed to generate AI text:", err);
    }
    return null;
  };

  // Handle restart — pass latest config so duration/mode changes take effect
  const handleRestart = useCallback(async () => {
    setTimeUpOpen(false);
    setSessionResult(null);
    setIsNavigating(false);

    let finalMode = config.mode;
    let finalText = config.customText;

    if (
      config.useAiText &&
      (config.mode === "quote" || config.mode === "paragraph" || config.mode === "word")
    ) {
      setIsGeneratingText(true);
      const text = await getPracticeText(config.mode, config.duration);
      setIsGeneratingText(false);
      if (text) {
        finalMode = "custom";
        finalText = text;
      }
    }

    typing.restart({
      mode: finalMode,
      timerMode: config.timerMode,
      duration: config.duration,
      language: "english",
      includePunctuation: config.includePunctuation,
      includeNumbers: config.includeNumbers,
      includeCapitalization: config.includeCapitalization,
      wordCount: config.wordCount,
      customText: finalText,
      allowBackspace: config.allowBackspace,
      blindMode: config.blindMode,
      strictMode: config.strictMode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    typing,
    config.mode,
    config.duration,
    config.includePunctuation,
    config.includeNumbers,
    config.includeCapitalization,
    config.wordCount,
    config.customText,
    config.allowBackspace,
    config.blindMode,
    config.strictMode,
    config.useAiText,
    config.difficulty,
    config.category,
  ]);

  // Load a hand-off practice text (e.g. from the Daily Challenge) staged in sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const customText = sessionStorage.getItem("customPracticeText");
    const customTitle = sessionStorage.getItem("customPracticeTitle");
    const customDuration = sessionStorage.getItem("customPracticeDuration");
    if (customText) {
      sessionStorage.removeItem("customPracticeText");
      sessionStorage.removeItem("customPracticeTitle");
      sessionStorage.removeItem("customPracticeDuration");
      toast.success(`Loaded: ${customTitle || "Practice"}`);
      updateConfig({
        mode: "custom",
        customText,
        ...(customDuration
          ? { timerMode: "countdown", duration: Number(customDuration) }
          : {}),
      });
    }
  }, [updateConfig]);

  // Auto-restart when settings change, but only if the session is not running
  useEffect(() => {
    if (typing.status === "ready" || typing.status === "idle") {
      const t = setTimeout(() => handleRestart(), 0);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.mode,
    config.duration,
    config.includePunctuation,
    config.includeNumbers,
    config.includeCapitalization,
    config.wordCount,
    config.useAiText,
    config.difficulty,
    config.category,
  ]);

  // Navigate to full results page
  const handleViewResults = useCallback(() => {
    setIsNavigating(true);
    setTimeUpOpen(false);
    router.push("/practice/results");
  }, [router]);

  // Check for restart query param (coming back from results page)
  useEffect(() => {
    if (searchParams?.get("restart") === "true") {
      const t = setTimeout(() => handleRestart(), 0);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      { ...TYPING_SHORTCUTS.RESTART, action: handleRestart },
      {
        ...TYPING_SHORTCUTS.PAUSE,
        action: () => {
          if (typing.status === "active") typing.pause();
          else if (typing.status === "paused") typing.resume();
        },
      },
      { ...TYPING_SHORTCUTS.SETTINGS, action: () => setSettingsOpen(true) },
      {
        ...TYPING_SHORTCUTS.FOCUS_MODE,
        action: () => setViewMode(viewMode.mode === "focus" ? "default" : "focus"),
      },
      {
        ...TYPING_SHORTCUTS.ZEN_MODE,
        action: () => setViewMode(viewMode.mode === "zen" ? "default" : "zen"),
      },
    ],
    enabled: typing.status !== "active",
  });

  const isZenMode = viewMode.mode === "zen";
  const isFocusMode = viewMode.mode === "focus";
  const showUI = !isZenMode;

  return (
    <>
      <PageContainer
        maxWidth={isZenMode ? "full" : "2xl"}
        className={cn({ "p-0": isZenMode })}
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
                  onRestart={handleRestart}
                  disabled={typing.status === "active" || isGeneratingText}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div
            className={cn("grid gap-6", {
              "xl:grid-cols-[1fr_320px]": showUI && !isFocusMode,
              "xl:grid-cols-1": isFocusMode || isZenMode,
            })}
          >
            {/* Left: Typing Area */}
            <div className="min-w-0 space-y-6">
              <div className="relative">
                <TypingCanvas typing={typing} />

                {/* AI Text generation overlay */}
                <AnimatePresence>
                  {isGeneratingText && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-background/80 absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl backdrop-blur-md"
                    >
                      <div className="border-primary mb-3 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
                      <p className="text-sm font-medium text-white">
                        Generating dynamic practice text using Groq AI…
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Virtual Keyboard */}
              <AnimatePresence>
                {showUI && uiSettings.showKeyboard && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VirtualKeyboard />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Live Statistics */}
            <AnimatePresence>
              {showUI && !isFocusMode && typing.status !== "completed" && (
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
                    timerMode={config.timerMode}
                    duration={config.duration}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Zen Mode stats */}
          {isZenMode && typing.status === "active" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-background/80 fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full border px-6 py-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-6 text-sm font-medium">
                <div>WPM: {typing.statistics?.wpm.toFixed(0) || 0}</div>
                <div>ACC: {typing.statistics?.accuracy.toFixed(0) || 0}%</div>
                <div>
                  {config.timerMode === "countdown"
                    ? `${Math.ceil(typing.elapsedTime / 1000)}s left`
                    : `${Math.floor(typing.elapsedTime / 1000)}s`}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </PageContainer>

      {/* Settings Drawer */}
      <SettingsDrawer />

      {/* FAB */}
      {(isFocusMode || isZenMode) && (
        <PracticeFAB
          isActive={typing.status === "active"}
          isPaused={typing.status === "paused"}
          onRestart={handleRestart}
          onPauseToggle={() => {
            if (typing.status === "active") typing.pause();
            else if (typing.status === "paused") typing.resume();
          }}
          onSettings={() => setSettingsOpen(true)}
          onKeyboardToggle={() =>
            updateUISettings({ showKeyboard: !uiSettings.showKeyboard })
          }
          showKeyboard={uiSettings.showKeyboard}
        />
      )}

      {/* Processing saving overlay */}
      <AnimatePresence>
        {isNavigating && isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
              <p className="text-muted-foreground text-sm">Saving results…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time-Up Modal */}
      <TimeUpModal
        open={timeUpOpen}
        result={sessionResult}
        onRestart={handleRestart}
        onViewResults={handleViewResults}
      />
    </>
  );
}
