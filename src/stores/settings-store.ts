/**
 * Settings Store
 *
 * Local, no-account app settings (appearance/typing/coding preferences),
 * persisted to localStorage via Zustand — replaces the previous
 * Supabase-backed SettingsProvider.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  density: "compact" | "comfortable" | "spacious";
  animationIntensity: "none" | "reduced" | "normal";
  accentColor: string;
  fontFamily: string;
  codeFont: string;
}

export interface TypingSettings {
  defaultDuration: number;
  preferredMode: "time" | "words" | "quote";
  soundsEnabled: boolean;
  caretStyle: "block" | "line" | "underline";
  showVirtualKeyboard: boolean;
}

export interface CodingSettings {
  defaultLanguage: string;
  tabWidth: number;
  lineNumbers: boolean;
  minimap: boolean;
  codeTheme: string;
}

const defaultAppearance: AppearanceSettings = {
  theme: "system",
  density: "comfortable",
  animationIntensity: "normal",
  accentColor: "default",
  fontFamily: "inter",
  codeFont: "fira_code",
};

const defaultTyping: TypingSettings = {
  defaultDuration: 60,
  preferredMode: "time",
  soundsEnabled: true,
  caretStyle: "block",
  showVirtualKeyboard: false,
};

const defaultCoding: CodingSettings = {
  defaultLanguage: "typescript",
  tabWidth: 2,
  lineNumbers: true,
  minimap: false,
  codeTheme: "vs-dark",
};

interface SettingsStore {
  appearance: AppearanceSettings;
  typing: TypingSettings;
  coding: CodingSettings;
  updateAppearance: (settings: Partial<AppearanceSettings>) => void;
  updateTyping: (settings: Partial<TypingSettings>) => void;
  updateCoding: (settings: Partial<CodingSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      appearance: defaultAppearance,
      typing: defaultTyping,
      coding: defaultCoding,

      updateAppearance: (settings) =>
        set((state) => ({ appearance: { ...state.appearance, ...settings } })),

      updateTyping: (settings) =>
        set((state) => ({ typing: { ...state.typing, ...settings } })),

      updateCoding: (settings) =>
        set((state) => ({ coding: { ...state.coding, ...settings } })),

      resetSettings: () =>
        set({
          appearance: defaultAppearance,
          typing: defaultTyping,
          coding: defaultCoding,
        }),
    }),
    { name: "keyflow-settings-storage" },
  ),
);
