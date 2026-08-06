import type { CodeTheme } from "./types";

export interface CodeThemeColors {
  background: string;
  text: string;
  muted: string;
  activeLine: string;
}

export const CODE_THEME_COLORS: Record<CodeTheme, CodeThemeColors> = {
  "vs-dark": {
    background: "#1e1e1e",
    text: "#d4d4d4",
    muted: "#858585",
    activeLine: "#2a2a2a",
  },
  "vs-light": {
    background: "#ffffff",
    text: "#1e1e1e",
    muted: "#6e6e6e",
    activeLine: "#f0f0f0",
  },
  "github-dark": {
    background: "#0d1117",
    text: "#c9d1d9",
    muted: "#6e7681",
    activeLine: "#161b22",
  },
  "github-light": {
    background: "#ffffff",
    text: "#24292f",
    muted: "#6e7781",
    activeLine: "#f6f8fa",
  },
  dracula: {
    background: "#282a36",
    text: "#f8f8f2",
    muted: "#6272a4",
    activeLine: "#343746",
  },
  monokai: {
    background: "#272822",
    text: "#f8f8f2",
    muted: "#75715e",
    activeLine: "#3e3d32",
  },
  nord: {
    background: "#2e3440",
    text: "#d8dee9",
    muted: "#4c566a",
    activeLine: "#3b4252",
  },
  "solarized-dark": {
    background: "#002b36",
    text: "#839496",
    muted: "#586e75",
    activeLine: "#073642",
  },
  "solarized-light": {
    background: "#fdf6e3",
    text: "#657b83",
    muted: "#93a1a1",
    activeLine: "#eee8d5",
  },
  "one-dark": {
    background: "#282c34",
    text: "#abb2bf",
    muted: "#5c6370",
    activeLine: "#2c313c",
  },
  "one-light": {
    background: "#fafafa",
    text: "#383a42",
    muted: "#a0a1a7",
    activeLine: "#f0f0f1",
  },
};

export function getCodeThemeColors(theme: CodeTheme): CodeThemeColors {
  return CODE_THEME_COLORS[theme] ?? CODE_THEME_COLORS["vs-dark"];
}
