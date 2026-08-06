"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TiltCard } from "@/components/motion";
import { cn } from "@/lib/utils";

export interface StatisticCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: string;
  bgColor?: string;
  delay?: number;
  size?: "sm" | "md" | "lg";
}

export function StatisticCard({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  trendValue,
  color = "text-blue-500",
  bgColor = "bg-blue-500/10",
  delay = 0,
  size = "md",
}: StatisticCardProps) {
  const sizeClasses = {
    sm: {
      card: "p-3",
      icon: "size-4",
      iconWrapper: "p-1.5",
      value: "text-xl",
      label: "text-xs",
    },
    md: {
      card: "p-4",
      icon: "size-5",
      iconWrapper: "p-2",
      value: "text-2xl",
      label: "text-xs",
    },
    lg: {
      card: "p-6",
      icon: "size-6",
      iconWrapper: "p-3",
      value: "text-3xl",
      label: "text-sm",
    },
  };

  const classes = sizeClasses[size];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <TiltCard maxTilt={6}>
        <Card className={cn("transition-all duration-200", classes.card)}>
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "border-border shadow-pop-sm rounded-xl border-2",
                bgColor,
                classes.iconWrapper,
              )}
            >
              <Icon className={cn(classes.icon, color)} />
            </div>
            <div className="flex-1 space-y-1">
              <p
                className={cn(
                  "text-muted-foreground font-medium tracking-tight",
                  classes.label,
                )}
              >
                {label}
              </p>
              <div className="flex items-baseline gap-2">
                <p className={cn("font-mono font-bold tracking-tight", classes.value)}>
                  {value}
                </p>
                {trend && trendValue && (
                  <span
                    className={cn("text-xs font-semibold", {
                      "text-success": trend === "up",
                      "text-destructive": trend === "down",
                      "text-muted-foreground": trend === "neutral",
                    })}
                  >
                    {trend === "up" && "↑"}
                    {trend === "down" && "↓"}
                    {trendValue}
                  </span>
                )}
              </div>
              {subValue && (
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {subValue}
                </p>
              )}
            </div>
          </div>
        </Card>
      </TiltCard>
    </motion.div>
  );
}
