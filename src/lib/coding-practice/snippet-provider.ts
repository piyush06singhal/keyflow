/**
 * Code Snippet Provider
 * 
 * Provides code snippets for typing practice from various sources.
 * Supports static snippets, database snippets, and future AI generation.
 */

import type {
  CodeSnippet,
  SnippetFilter,
  SnippetProviderConfig,
  ProgrammingLanguage,
  CodingDifficulty,
  CodeSnippetMetadata,
} from "./types";
import { STATIC_SNIPPETS } from "./snippets/static-snippets";

export class SnippetProvider {
  /**
   * Get a snippet based on configuration
   */
  static async getSnippet(config: SnippetProviderConfig): Promise<CodeSnippet | null> {
    switch (config.source) {
      case "static":
        return this.getStaticSnippet(config.filter, config.random);
      
      case "database":
        return this.getDatabaseSnippet(config.filter);
      
      case "ai-generated":
        return this.getAIGeneratedSnippet(config.filter);
      
      case "community":
        return this.getCommunitySnippet(config.filter);
      
      case "interview":
        return this.getInterviewSnippet(config.filter);
      
      case "leetcode":
        return this.getLeetCodeSnippet(config.filter);
      
      case "custom":
        return null; // Handle custom snippets elsewhere
      
      default:
        return this.getStaticSnippet(config.filter, config.random);
    }
  }

  /**
   * Get multiple snippets
   */
  static async getSnippets(
    config: SnippetProviderConfig
  ): Promise<CodeSnippet[]> {
    const limit = config.limit || 10;
    const snippets: CodeSnippet[] = [];

    for (let i = 0; i < limit; i++) {
      const snippet = await this.getSnippet(config);
      if (snippet) {
        snippets.push(snippet);
      }
    }

    return snippets;
  }

  /**
   * Get static snippet
   */
  private static getStaticSnippet(
    filter?: SnippetFilter,
    random: boolean = true
  ): CodeSnippet | null {
    let filtered = STATIC_SNIPPETS;

    // Apply filters
    if (filter) {
      if (filter.language) {
        filtered = filtered.filter((s) => s.language === filter.language);
      }
      
      if (filter.framework) {
        filtered = filtered.filter((s) => s.framework === filter.framework);
      }
      
      if (filter.category) {
        filtered = filtered.filter((s) => s.category === filter.category);
      }
      
      if (filter.difficulty) {
        filtered = filtered.filter((s) => s.difficulty === filter.difficulty);
      }
      
      if (filter.type) {
        filtered = filtered.filter((s) => s.type === filter.type);
      }
      
      if (filter.tags && filter.tags.length > 0) {
        filtered = filtered.filter((s) =>
          filter.tags!.some((tag) => s.tags.includes(tag))
        );
      }
      
      if (filter.minLines) {
        filtered = filtered.filter(
          (s) => s.metadata.lineCount >= filter.minLines!
        );
      }
      
      if (filter.maxLines) {
        filtered = filtered.filter(
          (s) => s.metadata.lineCount <= filter.maxLines!
        );
      }
    }

    if (filtered.length === 0) {
      return null;
    }

    // Return random or first match
    if (random) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      return filtered[randomIndex] || null;
    }

