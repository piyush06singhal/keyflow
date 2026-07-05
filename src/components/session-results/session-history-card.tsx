"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Zap, Target, TrendingUp, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SessionHistoryItem } from "@/lib/session-lifecycle";
import { cn } from "@/lib/utils";

export interface SessionHistoryCardProps {
  session: SessionHistoryItem;
  onClick?: (session: SessionHistoryItem) => void;
  delay?: number;
}

export function SessionHistoryCard({
  session,
  onClick,
  delay = 0,
}: SessionHistoryCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
  };

  const getWpmColor = (wpm: number) => {
    if (wpm >= 70) return "text-green-500";
    if (wpm >= 50) return "text-blue-500";
    if (wpm >= 30) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      onClick={() => onClick?.(session)}
      className={cn("cursor-pointer transition-all", onClick && "hover:scale-[1.02]")}
    >
      <Card className="group relative overflow-hidden p-4 hover:shadow-md">
        {session.isPersonalBest && (
          <div className="absolute top-2 right-2">
            <Trophy className="size-4 fill-yellow-500 text-yellow-500" />
          </div>
        )}

        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {session.mode}
                </Badge>
                {session.isPersonalBest && (
                  <Badge
                    variant="secondary"
                    className="text-yellow-600 dark:text-yellow-500"
                  >
                    Personal Best
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                <Calendar className="size-3" />
                <span>{formatDate(session.date)}</span>
                <span>•</span>
                <Clock className="size-3" />
                <span>{formatDuration(session.duration)}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Zap className="size-3" />
                <span>WPM</span>
              </div>
              <p
                className={cn("font-mono text-xl font-bold", getWpmColor(session.wpm))}
              >
                {session.wpm.toFixed(0)}
              </p>
              <p className="text-muted-foreground text-xs">
                Peak: {session.peakWpm.toFixed(0)}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Target className="size-3" />
                <span>Accuracy</span>
              </div>
              <p className="font-mono text-xl font-bold">
                {session.accuracy.toFixed(1)}%
              </p>
              <p className="text-muted-foreground text-xs">
                {session.mistakes} mistakes
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <TrendingUp className="size-3" />
                <span>Consistency</span>
              </div>
              <p className="font-mono text-xl font-bold">
                {session.consistency.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
