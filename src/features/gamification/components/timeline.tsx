"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Target, Sparkles, Calendar, BookOpen } from "lucide-react";

export interface TimelineNode {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "milestone" | "achievement" | "level_up" | "streak";
  value?: string;
}

interface ProgressionTimelineProps {
  nodes: TimelineNode[];
  className?: string;
}

export function ProgressionTimeline({ nodes, className }: ProgressionTimelineProps) {
  const getIcon = (type: TimelineNode["type"]) => {
    switch (type) {
      case "level_up":
        return <Sparkles className="h-4.5 w-4.5 text-amber-500" />;
      case "achievement":
        return <Trophy className="h-4.5 w-4.5 text-purple-500" />;
      case "streak":
        return <Flame className="h-4.5 w-4.5 text-orange-500" />;
      default:
        return <BookOpen className="h-4.5 w-4.5 text-blue-500" />;
    }
  };

  const getBorderColor = (type: TimelineNode["type"]) => {
    switch (type) {
      case "level_up":
        return "border-amber-500/30";
      case "achievement":
        return "border-purple-500/30";
      case "streak":
        return "border-orange-500/30";
      default:
        return "border-blue-500/30";
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Vertical center track line */}
      <div className="bg-border/40 absolute top-2 bottom-2 left-6 w-0.5" />

      {/* Nodes list */}
      <div className="space-y-6">
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="relative pl-14"
          >
            {/* Timeline icon node badge indicator */}
            <div
              className={`bg-card shadow-key-xs absolute top-1.5 left-2.5 z-10 flex h-7.5 w-7.5 items-center justify-center rounded-xl border ${getBorderColor(node.type)}`}
            >
              {getIcon(node.type)}
            </div>

            {/* Content card */}
            <Card className="border-border/40 hover:border-primary/20 shadow-key-xs hover:shadow-key-sm rounded-2xl transition-all duration-300">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-foreground text-sm font-bold">{node.title}</h4>
                    {node.value && (
                      <Badge
                        variant="outline"
                        className="rounded-md px-1.5 py-0 text-[9px] font-bold uppercase"
                      >
                        {node.value}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {node.description}
                  </p>
                </div>

                <div className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-[10px] font-semibold">
                  <Calendar className="h-3.5 w-3.5" />
                  {node.date}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Default export container wrapper for timeline page integration
export function TimelineWidget() {
  const mockMilestones: TimelineNode[] = [
    {
      id: "m-3",
      title: "Reached Level 4",
      description:
        "Unlocked Elite Certification challenges and higher multiplier tier levels.",
      date: "Today, 11:32 AM",
      type: "level_up",
      value: "Level 4",
    },
    {
      id: "m-2",
      title: "Week Streak Mastered",
      description: "Completed typing drills 7 days in a row without breaking streaks.",
      date: "Yesterday, 3:15 PM",
      type: "streak",
      value: "7 Days",
    },
    {
      id: "m-1",
      title: "First Steps Achievement",
      description: "Successfully registered and completed the baseline typing check.",
      date: "July 01, 2026",
      type: "milestone",
      value: "Start",
    },
  ];

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm font-bold">
          <Trophy className="text-primary h-4.5 w-4.5" />
          Progression Milestones
        </CardTitle>
        <CardDescription>Visual history log of leveling achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressionTimeline nodes={mockMilestones} />
      </CardContent>
    </Card>
  );
}
