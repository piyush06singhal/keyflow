"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextRenderer } from "./text-renderer";
import { useTypingPracticeStore } from "@/stores/typing-practice-store";
import { cn } from "@/lib/utils";
import type { UseTypingEngineReturn } from "@/hooks/use-typing-engine";

/**
 * Typing Canvas Component
 *
 * Main typing area where users practice.
 * Displays the text, handles focus, and shows status messages.
 */

export interface TypingCanvasProps {
  typing: UseTypingEngineReturn;
  className?: string;
}

export function TypingCanvas({ typing, className }: TypingCanvasProps) {
  const { viewMode, uiSettings } = useTypingPracticeStore();
  const { status, words, cursorPosition, inputRef, start, pause, resume } = typing;

  // Auto-focus when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const isZenMode = viewMode.mode === "zen";
  const isFocusMode = viewMode.mode === "focus";

  const handleClick = () => {
    inputRef.current?.focus();
    if (status === "ready" || status === "idle") {
      start();
    }
  };

  const handlePauseToggle = () => {
    if (status === "active") {
      pause();
    } else if (status === "paused") {
      resume();
    }
  };

  return (
    <Card
      ref={inputRef}
      tabIndex={0}
      onClick={handleClick}
      className={cn(
        "focus:ring-ring focus:border-primary/50 border-border/40 shadow-key-md focus:ring-primary/20 relative min-h-[300px] rounded-2xl p-8 transition-all duration-200 focus:ring-2 focus:outline-none",
        "cursor-text",
        {
          "border-primary/60 shadow-key-lg": status === "active",
          "min-h-screen": isZenMode,
        },
        className,
      )}
      role="application"
      aria-label="Typing practice area"
    >
      {/* Status Overlay */}
      <AnimatePresence>
        {(status === "idle" || status === "ready") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-background/70 absolute inset-0 z-10 flex items-center justify-center rounded-2xl backdrop-blur-xl"
          >
            <div className="text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Play className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold tracking-tight">
                Click or start typing to begin
              </p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Press any key to start the timer
              </p>
            </div>
          </motion.div>
        )}

        {status === "paused" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-background/70 absolute inset-0 z-10 flex items-center justify-center rounded-2xl backdrop-blur-xl"
          >
            <div className="text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Pause className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold tracking-tight">Paused</p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Press Ctrl+Space to resume
              </p>
              <Button className="mt-4 rounded-xl" onClick={handlePauseToggle}>
                Resume Practice
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Content */}
      <div
        className={cn("mx-auto max-w-4xl", {
          "blur-sm": status === "paused",
        })}
      >
        <TextRenderer
          words={words}
          cursorPosition={cursorPosition}
          className="justify-center"
        />
      </div>

      {/* Instructions */}
      {(status === "idle" || status === "ready") && !isZenMode && (
        <div className="absolute right-0 bottom-4 left-0 text-center">
          <p className="text-muted-foreground text-xs font-medium opacity-60">
            Tab to restart • Ctrl+Space to pause • Ctrl+, for settings
          </p>
        </div>
      )}
    </Card>
  );
}
