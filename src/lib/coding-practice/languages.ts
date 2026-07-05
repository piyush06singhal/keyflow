/**
 * Programming Language Configurations
 * 
 * Defines all supported programming languages with their syntax features,
 * symbols, frameworks, and categories.
 */

import type { LanguageConfig, ProgrammingLanguage, Framework, CodingCategory } from "./types";

export const LANGUAGE_CONFIGS: Record<ProgrammingLanguage, LanguageConfig> = {
  javascript: {
    id: "javascript",
    name: "javascript",
    displayName: "JavaScript",
    fileExtension: ".js",
    icon: "FileCode",
    color: "#F7DF1E",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 2,
    commonSymbols: ["{", "}", "(", ")", "[", "]", ";", ":", ",", ".", "=>", "===", "!=="],
    bracketPairs: [
      ["{", "}"],
      ["(", ")"],
      ["[", "]"],
    ],
    commentStyle: {
      line: "//",
      blockStart: "/*",
      blockEnd: "*/",
    },
    frameworks: ["react", "nextjs", "nodejs", "express", "none"],
    categories: [
      "basic-syntax",
      "variables",
      "functions",
      "loops",
      "conditionals",
      "arrays",
      "objects",
      "error-handling",
      "algorithms",
      "api-calls",
      "full-snippets",
    ],
  },

  typescript: {
    id: "typescript",
    name: "typescript",
    displayName: "TypeScript",
    fileExtension: ".ts",
    icon: "FileCode",
    color: "#3178C6",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 2,
    commonSymbols: ["{", "}", "(", ")", "[", "]", ";", ":", ",", ".", "=>", "===", "!==", "<", ">"],
    bracketPairs: [
      ["{", "}"],
      ["(", ")"],
      ["[", "]"],
      ["<", ">"],
    ],
    commentStyle: {
      line: "//",
      blockStart: "/*",
      blockEnd: "*/",
    },
    frameworks: ["react", "nextjs", "nodejs", "express", "angular", "none"],
    categories: [
      "basic-syntax",
      "variables",
      "functions",
      "loops",
      "conditionals",
      "arrays",
      "objects",
      "classes",
      "error-handling",
      "algorithms",
      "api-calls",
      "full-snippets",
    ],
  },

  python: {
    id: "python",
    name: "python",
    displayName: "Python",
    fileExtension: ".py",
    icon: "FileCode",
    color: "#3776AB",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 4,
    commonSymbols: ["(", ")", "[", "]", ":", ",", ".", "==", "!=", "->"],
    bracketPairs: [
      ["(", ")"],
      ["[", "]"],
      ["{", "}"],
    ],
    commentStyle: {
      line: "#",
      blockStart: '"""',
      blockEnd: '"""',
    },
    frameworks: ["django", "flask", "none"],
    categories: [
      "basic-syntax",
      "variables",
      "functions",
      "loops",
      "conditionals",
      "arrays",
      "objects",
      "classes",
      "error-handling",
      "algorithms",
      "data-structures",
      "api-calls",
      "full-snippets",
    ],
  },

  java: {
    id: "java",
    name: "java",
    displayName: "Java",
    fileExtension: ".java",
    icon: "FileCode",
    color: "#007396",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 4,
    commonSymbols: ["{", "}", "(", ")", "[", "]", ";", ":", ",", ".", "<", ">"],
    bracketPairs: [
      ["{", "}"],
      ["(", ")"],
      ["[", "]"],
      ["<", ">"],
    ],
    commentStyle: {
      line: "//",
      blockStart: "/*",
      blockEnd: "*/",
    },
    frameworks: ["spring", "none"],
    categories: [
      "basic-syntax",
      "variables",
      "functions",
      "loops",
      "conditionals",
      "arrays",
      "objects",
      "classes",
      "error-handling",
      "algorithms",
      "data-structures",
      "full-snippets",
    ],
  },

  cpp: {
    id: "cpp",
    name: "cpp",
    displayName: "C++",
    fileExtension: ".cpp",
    icon: "FileCode",
    color: "#00599C",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 2,
    commonSymbols: ["{", "}", "(", ")", "[", "]", ";", ":", ",", ".", "->", "<<", ">>", "<", ">"],
    bracketPairs: [
      ["{", "}"],
      ["(", ")"],
      ["[", "]"],
      ["<", ">"],
    ],
    commentStyle: {
      line: "//",
      blockStart: "/*",
      blockEnd: "*/",
    },
    frameworks: ["none"],
    categories: [
      "basic-syntax",
      "variables",
      "functions",
      "loops",
      "conditionals",
      "arrays",
      "objects",
      "classes",
      "algorithms",
      "data-structures",
      "full-snippets",
    ],
  },

  c: {
    id: "c",
    name: "c",
    displayName: "C",
    fileExtension: ".c",
    icon: "FileCode",
    color: "#A8B9CC",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 2,
    commonSymbols: ["{", "}", "(", ")", "[", "]", ";", ":", ",", ".", "->", "*", "&"],
    bracketPairs: [
      ["{", "}"],
      ["(", ")"],
      ["[", "]"],
    ],
    commentStyle: {
      line: "//",
      blockStart: "/*",
      blockEnd: "*/",
    },
    frameworks: ["none"],
    categories: [
      "basic-syntax",
      "variables",
      "functions",
      "loops",
      "conditionals",
      "arrays",
      "algorithms",
      "data-structures",
      "full-snippets",
    ],
  },

  go: {
    id: "go",
    name: "go",
    displayName: "Go",
    fileExtension: ".go",
    icon: "FileCode",
    color: "#00ADD8",
    hasIndentation: true,
    indentationStyle: "tabs",
    defaultIndentation: 1,
    commonSymbols: ["{", "}", "(", ")", "[", "]", ":", ",", ".", ":=", "<-", "->"],
    bracketPairs: [
      ["{", "}"],
      ["(", ")"],
      ["[", "]"],
    ],
    commentStyle: {
      line: "//",
      blockStart: "/*",
      blockEnd: "*/",
    },
    frameworks: ["none"],
    categories: [
      "basic-syntax",
      "variables",
      "functions",
      "loops",
      "conditionals",
      "arrays",
      "error-handling",
      "algorithms",
      "full-snippets",
    ],
  },

  rust: {
    id: "rust",
    name: "rust",
    displayName: "Rust",
    fileExtension: ".rs",
    icon: "FileCode",
    color: "#CE422B",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 4,
    commonSymbols: ["{", "}", "(", ")", "[", "]", ";", ":", ",", ".", "->", "=>", "|", "&", "*"],
    bracketPairs: [
      ["{", "}"],
      ["(", ")"],
      ["[", "]"],
      ["<", ">"],
    ],
    commentStyle: {
      line: "//",
      blockStart: "/*",
      blockEnd: "*/",
    },
    frameworks: ["none"],
    categories: [
      "basic-syntax",
      "variables",
      "functions",
      "loops",
      "conditionals",
      "arrays",
      "error-handling",
      "algorithms",
      "data-structures",
      "full-snippets",
    ],
  },

  sql: {
    id: "sql",
    name: "sql",
    displayName: "SQL",
    fileExtension: ".sql",
    icon: "Database",
    color: "#CC2927",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 2,
    commonSymbols: ["(", ")", ",", ".", ";", "*", "=", "<", ">"],
    bracketPairs: [
      ["(", ")"],
    ],
    commentStyle: {
      line: "--",
      blockStart: "/*",
      blockEnd: "*/",
    },
    frameworks: ["none"],
    categories: [
      "basic-syntax",
      "sql-queries",
      "full-snippets",
    ],
  },

  html: {
    id: "html",
    name: "html",
    displayName: "HTML",
    fileExtension: ".html",
    icon: "FileCode",
    color: "#E34F26",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 2,
    commonSymbols: ["<", ">", "/", "=", '"', "'"],
    bracketPairs: [
      ["<", ">"],
      ['"', '"'],
      ["'", "'"],
    ],
    commentStyle: {
      blockStart: "<!--",
      blockEnd: "-->",
    },
    frameworks: ["none"],
    categories: [
      "basic-syntax",
      "html-layouts",
      "full-snippets",
    ],
  },

  css: {
    id: "css",
    name: "css",
    displayName: "CSS",
    fileExtension: ".css",
    icon: "FileCode",
    color: "#1572B6",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 2,
    commonSymbols: ["{", "}", ":", ";", ",", ".", "#", "(", ")"],
    bracketPairs: [
      ["{", "}"],
      ["(", ")"],
    ],
    commentStyle: {
      blockStart: "/*",
      blockEnd: "*/",
    },
    frameworks: ["tailwind", "none"],
    categories: [
      "basic-syntax",
      "css-styling",
      "full-snippets",
    ],
  },

  json: {
    id: "json",
    name: "json",
    displayName: "JSON",
    fileExtension: ".json",
    icon: "FileCode",
    color: "#000000",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 2,
    commonSymbols: ["{", "}", "[", "]", ":", ",", '"'],
    bracketPairs: [
      ["{", "}"],
      ["[", "]"],
      ['"', '"'],
    ],
    commentStyle: {},
    frameworks: ["none"],
    categories: [
      "basic-syntax",
      "config-files",
      "full-snippets",
    ],
  },

  markdown: {
    id: "markdown",
    name: "markdown",
    displayName: "Markdown",
    fileExtension: ".md",
    icon: "FileText",
    color: "#083FA1",
    hasIndentation: false,
    indentationStyle: "spaces",
    defaultIndentation: 0,
    commonSymbols: ["#", "*", "_", "[", "]", "(", ")", "`", "-"],
    bracketPairs: [
      ["[", "]"],
      ["(", ")"],
      ["`", "`"],
    ],
    commentStyle: {},
    frameworks: ["none"],
    categories: [
      "basic-syntax",
      "full-snippets",
    ],
  },

  bash: {
    id: "bash",
    name: "bash",
    displayName: "Bash",
    fileExtension: ".sh",
    icon: "Terminal",
    color: "#4EAA25",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 2,
    commonSymbols: ["$", "(", ")", "[", "]", "{", "}", "|", "&", ">", "<", ";"],
    bracketPairs: [
      ["(", ")"],
      ["[", "]"],
      ["{", "}"],
      ['"', '"'],
      ["'", "'"],
    ],
    commentStyle: {
      line: "#",
    },
    frameworks: ["none"],
    categories: [
      "basic-syntax",
      "terminal-commands",
      "full-snippets",
    ],
  },

  docker: {
    id: "docker",
    name: "docker",
    displayName: "Docker",
    fileExtension: "Dockerfile",
    icon: "Container",
    color: "#2496ED",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 2,
    commonSymbols: ["$", "{", "}", "[", "]", "\\", '"'],
    bracketPairs: [
      ["{", "}"],
      ["[", "]"],
      ['"', '"'],
    ],
    commentStyle: {
      line: "#",
    },
    frameworks: ["none"],
    categories: [
      "basic-syntax",
      "config-files",
      "full-snippets",
    ],
  },

  yaml: {
    id: "yaml",
    name: "yaml",
    displayName: "YAML",
    fileExtension: ".yaml",
    icon: "FileCode",
    color: "#CB171E",
    hasIndentation: true,
    indentationStyle: "spaces",
    defaultIndentation: 2,
    commonSymbols: [":", "-", "[", "]", "{", "}", "|", ">"],
    bracketPairs: [
      ["[", "]"],
      ["{", "}"],
      ['"', '"'],
      ["'", "'"],
    ],
    commentStyle: {
      line: "#",
    },
    frameworks: ["none"],
    categories: [
      "basic-syntax",
      "config-files",
      "full-snippets",
    ],
  },

  git: {
    id: "git",
    name: "git",
    displayName: "Git Commands",
    fileExtension: ".git",
    icon: "GitBranch",
    color: "#F05032",
    hasIndentation: false,
    indentationStyle: "spaces",
    defaultIndentation: 0,
    commonSymbols: ["-", "--", ".", "/", ":"],
    bracketPairs: [],
    commentStyle: {
      line: "#",
    },
    frameworks: ["none"],
    categories: [
      "git-commands",
      "terminal-commands",
    ],
  },
};

// Helper functions
export function getLanguageConfig(language: ProgrammingLanguage): LanguageConfig {
  return LANGUAGE_CONFIGS[language];
}

export function getAllLanguages(): LanguageConfig[] {
  return Object.values(LANGUAGE_CONFIGS);
}

export function getLanguagesByFramework(framework: Framework): LanguageConfig[] {
  return getAllLanguages().filter((lang) => lang.frameworks.includes(framework));
}

export function getLanguagesByCategory(category: CodingCategory): LanguageConfig[] {
  return getAllLanguages().filter((lang) => lang.categories.includes(category));
}

export function getLanguageColor(language: ProgrammingLanguage): string {
  return LANGUAGE_CONFIGS[language]?.color || "#000000";
}

export function getLanguageIcon(language: ProgrammingLanguage): string {
  return LANGUAGE_CONFIGS[language]?.icon || "FileCode";
}
