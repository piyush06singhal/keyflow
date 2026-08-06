"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useSettingsStore } from "@/stores/settings-store";
import { useMounted } from "@/hooks/use-mounted";
import type { LucideIcon } from "lucide-react";
import { Palette, Monitor, Sun, Moon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TiltCard } from "@/components/motion";

interface ThemeOptionProps {
  value: string;
  icon: LucideIcon;
  label: string;
  currentTheme: string;
  onClick: (val: any) => void;
}

const ThemeOption = ({
  value,
  icon: Icon,
  label,
  currentTheme,
  onClick,
}: ThemeOptionProps) => {
  const isSelected = currentTheme === value;
  return (
    <TiltCard maxTilt={8}>
      <Card
        className={`cursor-pointer transition-all ${isSelected ? "bg-primary/10" : ""}`}
        onClick={() => onClick(value)}
      >
        <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
          <Icon
            className={`h-8 w-8 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
          />
          <span
            className={`text-sm font-bold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
          >
            {label}
          </span>
        </CardContent>
      </Card>
    </TiltCard>
  );
};

export default function AppearanceSettingsPage() {
  const appearance = useSettingsStore((state) => state.appearance);
  const updateAppearance = useSettingsStore((state) => state.updateAppearance);
  const { theme, setTheme } = useTheme();

  // next-themes resolves the real theme only after mount (it needs to read
  // localStorage/media query client-side) — avoid a hydration flash by
  // falling back to "system" until then.
  const mounted = useMounted();
  const currentTheme = mounted ? (theme ?? "system") : "system";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-500">
      <div>
        <h2 className="mb-2 text-2xl">Appearance</h2>
        <p className="text-muted-foreground">
          Customize how the application looks and feels across your devices.
        </p>
      </div>

      {/* Theme Section */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg">
          <Palette className="text-primary h-5 w-5" />
          Color Theme
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ThemeOption
            value="light"
            icon={Sun}
            label="Light"
            currentTheme={currentTheme}
            onClick={(val) => setTheme(val)}
          />
          <ThemeOption
            value="dark"
            icon={Moon}
            label="Dark"
            currentTheme={currentTheme}
            onClick={(val) => setTheme(val)}
          />
          <ThemeOption
            value="system"
            icon={Monitor}
            label="System Default"
            currentTheme={currentTheme}
            onClick={(val) => setTheme(val)}
          />
        </div>
      </section>

      {/* Density Section */}
      <section className="space-y-4">
        <h3 className="text-lg">Layout Density</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Control the spacing and sizing of UI elements.
        </p>

        <div className="bg-muted flex w-fit rounded-full p-1.5">
          {["compact", "comfortable", "spacious"].map((density) => (
            <button
              key={density}
              onClick={() => updateAppearance({ density: density as any })}
              className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition-all ${
                appearance.density === density
                  ? "border-border bg-primary text-primary-foreground shadow-pop-sm border-2"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {density}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
