import { create } from "zustand";
import type { PracticeMode, TimerMode } from "@/lib/typing-engine";

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
  showLiveWpm: boolean;
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
  allowBackspace: true,
  blindMode: false,
  strictMode: false,
};

const defaultUISettings: PracticeUISettings = {
  fontSize: "lg",
  fontFamily: "mono",
  cursorStyle: "line",
  showLiveWpm: true,
  showKeyboard: true,
  keyboardLayout: "ansi",
  soundEnabled: false,
  reducedMotion: false,
  highContrast: false,
};

export const useTypingPracticeStore = create<TypingPracticeState>((set) => ({
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
}));
