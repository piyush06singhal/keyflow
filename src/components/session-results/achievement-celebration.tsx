"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Achievement } from "@/lib/session-lifecycle";
import { getAchievementRarityColor } from "@/lib/session-lifecycle";
import { cn } from "@/lib/utils";

export interface AchievementCelebrationProps {
  achievements: Achievement[];
  show: boolean;
  onComplete?: () => void;
}

export function AchievementCelebration({
  achievements,
  show,
  onComplete,
}: AchievementCelebrationProps) {
  if (!show || achievements.length === 0) return null;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md"
          >
            <Card className="relative overflow-hidden p-8">
              {/* Confetti effect */}
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-primary absolute size-2 rounded-full opacity-60"
                    initial={{
                      x: "50%",
                      y: "50%",
                      scale: 0,
                    }}
                    animate={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="bg-primary/10 mx-auto flex size-20 items-center justify-center rounded-full"
                >
                  <Trophy className="text-primary size-10" />
                </motion.div>

                <div>
                  <h2 className="text-2xl font-bold">
                    {achievements.length === 1
                      ? "Achievement Unlocked!"
                      : `${achievements.length} Achievements Unlocked!`}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    You're making great progress!
                  </p>
                </div>

                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Card className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{achievement.title}</h3>
                              <Badge
                                variant="outline"
                                className={cn(
                                  getAchievementRarityColor(achievement.rarity),
                                )}
                              >
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mt-1 text-xs">
                              {achievement.description}
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
                              <Star className="size-3 fill-current" />
                              <span className="font-medium">
                                +{achievement.xpReward} XP
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface PersonalBestCelebrationProps {
  personalBests: Array<{
    type: string;
    previousValue: number;
    newValue: number;
    improvement: number;
  }>;
  show: boolean;
}

export function PersonalBestCelebration({
  personalBests,
  show,
}: PersonalBestCelebrationProps) {
  if (!show || personalBests.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "wpm":
        return Zap;
      case "accuracy":
        return Trophy;
      case "consistency":
        return Award;
      default:
        return Star;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "wpm":
        return "Fastest Speed";
      case "accuracy":
        return "Best Accuracy";
      case "consistency":
        return "Best Consistency";
      case "duration":
        return "Longest Session";
      default:
        return "Personal Best";
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="mb-6"
        >
          <Card className="border-primary bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <Trophy className="text-primary size-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">New Personal Best!</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {personalBests.map((pb, index) => {
                    const Icon = getIcon(pb.type);
                    return (
                      <motion.div
                        key={pb.type}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <Icon className="size-3" />
                        <span className="text-muted-foreground">
                          {getLabel(pb.type)}:
                        </span>
                        <span className="font-medium">
                          {pb.newValue.toFixed(pb.type === "duration" ? 0 : 1)}
                        </span>
                        <span className="text-green-600 dark:text-green-500">
                          (+{pb.improvement.toFixed(pb.type === "duration" ? 0 : 1)})
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
