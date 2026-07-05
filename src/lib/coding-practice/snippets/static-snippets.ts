/**
 * Static Code Snippets
 * 
 * Pre-defined code snippets for coding practice.
 * Organized by language, difficulty, and category.
 */

import type { CodeSnippet } from "../types";
import { JAVASCRIPT_SNIPPETS } from "./javascript-snippets";
import { TYPESCRIPT_REACT_SNIPPETS } from "./typescript-react-snippets";
import { MULTI_LANGUAGE_SNIPPETS } from "./multi-language-snippets";

// Combine all snippets
export const STATIC_SNIPPETS: CodeSnippet[] = [
  ...JAVASCRIPT_SNIPPETS,
  ...TYPESCRIPT_REACT_SNIPPETS,
  ...MULTI_LANGUAGE_SNIPPETS,
];

// Export count for reference
export const SNIPPET_COUNT = STATIC_SNIPPETS.length;
