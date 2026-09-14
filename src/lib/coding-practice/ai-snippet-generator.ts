/**
 * AI Snippet Generator
 *
 * Generates custom code snippets using Groq based on user preferences.
 * Runs on the server (calling Groq directly) or on the client (calling the server API).
 */

import type {
  CodeSnippet,
  ProgrammingLanguage,
  CodingDifficulty,
  CodingCategory,
  Framework,
} from "./types";
import { generateMetadata } from "./snippet-utils";
import { getLanguageConfig } from "./languages";

interface GenerateSnippetOptions {
  language: ProgrammingLanguage;
  difficulty: CodingDifficulty;
  category?: CodingCategory;
  framework?: Framework;
  topic?: string;
  style?: "tutorial" | "interview" | "project" | "algorithm";
  lineCount?: number;
}

/**
 * Generate a code snippet using AI
 */
export async function generateAiCodeSnippet(
  options: GenerateSnippetOptions,
): Promise<CodeSnippet> {
  // If running in browser, delegate to the API route to keep API keys secure on the server
  if (typeof window !== "undefined") {
    const response = await fetch("/api/generate-snippet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate snippet: ${response.statusText}`);
    }

    const json = await response.json();
    if (!json.success) {
      throw new Error(json.error || "Failed to generate snippet");
    }

    return json.data;
  }

  // Server-side generation using Groq Provider
  const { generateAiText } = await import("@/lib/ai/ai-service");
  const {
    language,
    difficulty,
    category,
    framework,
    topic,
    style = "tutorial",
    lineCount = 20,
  } = options;

  const languageConfig = getLanguageConfig(language);

  // Build AI prompt
  const prompt = buildSnippetPrompt({
    language: languageConfig.displayName,
    difficulty,
    category,
    framework,
    topic,
    style,
    lineCount,
    fileExtension: languageConfig.fileExtension,
  });

  try {
    // Generate using AI service
    const result = await generateAiText(
      {
        kind: "coding_exercise_generation",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
      {
        provider: "groq",
      },
    );

    // Parse AI response
    const parsedSnippet = parseAiResponse(result.text, options);

    // Create snippet with metadata
    const snippet: CodeSnippet = {
      id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      title: parsedSnippet.title,
      description: parsedSnippet.description,
      language,
      framework,
      category: category || "full-snippets",
      difficulty,
      type: determineSnippetType(category),
      code: parsedSnippet.code,
      metadata: generateMetadata(parsedSnippet.code, language),
      tags: parsedSnippet.tags || [language, difficulty, style],
    };

    return snippet;
  } catch (error) {
    console.error("AI snippet generation failed:", error);
    throw new Error("Failed to generate code snippet. Please try again.");
  }
}

/**
 * Build the AI prompt for code generation
 */
function buildSnippetPrompt(params: {
  language: string;
  difficulty: CodingDifficulty;
  category?: CodingCategory;
  framework?: Framework;
  topic?: string;
  style: string;
  lineCount: number;
  fileExtension: string;
}): string {
  const { language, difficulty, category, framework, topic, style, lineCount } = params;

  let prompt = `Generate a ${difficulty}-level ${language} code snippet`;

  if (framework && framework !== "none") {
    prompt += ` using ${framework}`;
  }

  if (category) {
    prompt += ` focusing on ${category.replace(/-/g, " ")}`;
  }

  if (topic) {
    prompt += ` about ${topic}`;
  }

  prompt += `.\n\n`;

  // Add style-specific requirements
  switch (style) {
    case "tutorial":
      prompt +=
        "Make it educational with clear examples and comments explaining key concepts.";
      break;
    case "interview":
      prompt +=
        "Make it interview-style with a problem-solving focus and optimal solution.";
      break;
    case "project":
      prompt += "Make it production-ready with error handling and best practices.";
      break;
    case "algorithm":
      prompt +=
        "Focus on algorithmic implementation with time/space complexity analysis.";
      break;
  }

  // Add difficulty-specific requirements
  switch (difficulty) {
    case "beginner":
      prompt += " Use simple, straightforward syntax. Include helpful comments.";
      break;
    case "intermediate":
      prompt +=
        " Use common patterns and real-world examples. Include moderate complexity.";
      break;
    case "advanced":
      prompt += " Use advanced features, nested structures, and complex logic.";
      break;
    case "expert":
      prompt += " Use expert-level patterns, optimizations, and production-grade code.";
      break;
  }

  prompt += `\n\nTarget approximately ${lineCount} lines of code.`;

  prompt += `\n\nIMPORTANT: Return your response in this exact JSON format:
{
  "title": "Short descriptive title",
  "description": "Brief description of what the code does",
  "code": "The actual code here",
  "tags": ["tag1", "tag2", "tag3"]
}

The code should be production-quality, properly formatted with correct indentation, and ready to type.`;

  return prompt;
}

/**
 * System prompt for AI code generation
 */
const SYSTEM_PROMPT = `You are an expert programming instructor specializing in creating code snippets for typing practice.

Your snippets should be:
1. Syntactically correct and runnable
2. Well-formatted with proper indentation
3. Representative of real-world code
4. Appropriate for the specified difficulty level
5. Educational and practical
6. Free of syntax errors or typos

Always return valid JSON in the specified format. The code field should contain the actual code as a single string with newlines (\\n) for line breaks.`;

/**
 * Parse AI response and extract snippet data
 */
function parseAiResponse(
  aiResponse: string,
  options: GenerateSnippetOptions,
): {
  title: string;
  description: string;
  code: string;
  tags?: string[];
} {
  try {
    // Try to parse as JSON
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title || "AI Generated Snippet",
        description: parsed.description || "Custom generated code snippet",
        code: parsed.code || aiResponse,
        tags: parsed.tags,
      };
    }

    // Fallback: extract code blocks
    const codeBlockMatch = aiResponse.match(/```[\w]*\n([\s\S]*?)```/);
    const code = codeBlockMatch?.[1]?.trim() || aiResponse;

    return {
      title: `${options.language} ${options.difficulty} snippet`,
      description: `AI-generated ${options.language} code`,
      code,
      tags: [options.language, options.difficulty],
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Invalid AI response format");
  }
}

