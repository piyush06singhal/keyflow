"use client";

/**
 * Code Practice Editor
 *
 * Main code editor interface with syntax highlighting and typing engine integration.
 * Displays code with proper indentation, line numbers, and real-time feedback.
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useCodingPracticeStore } from "@/stores/coding-practice-store";
import { useTypingEngine } from "@/hooks/use-typing-engine";
import type { CodeSnippet } from "@/lib/coding-practice/types";
import type { Character } from "@/lib/typing-engine";

interface CodePracticeEditorProps {
  snippet: CodeSnippet;
}

export function CodePracticeEditor({ snippet }: CodePracticeEditorProps) {
  const { config } = useCodingPracticeStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize typing engine with code snippet
  const { words, cursorPosition, status, start, restart } = useTypingEngine({
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
    onComplete: (result) => {
      console.log("Practice completed:", result);
      // TODO: Handle completion, show results
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

  // Get character state for rendering
  const getCharacterState = (charIndex: number): Character | null => {
    for (const word of words) {
      for (const char of word.characters) {
        if (char.index === charIndex) {
          return char;
        }
      }
    }
    return null;
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
      </div>
    </Card>
  );
}
