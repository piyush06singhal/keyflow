"use client";

import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useTypingPracticeStore } from "@/stores/typing-practice-store";
import type { KeyboardLayoutVariant } from "@/stores/typing-practice-store";

/**
 * Virtual Keyboard Component
 *
 * Displays a visual keyboard that highlights keys as they're pressed.
 * Supports multiple keyboard layouts (ANSI, ISO, TKL, Full).
 */

export interface VirtualKeyboardProps {
  className?: string;
}

interface KeyDef {
  key: string;
  label: string;
  width?: number;
}

// ANSI Layout (US Standard)
const ANSI_LAYOUT: KeyDef[][] = [
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

// ISO Layout — the extra backslash key sits between the short left Shift and
// Z, and the Enter key is a tall column on the right instead of a wide bar.
const ISO_LAYOUT: KeyDef[][] = [
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
    // No trailing backslash key — Enter's tall column takes that space.
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
    { key: "Shift", label: "Shift", width: 1.25 },
    { key: "\\", label: "\\", width: 1 },
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
    { key: "Shift", label: "Shift", width: 1.75 },
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

// -- Navigation cluster shared by TKL and Full layouts (functions row + arrows).
const NAV_CLUSTER_ROW: KeyDef[] = [
  { key: "PrintScreen", label: "PrtSc" },
  { key: "ScrollLock", label: "ScrLk" },
  { key: "Pause", label: "Pause" },
  { key: "Insert", label: "Ins" },
  { key: "Home", label: "Home" },
  { key: "PageUp", label: "PgUp" },
  { key: "Delete", label: "Del" },
  { key: "End", label: "End" },
  { key: "PageDown", label: "PgDn" },
];

const ARROW_ROW: KeyDef[] = [
  { key: "ArrowUp", label: "↑" },
  { key: "ArrowLeft", label: "←" },
  { key: "ArrowDown", label: "↓" },
  { key: "ArrowRight", label: "→" },
];

// TKL Layout — tenkeyless: the ANSI block plus navigation/arrow cluster,
// with no number pad.
const TKL_LAYOUT: KeyDef[][] = [...ANSI_LAYOUT, NAV_CLUSTER_ROW, ARROW_ROW];

// Full Layout — TKL plus the numeric keypad.
const FULL_LAYOUT: KeyDef[][] = [
  ...ANSI_LAYOUT,
  NAV_CLUSTER_ROW,
  [
    { key: "NumLock", label: "Num" },
    { key: "Divide", label: "/" },
    { key: "Multiply", label: "*" },
    { key: "Subtract", label: "-" },
  ],
  ARROW_ROW,
  [
    { key: "7", label: "7" },
    { key: "8", label: "8" },
    { key: "9", label: "9" },
    { key: "Add", label: "+", width: 1.25 },
  ],
  [
    { key: "4", label: "4" },
    { key: "5", label: "5" },
    { key: "6", label: "6" },
    { key: "Add", label: "+", width: 1.25 },
  ],
  [
    { key: "1", label: "1" },
    { key: "2", label: "2" },
    { key: "3", label: "3" },
    { key: "Enter", label: "↵", width: 1.25 },
  ],
  [
    { key: "0", label: "0", width: 2 },
    { key: "Decimal", label: "." },
    { key: "Enter", label: "↵", width: 1.25 },
  ],
];

const KEYBOARD_LAYOUTS: Record<KeyboardLayoutVariant, KeyDef[][]> = {
  ansi: ANSI_LAYOUT,
  iso: ISO_LAYOUT,
  tkl: TKL_LAYOUT,
  full: FULL_LAYOUT,
};

export const VirtualKeyboard = memo(function VirtualKeyboard({
  className,
}: VirtualKeyboardProps) {
  const keyboardLayout = useTypingPracticeStore((s) => s.uiSettings.keyboardLayout);
  const layout = KEYBOARD_LAYOUTS[keyboardLayout] ?? ANSI_LAYOUT;
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
    <Card className={cn("glass-panel p-4", className)} aria-hidden="true">
      {/* Purely a visual mirror of real keystrokes — it has no onClick and
          nothing here is operable, so it's hidden from assistive tech
          instead of announcing ~65 fake "buttons" (including an unlabeled
          one for the spacebar) that a screen reader user can't act on. */}
      {/* The full ANSI layout is ~750px wide and doesn't reflow — scroll it
          horizontally within its own card on narrow viewports instead of
          letting it force the whole page wider. */}
      <div className="space-y-1.5 overflow-x-auto pb-1">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex w-max gap-1.5">
            {row.map((keyDef, keyIndex) => {
              const isActive = activeKeys.has(keyDef.key.toLowerCase());
              const width = keyDef.width || 1;

              return (
                <motion.div
                  key={`${rowIndex}-${keyIndex}`}
                  className={cn(
                    "border-border bg-secondary shadow-pop-sm flex items-center justify-center rounded-lg border-2 text-xs font-bold transition-colors",
                    "h-10",
                    {
                      "bg-primary text-primary-foreground shadow-pop-press": isActive,
                    },
                  )}
                  style={{
                    flex: `0 0 calc(${width} * 3rem)`,
                  }}
                  animate={{
                    scale: isActive ? 0.95 : 1,
                    y: isActive ? 2 : 0,
                  }}
                  transition={{ duration: 0.08 }}
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
