"use client";

/**
 * Code Practice Editor
 *
 * Main code editor interface with syntax highlighting and typing engine integration.
 * Displays code with proper indentation, line numbers, and real-time feedback.
 */

import { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useCodingPracticeStore } from "@/stores/coding-practice-store";
import { useTypingEngine } from "@/hooks/use-typing-engine";
import { useSessionLifecycle } from "@/hooks/use-session-lifecycle";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import type { CodeSnippet } from "@/lib/coding-practice/types";
import type { Character } from "@/lib/typing-engine";

interface CodePracticeEditorProps {
  snippet: CodeSnippet;
}

export function CodePracticeEditor({ snippet }: CodePracticeEditorProps) {
  const { config } = useCodingPracticeStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { completeSession, isProcessing } = useSessionLifecycle();

  // Initialize typing engine with code snippet
  const { words, cursorPosition, status, start } = useTypingEngine({
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
    onComplete: async (result) => {
      if (user) {
        try {
          const completionResult = await completeSession(result, "coding");

          // Store results for results page
          sessionStorage.setItem("lastSessionResult", JSON.stringify(result));
          sessionStorage.setItem(
            "lastCompletionResult",
            JSON.stringify(completionResult),
          );

          if (completionResult.saved) {
            toast.success("Coding Session Complete! 🎉", {
              description: `+${completionResult.xpGained} XP${completionResult.levelUp ? ` • Level ${completionResult.newLevel}!` : ""}`,
            });
          }

          router.push("/practice/results");
        } catch (error) {
          console.error("Error processing session:", error);
          toast.error("Session processing failed");
        }
      } else {
        toast.info("Session Complete!", {
          description: "Log in to save your results.",
        });
        router.push("/practice");
      }
    },
    autoStart: false,
  });

  // Auto-start on mount
  useEffect(() => {
    if (status === "idle") {
      start();
    }
  }, [status, start]);

  // Split code into lines for rendering
  const codeLines = snippet.code.split("\n");

  // Memoize character states by absolute index for O(1) constant-time lookups
  const characterMap = useMemo(() => {
    const map = new Map<number, Character>();
    for (const word of words) {
      for (const char of word.characters) {
        map.set(char.index, char);
      }
    }
    return map;
  }, [words]);

  // Get character state for rendering
  const getCharacterState = (charIndex: number): Character | null => {
    return characterMap.get(charIndex) || null;
  };

  // Calculate current line based on cursor position
  let charsSoFar = 0;
  let currentLine = 0;
  for (let i = 0; i < codeLines.length; i++) {
    const lineLength = codeLines[i]!.length + 1; // +1 for newline
    if (cursorPosition && charsSoFar + lineLength > cursorPosition.absoluteIndex) {
      currentLine = i;
      break;
    }
    charsSoFar += lineLength;
  }

  return (
    <Card className="overflow-hidden">
      <div
        ref={containerRef}
        className="relative"
        style={{
          fontFamily: config.fontFamily,
          fontSize: `${config.fontSize}px`,
          lineHeight: config.lineHeight,
        }}
      >
        {/* Code Display */}
        <div className="max-h-[calc(100vh-300px)] overflow-auto bg-[#1e1e1e] p-6 text-[#d4d4d4]">
          <div className="font-mono">
            {codeLines.map((line, lineIndex) => {
              const lineStartIndex = codeLines
                .slice(0, lineIndex)
                .reduce((acc, l) => acc + l.length + 1, 0);

              return (
                <div
                  key={lineIndex}
                  className={`flex items-start gap-4 py-1 ${
                    lineIndex === currentLine ? "bg-[#2a2a2a]" : ""
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
                      const charState = getCharacterState(absoluteIndex);

                      let className = "inline-block";
                      let bgColor = "transparent";

                      if (charState) {
                        if (charState.typed) {
                          if (charState.isCorrect) {
                            className += " text-green-400";
                          } else if (charState.isCorrect === false) {
                            className += " text-red-400 underline decoration-wavy";
                            bgColor = "#ff000020";
                          }
                        } else if (
                          cursorPosition &&
                          absoluteIndex === cursorPosition.absoluteIndex
                        ) {
                          className += " bg-blue-500/30 animate-pulse";
                        }
                      }

                      return (
                        <span
                          key={charIndex}
                          className={className}
                          style={{ backgroundColor: bgColor }}
                        >
                          {char}
                        </span>
                      );
                    })}
                    {/* Render newline cursor if at end of line */}
                    {cursorPosition &&
                      lineStartIndex + line.length === cursorPosition.absoluteIndex && (
                        <span className="inline-block h-5 w-2 animate-pulse bg-blue-500/50" />
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/95 absolute right-4 bottom-4 rounded-lg border px-4 py-2 shadow-lg backdrop-blur-sm"
        >
          <div className="text-sm font-medium">
            Status:{" "}
            <span
              className={`${
                status === "active"
                  ? "text-green-500"
                  : status === "paused"
                    ? "text-yellow-500"
                    : "text-muted-foreground"
              }`}
            >
              {status.toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Instructions Overlay (shown before start) */}
        {status === "idle" && (
          <div className="bg-background/80 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
            <div className="space-y-4 text-center">
              <h3 className="text-2xl font-bold">Ready to Start?</h3>
              <p className="text-muted-foreground">
                Start typing to begin. The timer will start automatically.
              </p>
            </div>
          </div>
        )}

        {/* Processing / Completion Loading Overlay */}
        <AnimatePresence>
          {(status === "completed" || isProcessing) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-background/85 fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md"
            >
              <div className="max-w-sm space-y-4 px-6 text-center">
                <div className="border-primary mx-auto h-16 w-16 animate-spin rounded-full border-4 border-t-transparent" />
                <h3 className="text-foreground text-2xl font-bold tracking-tight">
                  Time&apos;s Up! 🎉
                </h3>
                <p className="text-muted-foreground text-sm">
                  Analyzing code syntax correctness, evaluating speed, and updating your
                  profile statistics...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
