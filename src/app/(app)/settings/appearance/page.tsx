"use client";

import React from "react";
import { useSettings } from "@/features/settings/context/settings-provider";
import type { LucideIcon } from "lucide-react";
import { Palette, Monitor, Sun, Moon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card
      className={`hover:border-primary/50 cursor-pointer transition-all ${isSelected ? "border-primary ring-primary/20 ring-1" : ""}`}
      onClick={() => onClick(value)}
    >
      <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
        <Icon
          className={`h-8 w-8 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
        />
        <span
          className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
        >
          {label}
        </span>
      </CardContent>
    </Card>
  );
};

export default function AppearanceSettingsPage() {
  const { preferences, updateAppearance, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="bg-secondary h-8 w-48 rounded" />
        <div className="bg-secondary/50 h-32 rounded-lg" />
        <div className="bg-secondary/50 h-32 rounded-lg" />
      </div>
    );
  }

  const { appearance } = preferences;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-500">
      <div>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">Appearance</h2>
        <p className="text-muted-foreground">
          Customize how the application looks and feels across your devices.
        </p>
      </div>

      {/* Theme Section */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-medium">
          <Palette className="text-primary h-5 w-5" />
          Color Theme
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ThemeOption
            value="light"
            icon={Sun}
            label="Light"
            currentTheme={appearance.theme}
            onClick={(val) => updateAppearance({ theme: val })}
          />
          <ThemeOption
            value="dark"
            icon={Moon}
            label="Dark"
            currentTheme={appearance.theme}
            onClick={(val) => updateAppearance({ theme: val })}
          />
          <ThemeOption
            value="system"
            icon={Monitor}
            label="System Default"
            currentTheme={appearance.theme}
            onClick={(val) => updateAppearance({ theme: val })}
          />
        </div>
      </section>

      {/* Density Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Layout Density</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Control the spacing and sizing of UI elements.
        </p>

        <div className="bg-secondary flex w-fit rounded-lg p-1">
          {["compact", "comfortable", "spacious"].map((density) => (
            <button
              key={density}
              onClick={() => updateAppearance({ density: density as any })}
              className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-all ${
                appearance.density === density
                  ? "bg-background text-foreground shadow-sm"
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
