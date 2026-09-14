import { SnippetProvider } from "@/lib/coding-practice/snippet-provider";
import { STATIC_SNIPPETS } from "@/lib/coding-practice/snippets/static-snippets";
import type { ProgrammingLanguage } from "@/lib/coding-practice/types";

// Every language the app offers must have somewhere to go. Historically a
// missing language silently fell back to a JavaScript snippet, which made the
// coding practice "always show JavaScript" — this pins that regression down.
const ALL_LANGUAGES: ProgrammingLanguage[] = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "c",
  "go",
  "rust",
  "sql",
  "html",
  "css",
  "json",
  "markdown",
  "bash",
  "docker",
  "yaml",
  "git",
];

describe("static snippet coverage", () => {
  it("has at least one curated snippet for every offered language", () => {
    for (const lang of ALL_LANGUAGES) {
      const count = STATIC_SNIPPETS.filter((s) => s.language === lang).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it("never defaults to a JavaScript snippet for a non-JavaScript language", async () => {
    for (const lang of ALL_LANGUAGES) {
      const snippet = await SnippetProvider.getSnippet({
        source: "static",
        filter: { language: lang },
        random: false,
      });

      expect(snippet).not.toBeNull();
      expect(snippet?.language).toBe(lang);
    }
  });
});
