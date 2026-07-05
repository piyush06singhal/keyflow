"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, RotateCcw, Settings, Keyboard, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Practice FAB (Floating Action Button)
 *
 * Provides quick access to common actions in a floating menu.
 * Useful in focus/zen modes where the toolbar is hidden.
 */

export interface PracticeFABProps {
  isActive: boolean;
  isPaused: boolean;
  onRestart: () => void;
  onPauseToggle: () => void;
  onSettings: () => void;
  onKeyboardToggle: () => void;
  showKeyboard: boolean;
}

export function PracticeFAB({
  isActive,
  isPaused,
  onRestart,
  onPauseToggle,
  onSettings,
  onKeyboardToggle,
  showKeyboard,
}: PracticeFABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: RotateCcw,
      label: "Restart",
      onClick: onRestart,
      color: "text-orange-500",
    },
    {
      icon: isPaused ? Play : Pause,
      label: isPaused ? "Resume" : "Pause",
      onClick: onPauseToggle,
      color: "text-blue-500",
    },
    {
      icon: Keyboard,
      label: showKeyboard ? "Hide Keyboard" : "Show Keyboard",
      onClick: onKeyboardToggle,
      color: "text-green-500",
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: onSettings,
      color: "text-purple-500",
    },
  ];

  return (
    <TooltipProvider>
      <div className="fixed right-8 bottom-8 z-50">
        <div className="relative">
          {/* Action Buttons */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 bottom-16 flex flex-col gap-2"
              >
                {actions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          className={cn("shadow-lg", action.color)}
                          onClick={() => {
                            action.onClick();
                            setIsOpen(false);
                          }}
                        >
                          <action.icon className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>{action.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <Button
            size="icon"
            className={cn(
              "size-14 rounded-full shadow-lg transition-transform",
              isOpen && "rotate-45",
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Quick actions menu"
            aria-expanded={isOpen}
          >
            <MoreVertical className="size-6" />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
