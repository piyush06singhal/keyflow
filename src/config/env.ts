import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

const serverEnvSchema = clientEnvSchema.extend({
  GOOGLE_GEMINI_API_KEY: z.string().optional(),
  // One or more Groq API keys, comma- or newline-separated. See groqApiKeys below.
  GROQ_API_KEYS: z.string().optional(),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

export const serverEnv = serverEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
  GROQ_API_KEYS: process.env.GROQ_API_KEYS,
});

/** All configured Groq API keys, parsed from a comma/newline-separated list. */
export const groqApiKeys: string[] = (serverEnv.GROQ_API_KEYS ?? "")
  .split(/[\n,]/)
  .map((key) => key.trim())
  .filter(Boolean);
