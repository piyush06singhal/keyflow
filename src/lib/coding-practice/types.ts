/**
 * Coding Practice - Type Definitions
 * 
 * Type definitions for the developer coding practice module.
 * Extends the base typing engine with programming-specific features.
 */

import type { TypingEngineConfig, SessionResult } from "@/lib/typing-engine";

// ============================================================================
// Programming Language Types
// ============================================================================

export type ProgrammingLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp"
  | "c"
  | "go"
  | "rust"
  | "sql"
  | "html"
  | "css"
  | "json"
  | "markdown"
  | "bash"
  | "docker"
  | "yaml"
  | "git";

export type Framework =
  | "react"
  | "nextjs"
  | "nodejs"
  | "express"
  | "tailwind"
  | "vue"
  | "angular"
  | "django"
  | "flask"
  | "spring"
  | "none";

export type CodingDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

// ============================================================================
// Coding Practice Categories
// ============================================================================

export type CodingCategory =
  | "basic-syntax"
  | "variables"
  | "functions"
  | "loops"
  | "conditionals"
  | "arrays"
  | "objects"
  | "classes"
  | "error-handling"
  | "algorithms"
  | "data-structures"
  | "sql-queries"
  | "html-layouts"
  | "css-styling"
  | "react-components"
  | "api-calls"
  | "file-structures"
  | "config-files"
  | "git-commands"
  | "terminal-commands"
  | "full-snippets";

export type SnippetType =
  | "syntax"
  | "function"
  | "component"
  | "class"
  | "interface"
  | "algorithm"
  | "query"
  | "config"
  | "command"
  | "full-code";

// ============================================================================
// Code Snippet Types
// ============================================================================

export interface CodeSnippet {
  id: string;
  title: string;
  description?: string;
  language: ProgrammingLanguage;
  framework?: Framework;
  category: CodingCategory;
  difficulty: CodingDifficulty;
  type: SnippetType;
  code: string;
  metadata: CodeSnippetMetadata;
  tags: string[];
}

export interface CodeSnippetMetadata {
  lineCount: number;
  characterCount: number;
  estimatedDuration: number; // in seconds
  hasIndentation: boolean;
  indentationLevel: number;
  indentationType: "spaces" | "tabs";
  spacesPerTab: number;
  hasBrackets: boolean;
  hasQuotes: boolean;
  hasSpecialChars: boolean;
  syntaxComplexity: "simple" | "moderate" | "complex";
  conceptsCovered: string[];
  fileExtension: string;
}

// ============================================================================
// Coding Practice Configuration
// ============================================================================

export interface CodingPracticeConfig extends Omit<Partial<TypingEngineConfig>, 'language'> {
  // Coding-specific settings
  language: ProgrammingLanguage;
  framework?: Framework;
  category?: CodingCategory;
  difficulty: CodingDifficulty;
  snippetType?: SnippetType;
  snippetSource?: SnippetSource;
  
  // Code display settings
  showLineNumbers: boolean;
  showIndentation: boolean;
  showMinimap: boolean;
  enableSyntaxHighlighting: boolean;
  
  // Code editor theme
  codeTheme: CodeTheme;
  
  // Indentation settings
  indentWithTabs: boolean;
  tabSize: number;
  
  // Typography
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  
  // Advanced features (future)
  enableAIGeneration?: boolean;
  enableInterviewMode?: boolean;
  enableDebugMode?: boolean;
  enableMultiplayer?: boolean;
}

export type CodeTheme =
  | "vs-dark"
  | "vs-light"
  | "github-dark"
  | "github-light"
  | "dracula"
  | "monokai"
  | "nord"
  | "solarized-dark"
  | "solarized-light"
  | "one-dark"
  | "one-light";

// ============================================================================
// Coding Statistics Types
// ============================================================================

export interface CodingStatistics {
  // Base typing stats
  wpm: number;
  rawWpm: number;
  accuracy: number;
  
  // Code-specific stats
  correctLines: number;
  incorrectLines: number;
  totalLines: number;
  lineAccuracy: number;
  
