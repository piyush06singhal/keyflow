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
} from "./types";
import { STATIC_SNIPPETS } from "./snippets/static-snippets";
import { generateMetadata } from "./snippet-utils";

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
  static async getSnippets(config: SnippetProviderConfig): Promise<CodeSnippet[]> {
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
    random: boolean = true,
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
          filter.tags!.some((tag) => s.tags.includes(tag)),
        );
      }

      if (filter.minLines) {
        filtered = filtered.filter((s) => s.metadata.lineCount >= filter.minLines!);
      }

      if (filter.maxLines) {
        filtered = filtered.filter((s) => s.metadata.lineCount <= filter.maxLines!);
      }
    }

    if (filtered.length === 0) {
      console.warn("No static snippets match all filters. Loosening filters...");
      // Loosen filters by keeping only language if provided, or return a default snippet
      let loosened = STATIC_SNIPPETS;
      if (filter && filter.language) {
        loosened = loosened.filter((s) => s.language === filter.language);
      }
      if (loosened.length === 0) {
        return STATIC_SNIPPETS[0] || null;
      }
      const randomIndex = Math.floor(Math.random() * loosened.length);
      return loosened[randomIndex] || null;
    }

    // Return random or first match
    if (random) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      return filtered[randomIndex] || null;
    }

    return filtered[0] || null;
  }

  /**
   * Database-backed snippets aren't available in this no-account build —
   * always falls back to static snippets.
   */
  private static async getDatabaseSnippet(
    filter?: SnippetFilter,
  ): Promise<CodeSnippet | null> {
    return this.getStaticSnippet(filter);
  }

  /**
   * Get AI-generated snippet (placeholder for future implementation)
   */
  private static async getAIGeneratedSnippet(
    filter?: SnippetFilter,
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
   * Community snippets aren't available in this no-account build — always
   * falls back to static snippets.
   */
  private static async getCommunitySnippet(
    filter?: SnippetFilter,
  ): Promise<CodeSnippet | null> {
    return this.getStaticSnippet(filter);
  }

  /**
   * Get interview question snippet (placeholder for future implementation)
   */
  private static async getInterviewSnippet(
    filter?: SnippetFilter,
  ): Promise<CodeSnippet | null> {
    // TODO: Implement interview question snippets
    console.warn("Interview snippets not yet implemented");
    return this.getStaticSnippet(filter);
  }

  /**
   * Get LeetCode-style snippet (placeholder for future implementation)
   */
  private static async getLeetCodeSnippet(
    filter?: SnippetFilter,
  ): Promise<CodeSnippet | null> {
    // TODO: Implement LeetCode-style snippets
    console.warn("LeetCode snippets not yet implemented");
    return this.getStaticSnippet(filter);
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
    },
  ): CodeSnippet {
    const metadata = generateMetadata(code, language);

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
