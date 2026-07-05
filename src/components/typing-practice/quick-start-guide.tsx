"use client";

import { useState } from "react";
import { X, Keyboard, Zap, Settings as SettingsIcon, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Quick Start Guide Component
 *
 * Displays helpful tips for first-time users.
 * Can be dismissed and won't show again.
 */

export function QuickStartGuide() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return !localStorage.getItem("typing-practice-guide-dismissed");
  });

  const handleDismiss = () => {
    localStorage.setItem("typing-practice-guide-dismissed", "true");
    setIsVisible(false);
  };

  const tips = [
    {
      icon: Keyboard,
      title: "Start Typing",
      description:
        "Just start typing to begin. The timer starts with your first keystroke.",
    },
    {
      icon: Zap,
      title: "Keyboard Shortcuts",
      description:
        "Use Ctrl+R to restart, Ctrl+Space to pause, and Ctrl+, for settings.",
    },
    {
      icon: Target,
      title: "Focus on Accuracy",
      description:
        "Speed comes with practice. Focus on accuracy first, speed will follow.",
    },
    {
      icon: SettingsIcon,
      title: "Customize Experience",
      description: "Adjust font size, enable blind mode, and more in settings.",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-primary/20 bg-primary/5 relative mb-6 overflow-hidden p-6">
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground absolute top-4 right-4 transition-colors"
              aria-label="Dismiss guide"
            >
              <X className="size-4" />
            </button>

            <h3 className="mb-4 text-lg font-semibold">Quick Start Guide</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {tips.map((tip) => (
                <div key={tip.title} className="flex gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <tip.icon className="text-primary size-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{tip.title}</p>
                    <p className="text-muted-foreground text-sm">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={handleDismiss}>
                Got it, thanks!
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