  // Symbol accuracy
  bracketAccuracy: number;
  indentationAccuracy: number;
  symbolAccuracy: number;
  quoteAccuracy: number;
  
  // Programming syntax accuracy
  syntaxAccuracy: number;
  keywordAccuracy: number;
  operatorAccuracy: number;
  
  // Performance
  averageLineTime: number; // milliseconds per line
  fastestLine: { line: number; time: number } | null;
  slowestLine: { line: number; time: number } | null;
}

// ============================================================================
// Coding Session Result
// ============================================================================

export interface CodingSessionResult extends SessionResult {
  // Coding-specific data
  language: ProgrammingLanguage;
  framework?: Framework;
  category?: CodingCategory;
  snippetId: string;
  codingStats: CodingStatistics;
  
  // Line-by-line analysis
  lineStats: LineStatistic[];
  
  // Symbol analysis
  symbolStats: Map<string, {
    total: number;
    correct: number;
    incorrect: number;
    accuracy: number;
  }>;
  
  // Concept mastery (for future AI features)
  conceptsCovered: string[];
  conceptMastery?: Map<string, number>; // concept -> mastery percentage
}

export interface LineStatistic {
  lineNumber: number;
  content: string;
  startTime: number;
  endTime: number;
  duration: number;
  characterCount: number;
  correctChars: number;
  incorrectChars: number;
  accuracy: number;
  wpm: number;
}

// ============================================================================
// Snippet Provider Types
// ============================================================================

export type SnippetSource =
  | "static"
  | "database"
  | "ai-generated"
  | "community"
  | "interview"
  | "leetcode"
  | "custom";

export interface SnippetFilter {
  language?: ProgrammingLanguage;
  framework?: Framework;
  category?: CodingCategory;
  difficulty?: CodingDifficulty;
  type?: SnippetType;
  tags?: string[];
  minLines?: number;
  maxLines?: number;
  source?: SnippetSource;
}

export interface SnippetProviderConfig {
  source: SnippetSource;
  filter?: SnippetFilter;
  limit?: number;
  random?: boolean;
}

// ============================================================================
// UI Component Props Types
// ============================================================================

export interface CodingDashboardState {
  language: ProgrammingLanguage;
  framework?: Framework;
  difficulty: CodingDifficulty;
  category?: CodingCategory;
  duration: number;
  timerMode: "countdown" | "elapsed" | "untimed";
}

export interface CodeEditorSettings {
  theme: CodeTheme;
  showLineNumbers: boolean;
  showMinimap: boolean;
  fontSize: number;
  lineHeight: number;
  tabSize: number;
  indentWithTabs: boolean;
  fontFamily: string;
}

// ============================================================================
// Future Extension Points
// ============================================================================

export interface AIGenerationConfig {
  model: "groq" | "gemini";
  difficulty: CodingDifficulty;
  topic?: string;
  style?: "tutorial" | "interview" | "project";
  maxTokens?: number;
}

export interface InterviewPrepConfig {
  company?: string;
  position?: string;
  topics: string[];
  difficulty: CodingDifficulty;
  includeExplanations: boolean;
}

export interface MultiplayerConfig {
  roomId: string;
  maxPlayers: number;
  raceMode: "first-to-finish" | "time-based" | "accuracy-based";
  allowSpectators: boolean;
}

// ============================================================================
// Language Configuration
// ============================================================================

export interface LanguageConfig {
  id: ProgrammingLanguage;
  name: string;
  displayName: string;
  fileExtension: string;
  icon: string; // Icon name for lucide-react or custom icon
  color: string; // Hex color for badges
  
  // Syntax features
  hasIndentation: boolean;
  indentationStyle: "spaces" | "tabs" | "both";
  defaultIndentation: number;
  
  // Common symbols
  commonSymbols: string[];
  bracketPairs: Array<[string, string]>;
  commentStyle: {
    line?: string;
    blockStart?: string;
    blockEnd?: string;
  };
  
  // Frameworks available
  frameworks: Framework[];
  
  // Categories available
  categories: CodingCategory[];
}

// ============================================================================
// Store Types
// ============================================================================

export interface CodingPracticeStore {
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
  resetConfig: () => void;
}
