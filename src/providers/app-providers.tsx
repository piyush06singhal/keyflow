"use client";

import * as React from "react";

import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/features/notifications/context/notification-provider";
import { useSettingsStore } from "@/stores/settings-store";

/** Applies the persisted layout-density setting on every page, not just Settings. */
function DensityEffect() {
  const density = useSettingsStore((state) => state.appearance.density);

  React.useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <DensityEffect />
        <TooltipProvider delayDuration={350}>{children}</TooltipProvider>
        <Toaster richColors closeButton position="top-right" />
      </NotificationProvider>
    </ThemeProvider>
  );
}
