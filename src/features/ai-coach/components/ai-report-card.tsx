"use client";

import { FileText, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AiPerformanceReport } from "@/features/ai-coach/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface AIReportCardProps {
  report: AiPerformanceReport | {
    title: string;
    summary: string;
    report_type?: string;
    period_start?: string;
    period_end?: string;
    strengths?: string[] | null;
    recommendations?: string[] | null;
  };
  onView?: () => void;
  className?: string;
}

export function AIReportCard({ report, onView, className }: AIReportCardProps) {
  const periodLabel =
    report.period_start && report.period_end
      ? `${format(new Date(report.period_start), "MMM d")} – ${format(new Date(report.period_end), "MMM d")}`
      : null;

  return (
    <Card
      className={cn(
        "border-border/50 bg-card/50 cursor-pointer backdrop-blur-sm transition-all hover:shadow-md",
        className,
      )}
      onClick={onView}
      role={onView ? "button" : undefined}
      tabIndex={onView ? 0 : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="text-primary h-5 w-5 shrink-0" />
            <CardTitle className="text-base">{report.title}</CardTitle>
          </div>
          {report.report_type && (
            <Badge variant="outline" className="capitalize">
              {report.report_type.replace(/_/g, " ")}
            </Badge>
          )}
        </div>
        {periodLabel && (
          <CardDescription className="text-xs">{periodLabel}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm leading-relaxed">{report.summary}</p>
        {report.strengths && report.strengths.length > 0 && (
          <div className="flex items-start gap-2">
            <TrendingUp className="text-success mt-0.5 h-4 w-4 shrink-0" />
            <ul className="text-muted-foreground space-y-1 text-xs">
              {report.strengths.slice(0, 3).map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
