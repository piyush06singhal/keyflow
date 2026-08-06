"use client";

/**
 * Code Practice Editor
 *
 * Fully interactive code typing editor.
 * - Keyboard input works via window keydown listener in useTypingEngine
 * - Shows real-time cursor, correct/incorrect highlighting
 * - Timer bar at top counts down
 * - Restart button works and uses latest config
 * - TimeUpModal appears on completion
 */

import { useRef, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play, Timer } from "lucide-react";
import { useCodingPracticeStore } from "@/stores/coding-practice-store";
import { useTypingEngine } from "@/hooks/use-typing-engine";
import { useSessionLifecycle } from "@/hooks/use-session-lifecycle";
import { TimeUpModal } from "@/components/typing-practice/time-up-modal";
import { Mascot, useMascotState } from "@/components/mascot";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CodeSnippet } from "@/lib/coding-practice/types";
import type { Character, SessionResult, LiveStatistics } from "@/lib/typing-engine";

interface CodePracticeEditorProps {
  snippet: CodeSnippet;
  onStatsUpdate?: (stats: LiveStatistics, elapsedMs: number) => void;
}

export function CodePracticeEditor({
  snippet,
  onStatsUpdate,
}: CodePracticeEditorProps) {
  const { config } = useCodingPracticeStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { completeSession, isProcessing } = useSessionLifecycle();
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [timeUpOpen, setTimeUpOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleComplete = useCallback((result: SessionResult) => {
    setSessionResult(result);
    setTimeUpOpen(true);

    const completionResult = completeSession(result, "coding");
    sessionStorage.setItem("lastSessionResult", JSON.stringify(result));
    sessionStorage.setItem("lastCompletionResult", JSON.stringify(completionResult));

    if (completionResult.newPersonalBests.length > 0) {
      toast.success("New personal best! 🎉", {
        description: completionResult.newPersonalBests.map((pb) => pb.type).join(", "),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize typing engine with code snippet text
  const { words, cursorPosition, status, start, restart, elapsedTime, statistics } =
    useTypingEngine({
      config: {
        mode: "coding",
        customText: snippet.code,
        timerMode: config.timerMode,
        duration: config.duration,
        allowBackspace: config.allowBackspace,
        strictMode: config.strictMode,
        includePunctuation: true,
        includeNumbers: true,
        includeCapitalization: true,
      },
      onComplete: handleComplete,
      onStatisticsUpdate: (stats) => onStatsUpdate?.(stats, elapsedTime),
      autoStart: false,
    });

  // Note: session starts via first keypress (handled in useTypingEngine keydown listener)
  // or by clicking the Start Coding button in the overlay.

  // Restart handler
  const handleRestart = useCallback(() => {
    setTimeUpOpen(false);
    setSessionResult(null);
    setIsNavigating(false);
    restart({
      mode: "coding",
      customText: snippet.code,
      timerMode: config.timerMode,
      duration: config.duration,
      allowBackspace: config.allowBackspace,
      strictMode: config.strictMode,
    });
  }, [restart, snippet.code, config]);

  const handleViewResults = useCallback(() => {
    setIsNavigating(true);
    setTimeUpOpen(false);
    router.push("/practice/results");
  }, [router]);

  // Split code into lines for rendering
  const codeLines = snippet.code.split("\n");

  // Memoize character states by absolute index for O(1) lookups
  const characterMap = useMemo(() => {
    const map = new Map<number, Character>();
    for (const word of words) {
      for (const char of word.characters) {
        map.set(char.index, char);
      }
    }
    return map;
  }, [words]);

  // Calculate which line the cursor is on
  let charsSoFar = 0;
  let currentLine = 0;
  for (let i = 0; i < codeLines.length; i++) {
    const lineLength = (codeLines[i]?.length ?? 0) + 1; // +1 for newline
    if (cursorPosition && charsSoFar + lineLength > cursorPosition.absoluteIndex) {
      currentLine = i;
      break;
    }
    charsSoFar += lineLength;
  }

  // Timer calculations
  const isCountdown = config.timerMode === "countdown";
  const totalMs = (config.duration ?? 300) * 1000;
  const timerMs = elapsedTime;
  const progressPct = isCountdown
    ? Math.max(0, Math.min(100, (timerMs / totalMs) * 100))
    : 0;
  const displaySec = Math.ceil(timerMs / 1000);
  const isLowTime = isCountdown && timerMs < 10_000;

  const isStarted =
    status === "active" || status === "paused" || status === "completed";

  const mascotState = useMascotState({
    engineStatus: status,
    wpm: statistics?.wpm ?? 0,
    accuracy: statistics?.accuracy ?? 100,
  });

  return (
    <>
      <Card className="glass-panel overflow-hidden">
        {/* Timer bar at top */}
        {isCountdown && isStarted && (
          <div className="bg-secondary/50 relative h-1.5 w-full">
            <motion.div
              className={cn("h-full", isLowTime ? "bg-red-500" : "bg-primary")}
              style={{ width: `${progressPct}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}

        <div
          ref={containerRef}
          className="relative"
          style={{
            fontFamily: config.fontFamily,
            fontSize: `${config.fontSize}px`,
            lineHeight: config.lineHeight,
          }}
        >
          {/* Header bar with timer and restart */}
          <div className="flex items-center justify-between border-b border-white/5 bg-[#1e1e1e] px-4 py-2">
            <div className="flex items-center gap-2">
              {/* Status dot */}
              <div
                className={cn("h-2 w-2 rounded-full", {
                  "animate-pulse bg-green-500": status === "active",
                  "bg-yellow-500": status === "paused",
                  "bg-gray-500": status === "ready" || status === "idle",
                  "bg-blue-500": status === "completed",
                })}
              />
              <span className="font-mono text-xs text-[#858585]">
                {status === "active"
                  ? "TYPING"
                  : status === "paused"
                    ? "PAUSED"
                    : status === "completed"
                      ? "COMPLETE"
                      : "READY"}
              </span>
              <Mascot state={mascotState} size={28} className="ml-1" />
            </div>

            {/* Timer display */}
            {isStarted && (
              <div
                className={cn(
                  "flex items-center gap-1.5 font-mono text-sm font-bold",
                  isLowTime ? "text-red-400" : "text-[#858585]",
                )}
              >
                <Timer className="h-3.5 w-3.5" />
                {isCountdown ? `${displaySec}s` : `${Math.floor(elapsedTime / 1000)}s`}
              </div>
            )}

            {/* Restart button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestart}
              className="h-7 gap-1.5 text-xs text-[#858585] hover:text-white"
            >
              <RotateCcw className="h-3 w-3" />
              Restart
            </Button>
          </div>

          {/* Code Display */}
          <div className="max-h-[calc(100vh-340px)] min-h-[300px] overflow-auto bg-[#1e1e1e] p-6 text-[#d4d4d4]">
            <div className="font-mono">
              {codeLines.map((line, lineIndex) => {
                const lineStartIndex = codeLines
                  .slice(0, lineIndex)
                  .reduce((acc, l) => acc + l.length + 1, 0);

                return (
                  <div
                    key={lineIndex}
                    className={`flex items-start gap-4 py-0.5 ${
                      lineIndex === currentLine && isStarted
                        ? "rounded bg-[#2a2a2a]"
                        : ""
                    }`}
                  >
                    {/* Line Numbers */}
                    {config.showLineNumbers && (
                      <div
                        className="text-right text-[#858585] select-none"
                        style={{ minWidth: "3ch" }}
                      >
                        {lineIndex + 1}
                      </div>
                    )}

                    {/* Line Content */}
                    <div className="flex-1 whitespace-pre">
                      {line.split("").map((char, charIndex) => {
                        const absoluteIndex = lineStartIndex + charIndex;
                        const charState = characterMap.get(absoluteIndex);

                        let textColor = "text-[#858585]"; // untyped — dimmed
                        let bgStyle = "";

                        const isCursor =
                          cursorPosition !== null &&
                          absoluteIndex === cursorPosition.absoluteIndex &&
                          isStarted;

                        if (charState) {
                          if (charState.typed) {
                            if (charState.isCorrect) {
                              textColor = "text-[#d4d4d4]"; // correct — normal
                            } else {
                              textColor = "text-red-400 underline decoration-wavy";
                              bgStyle = "rgba(255,0,0,0.15)";
                            }
                          }
                        }

                        return (
                          <span
                            key={charIndex}
                            className={cn("relative inline-block", textColor, {
                              "rounded-[2px] bg-blue-500/40": isCursor,
                            })}
                            style={bgStyle ? { backgroundColor: bgStyle } : undefined}
                          >
                            {char === " " ? "\u00A0" : char}
                          </span>
                        );
                      })}
                      {/* Cursor at end of line */}
                      {cursorPosition !== null &&
                        lineStartIndex + line.length === cursorPosition.absoluteIndex &&
                        isStarted && (
                          <span className="inline-block h-5 w-2 animate-pulse rounded-sm bg-blue-500/50 align-bottom" />
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Click-to-start overlay */}
          <AnimatePresence>
            {!isStarted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e]/80 backdrop-blur-sm"
              >
                <div className="space-y-3 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20">
                    <Play className="h-7 w-7 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Ready to type?</h3>
                  <p className="text-sm text-[#858585]">
                    Click here or press any key to start
                  </p>
                  <Button
                    onClick={() => start()}
                    className="bg-blue-600 text-white hover:bg-blue-500"
                  >
                    Start Coding
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Processing overlay */}
      <AnimatePresence>
        {isNavigating && isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-3">
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
