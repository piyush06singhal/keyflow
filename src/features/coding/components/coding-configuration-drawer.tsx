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

/**
 * Font family options for the code editor.
 *
 * The `value` must exactly match the `fontFamily` stored in
 * `CodingPracticeConfig`. When a user picks a font here the full CSS
 * font-stack (including the generic `monospace` fallback) is stored so
 * the editor always has a valid stack even if the web-font hasn't loaded.
 *
 * If a previously-persisted `fontFamily` doesn't match any option (e.g.
 * an older build stored just the font name without the fallback), we
 * gracefully fall back to showing the first option — the Select component
 * handles this via the `value` prop.
 */
const FONT_FAMILIES = [
  { value: "JetBrains Mono, Fira Code, Consolas, monospace", label: "JetBrains Mono" },
  { value: "Fira Code, Consolas, monospace", label: "Fira Code" },
  { value: "Consolas, Monaco, monospace", label: "Consolas" },
  { value: "Monaco, Menlo, monospace", label: "Monaco" },
  { value: "Source Code Pro, Fira Code, monospace", label: "Source Code Pro" },
];

/**
 * Match a potentially-stored fontFamily value to one of the known options.
 * Handles legacy values that may lack the full fallback stack.
 */
function matchFontFamily(stored: string): string {
  if (FONT_FAMILIES.some((f) => f.value === stored)) return stored;
  // Try matching by the leading font name (before the first comma)
  const leadingName = stored.split(",")[0]?.trim().toLowerCase();
  if (leadingName) {
    const match = FONT_FAMILIES.find(
      (f) => f.value.split(",")[0]?.trim().toLowerCase() === leadingName,
    );
    if (match) return match.value;
  }
  // No match — default to first option
  return FONT_FAMILIES[0]!.value;
}

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
                value={matchFontFamily(config.fontFamily)}
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
