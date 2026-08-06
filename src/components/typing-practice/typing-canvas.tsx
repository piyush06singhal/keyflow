"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextRenderer } from "./text-renderer";
import { useTypingPracticeStore } from "@/stores/typing-practice-store";
import { Mascot, useMascotState } from "@/components/mascot";
import { cn } from "@/lib/utils";
import type { UseTypingEngineReturn } from "@/hooks/use-typing-engine";

/**
 * Typing Canvas Component
 *
 * Main typing area where users practice.
 * - Click or press any key to start (first keypress is NOT lost)
 * - Shows paused overlay with resume button
 * - Blurs text when paused for fairness
 */

export interface TypingCanvasProps {
  typing: UseTypingEngineReturn;
  className?: string;
}

export function TypingCanvas({ typing, className }: TypingCanvasProps) {
  const { viewMode, config } = useTypingPracticeStore();
  const { status, words, cursorPosition, inputRef, start, pause, resume, statistics } =
    typing;

  // Keep the canvas focusable and focused so window keydown captures properly
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const mascotState = useMascotState({
    engineStatus: status,
    wpm: statistics?.wpm ?? 0,
    accuracy: statistics?.accuracy ?? 100,
  });

  const isZenMode = viewMode.mode === "zen";

  const handleClick = () => {
    inputRef.current?.focus();
    if (status === "ready" || status === "idle") {
      start();
    }
  };

  const handlePauseToggle = () => {
    if (status === "active") pause();
    else if (status === "paused") resume();
  };

  const showReadyOverlay = status === "idle" || status === "ready";
  const showPausedOverlay = status === "paused";

  return (
    <Card
      ref={inputRef}
      tabIndex={0}
      onClick={handleClick}
      className={cn(
        "focus:ring-ring focus:ring-primary/20 shadow-pop-sm",
        "glass-panel relative rounded-2xl p-8 transition-all duration-200",
        "cursor-text focus:ring-2 focus:outline-none",
        {
          "border-primary glow-primary": status === "active",
          "flex min-h-screen flex-col items-center justify-center": isZenMode,
        },
        className,
      )}
      role="application"
      aria-label="Typing practice area"
    >
      {/* Mascot companion */}
      {!isZenMode && (
        <div className="pointer-events-none absolute top-4 right-4 z-10">
          <Mascot state={mascotState} size={56} />
        </div>
      )}

      {/* Ready overlay */}
      <AnimatePresence>
        {showReadyOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-background/75 absolute inset-0 z-10 flex items-center justify-center rounded-2xl backdrop-blur-lg"
          >
            <div className="space-y-3 text-center">
              <div className="aurora-surface text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Play className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold tracking-tight">
                Click or start typing
              </p>
              <p className="text-muted-foreground text-sm">
                Press any key to begin — timer starts with your first keystroke
              </p>
              <div className="text-muted-foreground mt-2 text-xs opacity-60">
                {config.timerMode === "countdown"
                  ? `${config.duration}s countdown · ${config.mode} mode`
                  : `${config.mode} mode`}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paused overlay */}
      <AnimatePresence>
        {showPausedOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center rounded-2xl backdrop-blur-xl"
          >
            <div className="text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Pause className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold tracking-tight">Paused</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Press Ctrl+Space or click Resume to continue
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
          "blur-sm": showPausedOverlay,
        })}
      >
        <TextRenderer
          words={words}
          cursorPosition={cursorPosition}
          className="justify-center"
        />
      </div>

      {/* Bottom hint */}
      {showReadyOverlay && !isZenMode && (
        <div className="absolute right-0 bottom-4 left-0 text-center">
          <p className="text-muted-foreground text-xs font-medium opacity-60">
            Tab to restart · Ctrl+Space to pause · Ctrl+, for settings
          </p>
        </div>
      )}
    </Card>
  );
}
