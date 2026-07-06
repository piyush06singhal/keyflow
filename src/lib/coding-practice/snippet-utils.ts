import type { ProgrammingLanguage, CodeSnippetMetadata } from "./types";

export function getFileExtension(language: ProgrammingLanguage): string {
  const extensions: Record<ProgrammingLanguage, string> = {
    javascript: ".js",
    typescript: ".ts",
    python: ".py",
    java: ".java",
    cpp: ".cpp",
    c: ".c",
    go: ".go",
    rust: ".rs",
    sql: ".sql",
    html: ".html",
    css: ".css",
    json: ".json",
    markdown: ".md",
    bash: ".sh",
    docker: "Dockerfile",
    yaml: ".yaml",
    git: "",
  };

  return extensions[language] || "";
}

export function generateMetadata(
  code: string,
  language: ProgrammingLanguage,
): CodeSnippetMetadata {
  const lines = code.split("\n");
  const lineCount = lines.length;
  const characterCount = code.length;

  // Detect indentation
  const indentedLines = lines.filter((line) => /^[\t ]/.test(line));
  const hasIndentation = indentedLines.length > 0;

  let indentationType: "spaces" | "tabs" = "spaces";
  let spacesPerTab = 2;

  if (hasIndentation) {
    const firstIndented = indentedLines[0] || "";
    indentationType = firstIndented.startsWith("\t") ? "tabs" : "spaces";

    if (indentationType === "spaces") {
      const match = firstIndented.match(/^ +/);
      if (match) {
        spacesPerTab = match[0].length;
      }
    }
  }

  // Calculate max indentation level
  let maxIndentation = 0;
  lines.forEach((line) => {
    const match = line.match(/^[\t ]*/);
    if (match) {
      const indent = match[0];
      const level =
        indentationType === "tabs"
          ? indent.length
          : Math.floor(indent.length / spacesPerTab);
      maxIndentation = Math.max(maxIndentation, level);
    }
  });

  // Check for special characters
  const hasBrackets = /[{}[\]()]/.test(code);
  const hasQuotes = /['"`]/.test(code);
  const hasSpecialChars = /[!@#$%^&*+=|\\/<>?~]/.test(code);

  // Estimate complexity
  let syntaxComplexity: "simple" | "moderate" | "complex" = "simple";
  if (maxIndentation > 3 || lineCount > 30) {
    syntaxComplexity = "complex";
  } else if (maxIndentation > 1 || lineCount > 15) {
    syntaxComplexity = "moderate";
  }

  // Estimate duration (based on character count and complexity)
  const baseWPM = 40; // Conservative estimate for code typing
  const wordsEstimate = characterCount / 5;
  const estimatedDuration = Math.ceil((wordsEstimate / baseWPM) * 60);

  return {
    lineCount,
    characterCount,
    estimatedDuration,
    hasIndentation,
    indentationLevel: maxIndentation,
    indentationType,
    spacesPerTab,
    hasBrackets,
    hasQuotes,
    hasSpecialChars,
    syntaxComplexity,
    conceptsCovered: [],
    fileExtension: getFileExtension(language),
  };
}
