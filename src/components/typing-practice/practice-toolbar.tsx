"use client";

import { useState } from "react";
import { Settings, Keyboard, Focus, Maximize2, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTypingPracticeStore } from "@/stores/typing-practice-store";
import type { PracticeCategory } from "@/stores/typing-practice-store";
import type { PracticeMode, Difficulty } from "@/lib/typing-engine/types";

/**
 * Practice Toolbar Component
 *
 * Top toolbar for configuring typing practice session.
 * Provides quick access to duration, mode, and view settings.
 */

export interface PracticeToolbarProps {
  onRestart?: () => void;
  disabled?: boolean;
}

const durations = [
  { value: "15", label: "15s" },
  { value: "30", label: "30s" },
  { value: "60", label: "1min" },
  { value: "120", label: "2min" },
  { value: "300", label: "5min" },
  { value: "custom", label: "Custom" },
];

const modes = [
  { value: "word", label: "Words" },
  { value: "paragraph", label: "Paragraphs" },
  { value: "quote", label: "Quotes" },
  { value: "custom", label: "Custom Text" },
  { value: "coding", label: "Code Snippets" },
  { value: "infinite", label: "Infinite" },
];

const difficulties: { value: Difficulty; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

const categories: { value: PracticeCategory; label: string }[] = [
  { value: "general", label: "General" },
  { value: "science", label: "Science" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "literature", label: "Literature" },
];

// Only these modes are actually sent through the Groq text-generation route
const AI_TEXT_MODES: PracticeMode[] = ["word", "paragraph", "quote"];

const MIN_CUSTOM_DURATION = 5;
const MAX_CUSTOM_DURATION = 3600;

function isPresetDuration(duration: number): boolean {
  return durations.some((d) => d.value !== "custom" && Number(d.value) === duration);
}

export function PracticeToolbar({ onRestart, disabled = false }: PracticeToolbarProps) {
  const {
    config,
    uiSettings,
    viewMode,
    updateConfig,
    updateUISettings,
    setViewMode,
    setSettingsOpen,
  } = useTypingPracticeStore();

  const [isCustomDuration, setIsCustomDuration] = useState(
    () => !isPresetDuration(config.duration),
  );
  const [customDurationInput, setCustomDurationInput] = useState(() =>
    String(config.duration),
  );

  // Zustand's persist middleware rehydrates from localStorage
  // asynchronously, after the first render — so the useState initializers
  // above can capture the pre-hydration default duration instead of the
  // user's actual saved one. Re-sync whenever the store's real duration
  // changes, using React's render-time state-adjustment pattern (not an
  // effect) so this resolves within the same render instead of causing an
  // extra pass. Safely a no-op on changes this component itself caused,
  // since those already leave both values consistent with config.duration.
  const [syncedDuration, setSyncedDuration] = useState(config.duration);
  if (config.duration !== syncedDuration) {
    setSyncedDuration(config.duration);
    setIsCustomDuration(!isPresetDuration(config.duration));
    setCustomDurationInput(String(config.duration));
  }

  const handleDurationChange = (value: string) => {
    if (value === "custom") {
      setIsCustomDuration(true);
      setCustomDurationInput(String(config.duration));
      return;
    }
    setIsCustomDuration(false);
    updateConfig({ duration: parseInt(value) });
  };

  const commitCustomDuration = () => {
    const parsed = Math.round(Number(customDurationInput));
    if (
      Number.isFinite(parsed) &&
      parsed >= MIN_CUSTOM_DURATION &&
      parsed <= MAX_CUSTOM_DURATION
    ) {
      updateConfig({ duration: parsed });
    } else {
      setCustomDurationInput(String(config.duration));
    }
  };

  const handleModeChange = (value: string) => {
    updateConfig({ mode: value as PracticeMode });
  };

  const handleDifficultyChange = (value: string) => {
    updateConfig({ difficulty: value as Difficulty });
  };

  const handleCategoryChange = (value: string) => {
    updateConfig({ category: value as PracticeCategory });
  };

  const showAiOptions = config.useAiText && AI_TEXT_MODES.includes(config.mode);

  const toggleFocusMode = () => {
    setViewMode(viewMode.mode === "focus" ? "default" : "focus");
  };

  const toggleZenMode = () => {
    setViewMode(viewMode.mode === "zen" ? "default" : "zen");
  };

  const toggleKeyboard = () => {
    updateUISettings({ showKeyboard: !uiSettings.showKeyboard });
  };

  return (
    <TooltipProvider>
      <div className="glass-panel shadow-pop-sm flex flex-wrap items-center justify-between gap-4 rounded-2xl p-3">
        {/* Left: Mode, Duration, and (when relevant) AI difficulty/category */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Selector */}
          <Select
            value={config.mode}
            onValueChange={handleModeChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              {modes.map((mode) => (
                <SelectItem key={mode.value} value={mode.value}>
                  {mode.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          {/* Duration Selector */}
          <Select
            value={isCustomDuration ? "custom" : config.duration.toString()}
            onValueChange={handleDurationChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isCustomDuration && (
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                min={MIN_CUSTOM_DURATION}
                max={MAX_CUSTOM_DURATION}
                value={customDurationInput}
                onChange={(e) => setCustomDurationInput(e.target.value)}
                onBlur={commitCustomDuration}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitCustomDuration();
                  }
                }}
                disabled={disabled}
                aria-label="Custom duration in seconds"
                className="h-11 w-20 text-sm"
              />
              <span className="text-muted-foreground text-xs font-bold">sec</span>
              {!disabled && config.duration.toString() === customDurationInput && (
                <Check className="text-success size-4" aria-hidden="true" />
              )}
            </div>
          )}

          {showAiOptions && (
            <>
              <Separator orientation="vertical" className="h-6" />

              {/* Difficulty Selector — feeds the Groq prompt */}
              <Select
                value={config.difficulty}
                onValueChange={handleDifficultyChange}
                disabled={disabled}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Content Category Selector — feeds the Groq prompt */}
              <Select
                value={config.category}
                onValueChange={handleCategoryChange}
                disabled={disabled}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Restart */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRestart}
                disabled={disabled}
                aria-label="Restart practice"
              >
                <RotateCcw className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Restart (Ctrl+R)</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* Toggle Keyboard */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={uiSettings.showKeyboard ? "secondary" : "ghost"}
                size="icon"
                onClick={toggleKeyboard}
                disabled={disabled}
                aria-label="Toggle keyboard"
                aria-pressed={uiSettings.showKeyboard}
              >
                <Keyboard className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Keyboard (Ctrl+K)</p>
            </TooltipContent>
          </Tooltip>

          {/* Focus Mode */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode.mode === "focus" ? "secondary" : "ghost"}
                size="icon"
                onClick={toggleFocusMode}
                disabled={disabled}
                aria-label="Toggle focus mode"
                aria-pressed={viewMode.mode === "focus"}
              >
                <Focus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Focus Mode (Ctrl+F)</p>
            </TooltipContent>
          </Tooltip>

          {/* Zen Mode */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode.mode === "zen" ? "secondary" : "ghost"}
                size="icon"
                onClick={toggleZenMode}
                disabled={disabled}
                aria-label="Toggle zen mode"
                aria-pressed={viewMode.mode === "zen"}
              >
                <Maximize2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zen Mode (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* Settings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen(true)}
                aria-label="Open settings"
              >
                <Settings className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings (Ctrl+,)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
