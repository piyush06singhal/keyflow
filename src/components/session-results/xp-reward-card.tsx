"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LevelInfo } from "@/lib/session-lifecycle";

export interface XpRewardCardProps {
  xpGained: number;
  levelInfo: LevelInfo;
  levelUp?: boolean;
  newLevel?: number;
  className?: string;
}

export function XpRewardCard({
  xpGained,
  levelInfo,
  levelUp,
  newLevel,
  className,
}: XpRewardCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      <Card className="border-border/40 shadow-key-md overflow-hidden rounded-2xl p-6">
        {levelUp && newLevel && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="border-primary/30 bg-primary/8 -m-6 mb-4 border-b p-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="bg-primary shadow-key-sm rounded-xl p-2.5"
              >
                <TrendingUp className="size-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-primary font-bold tracking-tight">Level Up!</h3>
                <p className="text-sm leading-relaxed">
                  You&apos;ve reached{" "}
                  <span className="font-semibold">Level {newLevel}</span>!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-5">
          {/* XP Gained */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3, stiffness: 200, damping: 15 }}
                className="shadow-key-xs rounded-xl bg-yellow-500/10 p-2.5"
              >
                <Star className="size-5 fill-yellow-500 text-yellow-500" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold tracking-tight">XP Gained</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  From this session
                </p>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.4, stiffness: 200, damping: 15 }}
              className="text-right"
            >
              <p className="text-2xl font-bold tracking-tight text-yellow-600 dark:text-yellow-500">
                +{xpGained}
              </p>
            </motion.div>
          </div>

          {/* Level Progress */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Zap className="text-primary size-4" />
                <span className="font-semibold tracking-tight">
                  Level {levelInfo.currentLevel}
                </span>
              </div>
              <span className="text-muted-foreground text-xs font-medium tabular-nums">
                {levelInfo.currentXp.toLocaleString()} /{" "}
                {levelInfo.xpForNextLevel.toLocaleString()} XP
              </span>
            </div>
            <Progress value={levelInfo.xpProgressPercentage} className="h-2.5" />
            <p className="text-muted-foreground text-right text-xs font-medium">
              {Math.round(levelInfo.xpProgressPercentage)}% to Level{" "}
              {levelInfo.currentLevel + 1}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
