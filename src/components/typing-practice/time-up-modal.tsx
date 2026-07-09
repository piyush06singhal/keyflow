"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Target, TrendingUp, RotateCcw, BarChart2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
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

function getGrade(wpm: number): { label: string; color: string; emoji: string } {
  if (wpm >= 100) return { label: "Legendary", color: "text-yellow-400", emoji: "🏆" };
  if (wpm >= 80) return { label: "Expert", color: "text-purple-400", emoji: "⚡" };
  if (wpm >= 60) return { label: "Advanced", color: "text-blue-400", emoji: "🚀" };
  if (wpm >= 40) return { label: "Proficient", color: "text-green-400", emoji: "✅" };
  if (wpm >= 20) return { label: "Beginner", color: "text-orange-400", emoji: "📈" };
  return { label: "Novice", color: "text-red-400", emoji: "💪" };
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

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.7)" }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 18, stiffness: 200 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f10] shadow-2xl"
          >
            {/* Glowing top bar */}
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500" />

            {/* Header */}
            <div className="px-8 pt-10 pb-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1, damping: 12, stiffness: 200 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-3xl"
              >
                {grade.emoji}
              </motion.div>

              {/* Timer badge */}
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                <Timer className="h-3 w-3" />
                {durationSec}s session
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={`text-lg font-bold tracking-wide ${grade.color}`}
              >
                {grade.label}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-1 text-sm text-white/40"
              >
                Time&apos;s up! Here&apos;s your performance
              </motion.p>
            </div>

            {/* Main WPM */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="mx-8 mb-6 rounded-2xl border border-white/5 bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-cyan-500/10 px-8 py-6 text-center"
            >
              <p className="mb-1 text-xs font-semibold tracking-widest text-white/40 uppercase">
                Words per minute
              </p>
              <div className="text-7xl leading-none font-black text-white tabular-nums">
                <CountUp target={wpm} duration={1000} />
              </div>
              <p className="mt-2 text-sm text-white/30">
                Peak: {Math.round(result.peakWpm)} WPM
              </p>
            </motion.div>

            {/* Stats row */}
            <div className="mx-8 mb-8 grid grid-cols-3 gap-3">
              {[
                {
                  icon: Target,
                  label: "Accuracy",
                  value: accuracy,
                  suffix: "%",
                  color: "text-green-400",
                  bg: "from-green-500/10",
                },
                {
                  icon: TrendingUp,
                  label: "Consistency",
                  value: consistency,
                  suffix: "%",
                  color: "text-purple-400",
                  bg: "from-purple-500/10",
                },
                {
                  icon: BarChart2,
                  label: "Mistakes",
                  value: result.mistakes.length,
                  suffix: "",
                  color: "text-red-400",
                  bg: "from-red-500/10",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className={`rounded-xl bg-gradient-to-b ${stat.bg} border border-white/5 to-transparent p-4 text-center`}
                >
                  <stat.icon className={`mx-auto mb-1.5 h-4 w-4 ${stat.color}`} />
                  <p className="text-xl font-bold text-white tabular-nums">
                    <CountUp target={stat.value} duration={800 + i * 100} />
                    {stat.suffix}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium tracking-wider text-white/30 uppercase">
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
              className="flex gap-3 border-t border-white/5 px-8 py-5"
            >
              <Button
                variant="ghost"
                className="flex-1 border border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                onClick={onRestart}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                className="flex-1 border-0 bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg hover:from-violet-500 hover:to-blue-500"
                onClick={onViewResults}
              >
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