    return filtered[0] || null;
  }

  /**
   * Get snippet from database (placeholder for future implementation)
   */
  private static async getDatabaseSnippet(
    filter?: SnippetFilter
  ): Promise<CodeSnippet | null> {
    try {
      // Import dynamically to avoid circular dependency
      const { getUserSnippets } = await import("@/lib/supabase/coding-practice");
      const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
      
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn("No user logged in, falling back to static snippets");
        return this.getStaticSnippet(filter);
      }

      const result = await getUserSnippets(user.id, {
        language: filter?.language,
        difficulty: filter?.difficulty,
        category: filter?.category,
      });

      if (result.success && result.data.length > 0) {
        const snippets = result.data;
        const randomIndex = Math.floor(Math.random() * snippets.length);
        return snippets[randomIndex] || null;
      }

      // Fallback to static if no database snippets
      return this.getStaticSnippet(filter);
    } catch (error) {
      console.error("Database snippet retrieval error:", error);
      return this.getStaticSnippet(filter);
    }
  }

  /**
   * Get AI-generated snippet (placeholder for future implementation)
   */
  private static async getAIGeneratedSnippet(
    filter?: SnippetFilter
  ): Promise<CodeSnippet | null> {
    try {
      // Import dynamically
      const { generateSnippetWithFallback } = await import("./ai-snippet-generator");

      const snippet = await generateSnippetWithFallback({
        language: filter?.language || "javascript",
        difficulty: filter?.difficulty || "beginner",
        category: filter?.category,
        framework: filter?.framework,
        lineCount: filter?.maxLines || 20,
      });

      return snippet;
    } catch (error) {
      console.error("AI snippet generation error:", error);
      return this.getStaticSnippet(filter);
    }
  }

  /**
   * Get community snippet (placeholder for future implementation)
   */
  private static async getCommunitySnippet(
    filter?: SnippetFilter
  ): Promise<CodeSnippet | null> {
    try {
      const { getCommunitySnippets } = await import("@/lib/supabase/coding-practice");

      const result = await getCommunitySnippets({
        language: filter?.language,
        difficulty: filter?.difficulty,
        limit: 10,
      });

      if (result.success && result.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * result.data.length);
        return result.data[randomIndex] || null;
      }

      return this.getStaticSnippet(filter);
    } catch (error) {
      console.error("Community snippet retrieval error:", error);
      return this.getStaticSnippet(filter);
    }
  }

  /**
   * Get interview question snippet (placeholder for future implementation)
   */
  private static async getInterviewSnippet(
    filter?: SnippetFilter
  ): Promise<CodeSnippet | null> {
    // TODO: Implement interview question snippets
    console.warn("Interview snippets not yet implemented");
    return this.getStaticSnippet(filter);
  }

  /**
   * Get LeetCode-style snippet (placeholder for future implementation)
   */
  private static async getLeetCodeSnippet(
    filter?: SnippetFilter
  ): Promise<CodeSnippet | null> {
    // TODO: Implement LeetCode-style snippets
    console.warn("LeetCode snippets not yet implemented");
    return this.getStaticSnippet(filter);
  }

  /**
   * Generate snippet metadata from code
   */
  static generateMetadata(
    code: string,
    language: ProgrammingLanguage
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
      conceptsCovered: [], // Will be populated by snippet definition
      fileExtension: this.getFileExtension(language),
    };
  }

  /**
   * Get file extension for language
   */
  private static getFileExtension(language: ProgrammingLanguage): string {
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

  /**
   * Create a custom snippet
   */
  static createCustomSnippet(
    code: string,
    language: ProgrammingLanguage,
    difficulty: CodingDifficulty,
    options?: {
      title?: string;
      description?: string;
      framework?: CodeSnippet["framework"];
      category?: CodeSnippet["category"];
      type?: CodeSnippet["type"];
      tags?: string[];
    }
  ): CodeSnippet {
    const metadata = this.generateMetadata(code, language);

    return {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: options?.title || "Custom Snippet",
      description: options?.description,
      language,
      framework: options?.framework,
      category: options?.category || "full-snippets",
      difficulty,
      type: options?.type || "full-code",
      code,
      metadata,
      tags: options?.tags || [],
    };
  }

  /**
   * Validate snippet format
   */
  static validateSnippet(snippet: CodeSnippet): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!snippet.id) {
      errors.push("Snippet must have an ID");
    }

    if (!snippet.code || snippet.code.trim().length === 0) {
      errors.push("Snippet code cannot be empty");
    }

    if (!snippet.language) {
      errors.push("Snippet must have a language");
    }

    if (!snippet.difficulty) {
      errors.push("Snippet must have a difficulty level");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
