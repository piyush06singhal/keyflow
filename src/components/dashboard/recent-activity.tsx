"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Keyboard,
  Code2,
  Trophy,
  Calendar,
  Brain,
  UserCircle,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: "typing" | "coding" | "achievement" | "challenge" | "ai_report" | "profile";
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, string | number>;
}

const activityIcons = {
  typing: Keyboard,
  coding: Code2,
  achievement: Trophy,
  challenge: Calendar,
  ai_report: Brain,
  profile: UserCircle,
};

const activityColors = {
  typing: "text-blue-500",
  coding: "text-purple-500",
  achievement: "text-yellow-500",
  challenge: "text-green-500",
  ai_report: "text-pink-500",
  profile: "text-orange-500",
};

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your latest achievements and practice sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="flex h-[300px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="text-muted-foreground/50 mb-4 h-12 w-12" />
                <p className="text-muted-foreground text-sm">
                  No recent activity yet. Start practicing to see your progress here!
                </p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <ActivityItem key={activity.id} activity={activity} index={index} />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity, index }: { activity: Activity; index: number }) {
  const Icon = activityIcons[activity.type];
  const colorClass = activityColors[activity.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-border/50 bg-muted/30 hover:bg-muted/50 flex gap-4 rounded-lg border p-4 transition-all"
    >
      <div
        className={`bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="leading-none font-medium">{activity.title}</h4>
          <Badge variant="outline" className="shrink-0 text-xs">
            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">{activity.description}</p>
        {activity.metadata && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(activity.metadata).map(([key, value]) => (
              <span key={key} className="text-muted-foreground text-xs">
                {key}: <span className="text-foreground font-medium">{value}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
