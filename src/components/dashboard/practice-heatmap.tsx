"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeatmapData {
  date: string;
  count: number;
  minutes: number;
}

interface PracticeHeatmapProps {
  data: HeatmapData[];
}

export function PracticeHeatmap({ data }: PracticeHeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate grid for the past year
  const generateYearGrid = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      currentWeek.push(new Date(d));
      if (d.getDay() === 6 || d.getTime() === today.getTime()) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }

    return weeks;
  };

  const weeks = generateYearGrid();

  const getIntensity = (date: Date): number => {
    const dateStr = date.toISOString().split("T")[0];
    const dayData = data.find((d) => d.date === dateStr);
    if (!dayData || dayData.count === 0) return 0;
    if (dayData.count <= 1) return 1;
    if (dayData.count <= 3) return 2;
    if (dayData.count <= 5) return 3;
    return 4;
  };

  const intensityColors = [
    "bg-muted",
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/60",
    "bg-primary/80",
  ];

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Practice Activity</CardTitle>
            <CardDescription>
              Your practice consistency over the past year
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dayIndex) => {
                  const intensity = getIntensity(date);
                  const dateStr = date.toISOString().split("T")[0];
                  const dayData = data.find((d) => d.date === dateStr);

                  return (
                    <Tooltip key={dayIndex}>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: weekIndex * 0.01 + dayIndex * 0.005 }}
                          className={`h-3 w-3 cursor-pointer rounded-sm ${intensityColors[intensity]} hover:ring-primary transition-all hover:ring-2 hover:ring-offset-2`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          {dayData ? (
                            <>
                              <p className="text-xs">
                                {dayData.count} session{dayData.count !== 1 ? "s" : ""}
                              </p>
                              <p className="text-xs">{dayData.minutes} minutes</p>
                            </>
                          ) : (
                            <p className="text-muted-foreground text-xs">No activity</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
          <span>Less</span>
          <div className="flex gap-1">
            {intensityColors.map((color, index) => (
              <div key={index} className={`h-3 w-3 rounded-sm ${color}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
