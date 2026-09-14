import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PracticeMode, TimerMode, Difficulty } from "@/lib/typing-engine";

export type PracticeCategory =
  "general" | "science" | "technology" | "business" | "literature";

/**
 * Typing Practice Store
 *
 * Centralized state management for typing practice UI configuration.
 * The actual typing logic lives in TypingEngine - this store only manages UI preferences.
 */

export type KeyboardLayoutVariant = "ansi" | "iso" | "tkl" | "full";

export interface PracticeConfig {
  // Practice settings
  mode: PracticeMode;
  timerMode: TimerMode;
  duration: number;

  // Content settings
  includePunctuation: boolean;
  includeNumbers: boolean;
  includeCapitalization: boolean;
  wordCount: number;
  customText?: string;
  useAiText: boolean;
  difficulty: Difficulty;
  category: PracticeCategory;

  // Features
  allowBackspace: boolean;
  blindMode: boolean;
  strictMode: boolean;
}

export interface PracticeUISettings {
  // Visual settings
  fontSize: "sm" | "base" | "lg" | "xl";
  fontFamily: "mono" | "sans" | "serif";
  cursorStyle: "line" | "block" | "underline";

  // Display options
  showKeyboard: boolean;
  keyboardLayout: KeyboardLayoutVariant;

  // Accessibility
  soundEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface PracticeViewMode {
  mode: "default" | "focus" | "zen";
}

interface TypingPracticeState {
  // Configuration
  config: PracticeConfig;
  uiSettings: PracticeUISettings;
  viewMode: PracticeViewMode;

  // UI state
  settingsOpen: boolean;
  resultsOpen: boolean;

  // Actions
  updateConfig: (config: Partial<PracticeConfig>) => void;
  updateUISettings: (settings: Partial<PracticeUISettings>) => void;
  setViewMode: (mode: PracticeViewMode["mode"]) => void;
  setSettingsOpen: (open: boolean) => void;
  setResultsOpen: (open: boolean) => void;
  resetToDefaults: () => void;
}

const defaultConfig: PracticeConfig = {
  mode: "word",
  timerMode: "countdown",
  duration: 60,
  includePunctuation: false,
  includeNumbers: false,
  includeCapitalization: false,
  wordCount: 50,
  useAiText: true,
  difficulty: "intermediate",
  category: "general",
  allowBackspace: true,
  blindMode: false,
  strictMode: false,
};

const defaultUISettings: PracticeUISettings = {
  fontSize: "lg",
  fontFamily: "mono",
  cursorStyle: "line",
  showKeyboard: true,
  keyboardLayout: "ansi",
  soundEnabled: false,
  reducedMotion: false,
  highContrast: false,
};

export const useTypingPracticeStore = create<TypingPracticeState>()(
  persist(
    (set) => ({
      // Initial state
      config: defaultConfig,
      uiSettings: defaultUISettings,
      viewMode: { mode: "default" },
      settingsOpen: false,
      resultsOpen: false,

      // Actions
      updateConfig: (config) =>
        set((state) => ({
          config: { ...state.config, ...config },
        })),

      updateUISettings: (settings) =>
        set((state) => ({
          uiSettings: { ...state.uiSettings, ...settings },
        })),

      setViewMode: (mode) => set({ viewMode: { mode } }),

      setSettingsOpen: (open) => set({ settingsOpen: open }),

      setResultsOpen: (open) => set({ resultsOpen: open }),

      resetToDefaults: () =>
        set({
          config: defaultConfig,
          uiSettings: defaultUISettings,
          viewMode: { mode: "default" },
        }),
    }),
    {
      name: "typing-practice-storage",
      partialize: (state) => ({
        config: state.config,
        uiSettings: state.uiSettings,
      }),
      // Deep-merge persisted config/uiSettings over the current defaults so
      // fields added after a user already has a saved config (e.g. difficulty,
      // category) still get a valid default instead of `undefined`.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<
          Pick<TypingPracticeState, "config" | "uiSettings">
        >;
        return {
          ...current,
          config: { ...current.config, ...p.config },
          uiSettings: { ...current.uiSettings, ...p.uiSettings },
        };
      },
    },
  ),
);
