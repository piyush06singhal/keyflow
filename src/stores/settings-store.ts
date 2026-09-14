/**
 * Settings Store
 *
 * Local, no-account app settings persisted to localStorage via Zustand.
 * Only appearance settings live here — typing and coding preferences are
 * managed by their own dedicated stores (`typing-practice-store.ts` and
 * `coding-practice-store.ts`).
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppearanceSettings {
  density: "compact" | "comfortable" | "spacious";
}

const defaultAppearance: AppearanceSettings = {
  density: "comfortable",
};

interface SettingsStore {
  appearance: AppearanceSettings;
  updateAppearance: (settings: Partial<AppearanceSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      appearance: defaultAppearance,

      updateAppearance: (settings) =>
        set((state) => ({ appearance: { ...state.appearance, ...settings } })),
    }),
    { name: "keyflow-settings-storage" },
  ),
);
