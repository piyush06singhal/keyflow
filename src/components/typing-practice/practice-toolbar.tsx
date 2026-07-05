"use client";

import { Settings, Keyboard, Focus, Maximize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

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

  const handleDurationChange = (value: string) => {
    if (value === "custom") {
      // TODO: Open custom duration dialog
      return;
    }
    updateConfig({ duration: parseInt(value) });
  };

  const handleModeChange = (value: string) => {
    updateConfig({ mode: value as any });
  };

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
      <div className="bg-card flex items-center justify-between gap-4 rounded-lg border p-3 shadow-sm">
        {/* Left: Mode and Duration */}
        <div className="flex items-center gap-3">
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
            value={config.duration.toString()}
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
