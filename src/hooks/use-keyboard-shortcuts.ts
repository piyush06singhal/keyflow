import { useEffect } from "react";

/**
 * Keyboard Shortcuts Hook
 * 
 * Handles global keyboard shortcuts for typing practice actions.
 */

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl === undefined || shortcut.ctrl === (e.ctrlKey || e.metaKey);
        const altMatch = shortcut.alt === undefined || shortcut.alt === e.altKey;
        const metaMatch = shortcut.meta === undefined || shortcut.meta === e.metaKey;
        const shiftMatch = shortcut.shift === undefined || shortcut.shift === e.shiftKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        
        if (ctrlMatch && altMatch && metaMatch && shiftMatch && keyMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts, enabled]);
}

/**
 * Default shortcuts for typing practice
 */
export const TYPING_SHORTCUTS = {
  RESTART: { key: "r", ctrl: true, description: "Restart practice" },
  PAUSE: { key: " ", ctrl: true, description: "Pause/Resume" },
  SETTINGS: { key: ",", ctrl: true, description: "Open settings" },
  FOCUS_MODE: { key: "f", ctrl: true, description: "Toggle focus mode" },
  ZEN_MODE: { key: "z", ctrl: true, description: "Toggle zen mode" },
  KEYBOARD: { key: "k", ctrl: true, description: "Toggle keyboard" },
} as const;
