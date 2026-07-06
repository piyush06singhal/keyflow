"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTypingPracticeStore } from "@/stores/typing-practice-store";
import { Switch } from "@/components/ui/switch";

/**
 * Settings Drawer Component
 *
 * Slide-out drawer for customizing typing practice preferences.
 * Includes visual, accessibility, and content settings.
 */

export function SettingsDrawer() {
  const {
    config,
    uiSettings,
    settingsOpen,
    updateConfig,
    updateUISettings,
    setSettingsOpen,
    resetToDefaults,
  } = useTypingPracticeStore();

  return (
    <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
      <SheetContent className="w-[400px] overflow-y-auto sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Practice Settings</SheetTitle>
          <SheetDescription>Customize your typing practice experience</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Visual Settings */}
          <section>
            <h3 className="mb-4 text-sm font-semibold">Visual</h3>
            <div className="space-y-4">
              {/* Font Size */}
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select
                  value={uiSettings.fontSize}
                  onValueChange={(value: any) => updateUISettings({ fontSize: value })}
                >
                  <SelectTrigger id="font-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="base">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Family */}
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select
                  value={uiSettings.fontFamily}
                  onValueChange={(value: "mono" | "sans" | "serif") =>
                    updateUISettings({ fontFamily: value })
                  }
                >
                  <SelectTrigger id="font-family">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mono">Monospace</SelectItem>
                    <SelectItem value="sans">Sans Serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cursor Style */}
              <div className="space-y-2">
                <Label htmlFor="cursor-style">Cursor Style</Label>
                <Select
                  value={uiSettings.cursorStyle}
                  onValueChange={(value: "line" | "block" | "underline") =>
                    updateUISettings({ cursorStyle: value })
                  }
                >
                  <SelectTrigger id="cursor-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line</SelectItem>
                    <SelectItem value="block">Block</SelectItem>
                    <SelectItem value="underline">Underline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator />

          {/* Content Settings */}
          <section>
            <h3 className="mb-4 text-sm font-semibold">Content</h3>
            <div className="space-y-4">
              {/* Punctuation */}
              <div className="flex items-center justify-between">
                <Label htmlFor="punctuation" className="flex-1">
                  Include Punctuation
                </Label>
                <Switch
                  id="punctuation"
                  checked={config.includePunctuation}
                  onCheckedChange={(checked) =>
                    updateConfig({ includePunctuation: checked })
                  }
                />
              </div>

              {/* Numbers */}
              <div className="flex items-center justify-between">
                <Label htmlFor="numbers" className="flex-1">
                  Include Numbers
                </Label>
                <Switch
                  id="numbers"
                  checked={config.includeNumbers}
                  onCheckedChange={(checked) =>
                    updateConfig({ includeNumbers: checked })
                  }
                />
              </div>

              {/* Capitalization */}
              <div className="flex items-center justify-between">
                <Label htmlFor="capitalization" className="flex-1">
                  Include Capitalization
                </Label>
                <Switch
                  id="capitalization"
                  checked={config.includeCapitalization}
                  onCheckedChange={(checked) =>
                    updateConfig({ includeCapitalization: checked })
                  }
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Feature Settings */}
          <section>
            <h3 className="mb-4 text-sm font-semibold">Features</h3>
            <div className="space-y-4">
              {/* Allow Backspace */}
              <div className="flex items-center justify-between">
                <Label htmlFor="backspace" className="flex-1">
                  Allow Backspace
                </Label>
                <Switch
                  id="backspace"
                  checked={config.allowBackspace}
                  onCheckedChange={(checked) =>
                    updateConfig({ allowBackspace: checked })
                  }
                />
              </div>

              {/* Blind Mode */}
              <div className="flex items-center justify-between">
                <Label htmlFor="blind-mode" className="flex-1">
                  Blind Mode
                  <span className="text-muted-foreground ml-2 text-xs">
                    Hide text until typed
                  </span>
                </Label>
                <Switch
                  id="blind-mode"
                  checked={config.blindMode}
                  onCheckedChange={(checked) => updateConfig({ blindMode: checked })}
                />
              </div>

              {/* Strict Mode */}
              <div className="flex items-center justify-between">
                <Label htmlFor="strict-mode" className="flex-1">
                  Strict Mode
                  <span className="text-muted-foreground ml-2 text-xs">
                    Exact match required
                  </span>
                </Label>
                <Switch
                  id="strict-mode"
                  checked={config.strictMode}
                  onCheckedChange={(checked) => updateConfig({ strictMode: checked })}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Accessibility */}
          <section>
            <h3 className="mb-4 text-sm font-semibold">Accessibility</h3>
            <div className="space-y-4">
              {/* Sound */}
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="flex-1">
                  Sound Effects
                </Label>
                <Switch
                  id="sound"
                  checked={uiSettings.soundEnabled}
                  onCheckedChange={(checked) =>
                    updateUISettings({ soundEnabled: checked })
                  }
                />
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <Label htmlFor="reduced-motion" className="flex-1">
                  Reduced Motion
                </Label>
                <Switch
                  id="reduced-motion"
                  checked={uiSettings.reducedMotion}
                  onCheckedChange={(checked) =>
                    updateUISettings({ reducedMotion: checked })
                  }
                />
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="flex-1">
                  High Contrast
                </Label>
                <Switch
                  id="high-contrast"
                  checked={uiSettings.highContrast}
                  onCheckedChange={(checked) =>
                    updateUISettings({ highContrast: checked })
                  }
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Keyboard Settings */}
          <section>
            <h3 className="mb-4 text-sm font-semibold">Keyboard</h3>
            <div className="space-y-4">
              {/* Show Keyboard */}
              <div className="flex items-center justify-between">
                <Label htmlFor="show-keyboard" className="flex-1">
                  Show Virtual Keyboard
                </Label>
                <Switch
                  id="show-keyboard"
                  checked={uiSettings.showKeyboard}
                  onCheckedChange={(checked) =>
                    updateUISettings({ showKeyboard: checked })
                  }
                />
              </div>

              {/* Keyboard Layout */}
              <div className="space-y-2">
                <Label htmlFor="keyboard-layout">Keyboard Layout</Label>
                <Select
                  value={uiSettings.keyboardLayout}
                  onValueChange={(value: any) =>
                    updateUISettings({ keyboardLayout: value })
                  }
                >
                  <SelectTrigger id="keyboard-layout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ansi">ANSI (US)</SelectItem>
                    <SelectItem value="iso">ISO (EU)</SelectItem>
                    <SelectItem value="tkl">TKL (Tenkeyless)</SelectItem>
                    <SelectItem value="full">Full Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Reset Button */}
          <div className="pt-4">
            <Button variant="outline" className="w-full" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
