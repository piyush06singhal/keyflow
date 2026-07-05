"use client";

import { Save, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { AiUserPreferences } from "@/features/ai-coach/types";
import { cn } from "@/lib/utils";

interface AISettingsPanelProps {
  preferences: AiUserPreferences;
  onChange: (updates: Partial<AiUserPreferences>) => void;
  onSave: () => void;
  isSaving?: boolean;
  className?: string;
}

export function AISettingsPanel({
  preferences,
  onChange,
  onSave,
  isSaving,
  className,
}: AISettingsPanelProps) {
  return (
    <Card className={cn("border-border/50 bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-5 w-5" />
          <CardTitle>AI Coach Settings</CardTitle>
        </div>
        <CardDescription>
          Control how AI assists your learning. Core practice always works without AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SettingRow
          label="Enable AI Coach"
          description="Use AI-powered insights and recommendations"
          checked={preferences.ai_enabled}
          onCheckedChange={(v) => onChange({ ai_enabled: v })}
        />
        <SettingRow
          label="Auto Recommendations"
          description="Receive personalized practice suggestions"
          checked={preferences.auto_recommendations}
          onCheckedChange={(v) => onChange({ auto_recommendations: v })}
          disabled={!preferences.ai_enabled}
        />
        <SettingRow
          label="Weekly Reports"
          description="Generate AI weekly progress summaries"
          checked={preferences.weekly_reports}
          onCheckedChange={(v) => onChange({ weekly_reports: v })}
          disabled={!preferences.ai_enabled}
        />
        <SettingRow
          label="Daily Practice Planner"
          description="Get a personalized daily practice plan"
          checked={preferences.daily_practice_planner}
          onCheckedChange={(v) => onChange({ daily_practice_planner: v })}
          disabled={!preferences.ai_enabled}
        />

        <div className="space-y-2">
          <Label>Learning Style</Label>
          <Select
            value={preferences.preferred_learning_style ?? "balanced"}
            onValueChange={(v) =>
              onChange({
                preferred_learning_style: v as AiUserPreferences["preferred_learning_style"],
              })
            }
            disabled={!preferences.ai_enabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="visual">Visual</SelectItem>
              <SelectItem value="practical">Practical</SelectItem>
              <SelectItem value="theoretical">Theoretical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Preferred Difficulty</Label>
          <Select
            value={preferences.preferred_difficulty ?? "intermediate"}
            onValueChange={(v) => onChange({ preferred_difficulty: v })}
            disabled={!preferences.ai_enabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <SettingRow
          label="Performance Analysis"
          description="Allow AI to analyze your practice sessions"
          checked={preferences.allow_performance_analysis}
          onCheckedChange={(v) => onChange({ allow_performance_analysis: v })}
          disabled={!preferences.ai_enabled}
        />

        <Button onClick={onSave} disabled={isSaving} className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving…" : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}

function SettingRow({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}
