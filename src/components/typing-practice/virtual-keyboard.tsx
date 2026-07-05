"use client";

import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/**
 * Virtual Keyboard Component
 *
 * Displays a visual keyboard that highlights keys as they're pressed.
 * Supports multiple keyboard layouts (ANSI, ISO, TKL, Full).
 */

export interface VirtualKeyboardProps {
  layout?: "ansi" | "iso" | "tkl" | "full";
  className?: string;
}

// ANSI Layout (US Standard)
const ANSI_LAYOUT = [
  [
    { key: "`", label: "`" },
    { key: "1", label: "1" },
    { key: "2", label: "2" },
    { key: "3", label: "3" },
    { key: "4", label: "4" },
    { key: "5", label: "5" },
    { key: "6", label: "6" },
    { key: "7", label: "7" },
    { key: "8", label: "8" },
    { key: "9", label: "9" },
    { key: "0", label: "0" },
    { key: "-", label: "-" },
    { key: "=", label: "=" },
    { key: "Backspace", label: "←", width: 2 },
  ],
  [
    { key: "Tab", label: "Tab", width: 1.5 },
    { key: "q", label: "Q" },
    { key: "w", label: "W" },
    { key: "e", label: "E" },
    { key: "r", label: "R" },
    { key: "t", label: "T" },
    { key: "y", label: "Y" },
    { key: "u", label: "U" },
    { key: "i", label: "I" },
    { key: "o", label: "O" },
    { key: "p", label: "P" },
    { key: "[", label: "[" },
    { key: "]", label: "]" },
    { key: "\\", label: "\\", width: 1.5 },
  ],
  [
    { key: "CapsLock", label: "Caps", width: 1.75 },
    { key: "a", label: "A" },
    { key: "s", label: "S" },
    { key: "d", label: "D" },
    { key: "f", label: "F" },
    { key: "g", label: "G" },
    { key: "h", label: "H" },
    { key: "j", label: "J" },
    { key: "k", label: "K" },
    { key: "l", label: "L" },
    { key: ";", label: ";" },
    { key: "'", label: "'" },
    { key: "Enter", label: "↵", width: 2.25 },
  ],
  [
    { key: "Shift", label: "Shift", width: 2.25 },
    { key: "z", label: "Z" },
    { key: "x", label: "X" },
    { key: "c", label: "C" },
    { key: "v", label: "V" },
    { key: "b", label: "B" },
    { key: "n", label: "N" },
    { key: "m", label: "M" },
    { key: ",", label: "," },
    { key: ".", label: "." },
    { key: "/", label: "/" },
    { key: "Shift", label: "Shift", width: 2.75 },
  ],
  [
    { key: "Control", label: "Ctrl", width: 1.25 },
    { key: "Meta", label: "Win", width: 1.25 },
    { key: "Alt", label: "Alt", width: 1.25 },
    { key: " ", label: "", width: 6.25 },
    { key: "Alt", label: "Alt", width: 1.25 },
    { key: "Meta", label: "Win", width: 1.25 },
    { key: "ContextMenu", label: "☰", width: 1.25 },
    { key: "Control", label: "Ctrl", width: 1.25 },
  ],
];

export const VirtualKeyboard = memo(function VirtualKeyboard({
  layout = "ansi",
  className,
}: VirtualKeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActiveKeys((prev) => new Set(prev).add(e.key.toLowerCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.key.toLowerCase());
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-1.5">
        {ANSI_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5">
            {row.map((keyDef, keyIndex) => {
              const isActive = activeKeys.has(keyDef.key.toLowerCase());
              const width = keyDef.width || 1;

              return (
                <motion.div
                  key={`${rowIndex}-${keyIndex}`}
                  className={cn(
                    "bg-secondary flex items-center justify-center rounded border text-xs font-medium transition-colors",
                    "h-10",
                    {
                      "bg-primary text-primary-foreground": isActive,
                    },
                  )}
                  style={{
                    flex: `0 0 calc(${width} * 3rem)`,
                  }}
                  animate={{
                    scale: isActive ? 0.95 : 1,
                  }}
                  transition={{ duration: 0.1 }}
                  role="button"
                  aria-label={keyDef.label}
                  aria-pressed={isActive}
                >
                  {keyDef.label}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
});
