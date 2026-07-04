import type { z } from "zod";

export function parseJsonFromText<T>(text: string, schema: z.ZodSchema<T>): T {
  const trimmed = text.trim();
  const jsonText = trimmed.startsWith("```")
    ? trimmed
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/, "")
        .trim()
    : trimmed;

  return schema.parse(JSON.parse(jsonText));
}