/**
 * Determine snippet type based on category
 */
function determineSnippetType(category?: CodingCategory): CodeSnippet["type"] {
  if (!category) return "full-code";

  const typeMap: Record<string, CodeSnippet["type"]> = {
    "basic-syntax": "syntax",
    functions: "function",
    classes: "class",
    "react-components": "component",
    algorithms: "algorithm",
    "sql-queries": "query",
    "config-files": "config",
    "git-commands": "command",
    "terminal-commands": "command",
    "terminal-inputs": "command",
  };

  return typeMap[category || ""] || "full-code";
}

/**
 * Generate multiple snippets in parallel
 */
export async function generateMultipleSnippets(
  options: GenerateSnippetOptions,
  count: number = 3,
): Promise<CodeSnippet[]> {
  const promises = Array.from({ length: count }, () => generateAiCodeSnippet(options));

  try {
    const snippets = await Promise.all(promises);
    return snippets;
  } catch (error) {
    console.error("Failed to generate multiple snippets:", error);
    // Return at least one snippet or throw
    const fallbackSnippet = await generateAiCodeSnippet(options);
    return [fallbackSnippet];
  }
}

/**
 * Generate a snippet via AI FIRST, falling back to a curated static snippet
 * when Groq is unreachable or returns nothing useful.
 *
 * Policy: AI is the priority source, but a known-good curated snippet is a
 * deliberate, visible backup so coding practice stays usable without a Groq
 * key — it is never mislabeled as AI content. (Typing practice, by contrast,
 * stays strict and surfaces an error state instead of a static word bank.)
 */
export async function generateSnippetWithFallback(
  options: GenerateSnippetOptions,
): Promise<CodeSnippet> {
  try {
    return await generateAiCodeSnippet(options);
  } catch (error) {
    console.warn("AI snippet generation failed, using curated fallback:", error);

    const { SnippetProvider } = await import("./snippet-provider");
    const staticSnippet = await SnippetProvider.getSnippet({
      source: "static",
      filter: {
        language: options.language,
        framework: options.framework,
        difficulty: options.difficulty,
        category: options.category,
      },
      random: true,
    });

    if (staticSnippet) {
      return staticSnippet;
    }

    throw new Error("No snippets available");
  }
}
