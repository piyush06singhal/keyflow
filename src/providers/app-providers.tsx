"use client";

import * as React from "react";

import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/features/notifications/context/notification-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <TooltipProvider delayDuration={350}>{children}</TooltipProvider>
        <Toaster richColors closeButton position="top-right" />
      </NotificationProvider>
    </ThemeProvider>
  );
}
