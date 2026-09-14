/**
 * Coding Practice Store
 *
 * Global state management for coding practice module using Zustand.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CodingPracticeConfig,
  CodeSnippet,
  ProgrammingLanguage,
  Framework,
  CodingDifficulty,
  CodingCategory,
  CodeTheme,
} from "@/lib/coding-practice/types";

interface CodingPracticeStore {
  // Configuration
  config: CodingPracticeConfig;

  // UI State
  selectedSnippet: CodeSnippet | null;
  isConfigDrawerOpen: boolean;
  isLoading: boolean;

  // Actions
  setLanguage: (language: ProgrammingLanguage) => void;
  setFramework: (framework: Framework | undefined) => void;
  setDifficulty: (difficulty: CodingDifficulty) => void;
  setCategory: (category: CodingCategory | undefined) => void;
  setCodeTheme: (theme: CodeTheme) => void;
  updateConfig: (config: Partial<CodingPracticeConfig>) => void;
  setSelectedSnippet: (snippet: CodeSnippet | null) => void;
  setConfigDrawerOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  resetConfig: () => void;
}

const DEFAULT_CONFIG: CodingPracticeConfig = {
  // Mode settings (from typing engine)
  timerMode: "countdown",
  duration: 300, // 5 minutes default

  // Feature flags
  allowBackspace: true,
  strictMode: true,

  // Accessibility
  soundEnabled: true,

  // Coding-specific settings
  language: "javascript",
  framework: undefined,
  category: undefined,
  difficulty: "beginner",
  // Matches typing practice's default of AI-generated content (useAiText: true)
  snippetSource: "ai-generated",

  // Code display
  showLineNumbers: true,

  // Code theme
  codeTheme: "vs-dark",

  // Typography
  fontFamily: "JetBrains Mono, Fira Code, Consolas, monospace",
  fontSize: 14,
  lineHeight: 1.6,
};

export const useCodingPracticeStore = create<CodingPracticeStore>()(
  persist(
    (set) => ({
      // Initial state
      config: DEFAULT_CONFIG,
      selectedSnippet: null,
      isConfigDrawerOpen: false,
      isLoading: false,

      // Actions
      setLanguage: (language) =>
        set((state) => ({
          config: { ...state.config, language },
        })),

      setFramework: (framework) =>
        set((state) => ({
          config: { ...state.config, framework },
        })),

      setDifficulty: (difficulty) =>
        set((state) => ({
          config: { ...state.config, difficulty },
        })),

      setCategory: (category) =>
        set((state) => ({
          config: { ...state.config, category },
        })),

      setCodeTheme: (codeTheme) =>
        set((state) => ({
          config: { ...state.config, codeTheme },
        })),

      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),

      setSelectedSnippet: (snippet) => set({ selectedSnippet: snippet }),

      setConfigDrawerOpen: (open) => set({ isConfigDrawerOpen: open }),

      setLoading: (loading) => set({ isLoading: loading }),

      resetConfig: () =>
        set({
          config: DEFAULT_CONFIG,
          selectedSnippet: null,
        }),
    }),
    {
      name: "coding-practice-storage",
      partialize: (state) => ({
        config: state.config,
      }),
      // Deep-merge persisted config over the current defaults so fields
      // added after a user already has a saved config (e.g. snippetSource)
      // still get a valid default instead of silently staying undefined —
      // otherwise a stale persisted config permanently overrides new
      // defaults for anyone who already has one saved.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Pick<CodingPracticeStore, "config">>;
        return {
          ...current,
          config: { ...current.config, ...p.config },
        };
      },
    },
  ),
);
