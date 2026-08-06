"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Target, TrendingUp, RotateCcw, BarChart2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot";
import type { SessionResult } from "@/lib/typing-engine";

/**
 * TimeUpModal
 *
 * Beautiful animated modal that appears exactly when the timer hits 0 or the
 * user finishes the text. Shows a summary of WPM / accuracy / consistency with
 * large animated numbers, then auto-navigates to the full results page.
 */

export interface TimeUpModalProps {
  open: boolean;
  result: SessionResult | null;
  onViewResults: () => void;
  onRestart: () => void;
}

function getGrade(wpm: number): { label: string; emoji: string } {
  if (wpm >= 100) return { label: "Legendary", emoji: "🏆" };
  if (wpm >= 80) return { label: "Expert", emoji: "⚡" };
  if (wpm >= 60) return { label: "Advanced", emoji: "🚀" };
  if (wpm >= 40) return { label: "Proficient", emoji: "✅" };
  if (wpm >= 20) return { label: "Beginner", emoji: "📈" };
  return { label: "Novice", emoji: "💪" };
}

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return <>{value}</>;
}

export function TimeUpModal({
  open,
  result,
  onViewResults,
  onRestart,
}: TimeUpModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setShow(true), 100);
      return () => clearTimeout(t);
    }
    // When closing, defer the state update via setTimeout to avoid sync setState in effect
    const t = setTimeout(() => setShow(false), 0);
    return () => clearTimeout(t);
  }, [open]);

  if (!result) return null;

  const grade = getGrade(result.finalWpm);
  const wpm = Math.round(result.finalWpm);
  const accuracy = Math.round(result.finalAccuracy);
  const consistency = Math.round(result.consistency);
  const durationSec = Math.round(result.duration / 1000);
  const mascotState =
    result.finalAccuracy < 70
      ? "sad"
      : result.finalWpm >= 40 && result.finalAccuracy >= 85
        ? "celebrating"
        : "idle";

  const stats = [
    {
      icon: Target,
      label: "Accuracy",
      value: accuracy,
      suffix: "%",
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      icon: TrendingUp,
      label: "Consistency",
      value: consistency,
      suffix: "%",
      color: "text-pink",
      bg: "bg-pink/10",
    },
    {
      icon: BarChart2,
      label: "Mistakes",
      value: result.mistakes.length,
      suffix: "",
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(16px)", background: "rgba(23,17,35,0.55)" }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 18, stiffness: 200 }}
            className="border-border bg-card shadow-pop-lg relative w-full max-w-lg overflow-hidden rounded-3xl border-2"
          >
            {/* Gradient top bar */}
            <div className="from-primary via-pink to-orange absolute top-0 left-0 h-2 w-full bg-gradient-to-r" />

            {/* Header */}
            <div className="px-8 pt-10 pb-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1, damping: 12, stiffness: 200 }}
                className="border-border bg-primary/10 shadow-pop-sm mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2"
              >
                <Mascot state={mascotState} size={44} />
              </motion.div>

              {/* Timer badge */}
              <div className="border-border bg-muted text-muted-foreground mb-3 inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-bold">
                <Timer className="h-3 w-3" />
                {durationSec}s session
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-lg"
              >
                {grade.emoji} {grade.label}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground mt-1 text-sm"
              >
                Time&apos;s up! Here&apos;s your performance
              </motion.p>
            </div>

            {/* Main WPM */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="border-border bg-primary/5 shadow-pop-sm mx-8 mb-6 rounded-2xl border-2 px-8 py-6 text-center"
            >
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                Words per minute
              </p>
              <div className="text-primary text-7xl leading-none font-black tabular-nums">
                <CountUp target={wpm} duration={1000} />
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Peak: {Math.round(result.peakWpm)} WPM
              </p>
            </motion.div>

            {/* Stats row */}
            <div className="mx-8 mb-8 grid grid-cols-3 gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className={`border-border shadow-pop-sm rounded-xl border-2 p-4 text-center ${stat.bg}`}
                >
                  <stat.icon className={`mx-auto mb-1.5 h-4 w-4 ${stat.color}`} />
                  <p className="text-xl font-black tabular-nums">
                    <CountUp target={stat.value} duration={800 + i * 100} />
                    {stat.suffix}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-[10px] font-bold tracking-wider uppercase">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border-border-subtle flex gap-3 border-t-2 px-8 py-5"
            >
              <Button variant="outline" className="flex-1" onClick={onRestart}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button className="flex-1" onClick={onViewResults}>
                <Trophy className="mr-2 h-4 w-4" />
                Full Results
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
