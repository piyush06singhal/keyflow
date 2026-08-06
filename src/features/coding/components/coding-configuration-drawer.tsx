"use client";

/**
 * Coding Configuration Drawer
 *
 * Advanced settings panel for coding practice customization.
 */

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCodingPracticeStore } from "@/stores/coding-practice-store";
import type { CodeTheme } from "@/lib/coding-practice/types";

interface CodingConfigurationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CODE_THEMES: { value: CodeTheme; label: string }[] = [
  { value: "vs-dark", label: "VS Code Dark" },
  { value: "vs-light", label: "VS Code Light" },
  { value: "github-dark", label: "GitHub Dark" },
  { value: "github-light", label: "GitHub Light" },
  { value: "dracula", label: "Dracula" },
  { value: "monokai", label: "Monokai" },
  { value: "nord", label: "Nord" },
  { value: "one-dark", label: "One Dark" },
];

const FONT_FAMILIES = [
  { value: "JetBrains Mono, monospace", label: "JetBrains Mono" },
  { value: "Fira Code, monospace", label: "Fira Code" },
  { value: "Consolas, monospace", label: "Consolas" },
  { value: "Monaco, monospace", label: "Monaco" },
  { value: "Source Code Pro, monospace", label: "Source Code Pro" },
];

export function CodingConfigurationDrawer({
  open,
  onOpenChange,
}: CodingConfigurationDrawerProps) {
  const { config, updateConfig, resetConfig } = useCodingPracticeStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Practice Settings</SheetTitle>
          <SheetDescription>Customize your coding practice experience</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Editor Appearance */}
          <div className="space-y-4">
            <h3 className="font-semibold">Editor Appearance</h3>

            <div className="space-y-3">
              <Label>Code Theme</Label>
              <Select
                value={config.codeTheme}
                onValueChange={(value) =>
                  updateConfig({ codeTheme: value as CodeTheme })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CODE_THEMES.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Font Family</Label>
              <Select
                value={config.fontFamily}
                onValueChange={(value) => updateConfig({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Font Size</Label>
                <span className="text-muted-foreground text-sm">
                  {config.fontSize}px
                </span>
              </div>
              <Slider
                value={[config.fontSize]}
                onValueChange={([value]: number[]) => updateConfig({ fontSize: value })}
                min={10}
                max={24}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Line Height</Label>
                <span className="text-muted-foreground text-sm">
                  {config.lineHeight}
                </span>
              </div>
              <Slider
                value={[config.lineHeight]}
                onValueChange={([value]: number[]) =>
                  updateConfig({ lineHeight: value })
                }
                min={1.2}
                max={2.0}
                step={0.1}
              />
            </div>
          </div>

          <Separator />

          {/* Editor Features */}
          <div className="space-y-4">
            <h3 className="font-semibold">Editor Features</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="line-numbers">Show Line Numbers</Label>
              <Switch
                id="line-numbers"
                checked={config.showLineNumbers}
                onCheckedChange={(checked) =>
                  updateConfig({ showLineNumbers: checked })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Practice Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Practice Settings</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="backspace">Allow Backspace</Label>
              <Switch
                id="backspace"
                checked={config.allowBackspace}
                onCheckedChange={(checked) => updateConfig({ allowBackspace: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sound">Sound Effects</Label>
              <Switch
                id="sound"
                checked={config.soundEnabled}
                onCheckedChange={(checked) => updateConfig({ soundEnabled: checked })}
              />
            </div>
          </div>

          <Separator />

          {/* Reset Button */}
          <Button variant="outline" className="w-full" onClick={resetConfig}>
            Reset to Defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
