import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Keyboard,
  Clock,
  Type,
  TrendingUp,
  Award,
  Zap,
  Code2,
  Percent,
} from "lucide-react";
import type { AnalyticsSummary } from "../types";

interface OverviewCardsProps {
  summary: AnalyticsSummary;
  typingOnly?: boolean;
  codingOnly?: boolean;
}

export function OverviewCards({ summary, typingOnly, codingOnly }: OverviewCardsProps) {
  const { kpis } = summary;

  // Formatting helpers
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  };

  const cards = [];

  if (typingOnly) {
    cards.push(
      {
        title: "Average Typing Speed",
        value: `${kpis.averageWpm} WPM`,
        icon: Keyboard,
        color: "text-blue-500 bg-blue-500/10",
        desc: "Speed across all typing practice",
      },
      {
        title: "Personal Best WPM",
        value: `${kpis.bestWpm} WPM`,
        icon: TrendingUp,
        color: "text-amber-500 bg-amber-500/10",
        desc: "Highest speed achieved",
      },
      {
        title: "Average Accuracy",
        value: `${kpis.averageAccuracy}%`,
        icon: Percent,
        color: "text-emerald-500 bg-emerald-500/10",
        desc: "Keypress accuracy rate",
      },
      {
        title: "Consistency Rating",
        value: `${kpis.consistencyScore}%`,
        icon: Award,
        color: "text-purple-500 bg-purple-500/10",
        desc: "Rhythm and speed distribution",
      },
    );
  } else if (codingOnly) {
    cards.push(
      {
        title: "Coding Speed",
        value: `${Math.round(kpis.averageWpm * 0.7)} WPM`,
        icon: Code2,
        color: "text-indigo-500 bg-indigo-500/10",
        desc: "Avg code writing speed",
      },
      {
        title: "Coding Accuracy",
        value: `${kpis.codingAccuracy}%`,
        icon: Percent,
        color: "text-emerald-500 bg-emerald-500/10",
        desc: "Indentation & bracket accuracy",
      },
      {
        title: "Lines Practiced",
        value: kpis.linesOfCodeTyped,
        icon: Type,
        color: "text-pink-500 bg-pink-500/10",
        desc: "Total code lines typed",
      },
      {
        title: "Coding Practice Time",
        value: formatTime(kpis.totalPracticeTime * 0.4),
        icon: Clock,
        color: "text-orange-500 bg-orange-500/10",
        desc: "Time spent coding",
      },
    );
  } else {
    // Overall Hub View
    cards.push(
      {
        title: "Total Sessions",
        value: kpis.totalSessions,
        icon: Keyboard,
        color: "text-blue-500 bg-blue-500/10",
        desc: `${kpis.typingSessionsCount} typing, ${kpis.codingSessionsCount} coding`,
      },
      {
        title: "Practice Time",
        value: formatTime(kpis.totalPracticeTime),
        icon: Clock,
        color: "text-orange-500 bg-orange-500/10",
        desc: "Time logged on KeyFlow",
      },
      {
        title: "Total Words",
        value: kpis.wordsTyped.toLocaleString(),
        icon: Type,
        color: "text-pink-500 bg-pink-500/10",
        desc: "Words completed",
      },
      {
        title: "Learning Intelligence Score",
        value: `${kpis.overallLearningScore}/100`,
        icon: Award,
        color: "text-purple-500 bg-purple-500/10",
        desc: "Overall progress grade",
      },
      {
        title: "Current Streak",
        value: `${kpis.currentStreak} Days`,
        icon: Zap,
        color: "text-amber-500 bg-amber-500/10",
        desc: `Longest streak: ${kpis.longestStreak} days`,
      },
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card
            key={i}
            className="surface-card hover:border-primary/30 transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {card.title}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.color}`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{card.value}</div>
              <p className="text-muted-foreground mt-1 text-[11px] leading-none font-medium">
                {card.desc}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
