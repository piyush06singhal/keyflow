"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sampleText =
  "The quick brown fox jumps over the lazy dog while exploring the magnificent beauty of nature";

interface Stats {
  wpm: number;
  accuracy: number;
  consistency: number;
  mistakes: number;
}

export function TypingDemo() {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats>({
    wpm: 0,
    accuracy: 100,
    consistency: 100,
    mistakes: 0,
  });
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const calculateStats = useCallback((input: string, elapsed: number) => {
    const words = input.trim().split(/\s+/).length;
    const minutes = elapsed / 60000;
    const wpm = Math.round(words / minutes) || 0;

    let correctChars = 0;
    let mistakes = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === sampleText[i]) {
        correctChars++;
      } else {
        mistakes++;
      }
    }

    const accuracy =
      input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100;
    const consistency = Math.max(0, 100 - mistakes * 2);

    return { wpm, accuracy, consistency, mistakes };
  }, []);

  useEffect(() => {
    if (!isActive || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setStats(calculateStats(userInput, elapsed));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, startTime, userInput, calculateStats]);

  const handleInput = (value: string) => {
    if (!isActive && value.length > 0) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    if (value.length <= sampleText.length) {
      setUserInput(value);
    }

    if (value.length === sampleText.length) {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setUserInput("");
    setStartTime(null);
    setIsActive(false);
    setStats({ wpm: 0, accuracy: 100, consistency: 100, mistakes: 0 });
    inputRef.current?.focus();
  };

  const getCharacterColor = (index: number) => {
    if (index >= userInput.length) return "text-muted-foreground/40";
    return userInput[index] === sampleText[index] ? "text-success" : "text-destructive";
  };

  return (
    <Card className="overflow-hidden">
      {/* Stats Bar */}
      <div className="border-border-subtle bg-muted/40 grid grid-cols-2 gap-4 border-b-2 p-4 sm:grid-cols-4">
        <StatItem label="WPM" value={stats.wpm} icon="⚡" />
        <StatItem label="Accuracy" value={`${stats.accuracy}%`} icon="🎯" />
        <StatItem label="Consistency" value={`${stats.consistency}%`} icon="📊" />
        <StatItem label="Mistakes" value={stats.mistakes} icon="❌" />
      </div>

      {/* Typing Area */}
      <div className="relative p-6">
        {/* Text Display */}
        <div
          className="border-border bg-background mb-4 min-h-[120px] cursor-text rounded-xl border-2 p-4 font-mono text-lg leading-relaxed"
          onClick={() => inputRef.current?.focus()}
        >
          {sampleText.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              className={cn(
                "relative transition-colors duration-100",
                getCharacterColor(index),
              )}
            >
              {char}
              {index === userInput.length && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="bg-primary absolute top-0 -left-0.5 h-full w-0.5"
                />
              )}
            </motion.span>
          ))}
        </div>

        {/* Hidden Input */}
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={(e) => handleInput(e.target.value)}
          className="sr-only"
          aria-label="Type here to practice"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Reset
          </button>
          {!isActive && userInput.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground text-sm"
            >
              Click here and start typing to begin...
            </motion.p>
          )}
          {userInput.length === sampleText.length && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-success text-sm font-medium"
            >
              ✓ Complete! Great job!
            </motion.p>
          )}
        </div>
      </div>
    </Card>
  );
}

function StatItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-1"
    >
      <div className="text-2xl">{icon}</div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-muted-foreground text-xs">{label}</div>
    </motion.div>
  );
}
