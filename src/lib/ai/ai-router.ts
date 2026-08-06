import { GeminiProvider } from "@/lib/ai/providers/gemini.provider";
import { GroqProvider } from "@/lib/ai/providers/groq.provider";
import type { AiProvider, AiProviderId, AiRequestKind } from "@/lib/ai/types";

/**
 * Groq is the only provider actually used by default (see
 * `defaultProviderByKind` below) — every real call site in the app currently
 * passes `{ provider: "groq" }` explicitly. Gemini is kept registered as a
 * genuine, working alternate provider (not a stub — `GeminiProvider` fully
 * implements `AiProvider`) so a caller can opt into it via
 * `selectAiProvider(kind, "gemini")` without any router changes, e.g. if
 * Groq's free tier ever becomes insufficient. It stays dormant unless
 * `GOOGLE_GEMINI_API_KEY` is set, since `GeminiProvider.generateText` throws
 * a clear error otherwise rather than failing silently.
 */
const providers: Record<AiProviderId, AiProvider> = {
  gemini: new GeminiProvider(),
  groq: new GroqProvider(),
};

const defaultProviderByKind: Record<AiRequestKind, AiProviderId> = {
  typing_session_analysis: "groq",
  coding_exercise_generation: "groq",
  lesson_generation: "groq",
  practice_plan: "groq",
  coach_chat: "groq",
  progress_summary: "groq",
};

export function selectAiProvider(kind: AiRequestKind, preferred?: AiProviderId) {
  return providers[preferred ?? defaultProviderByKind[kind]];
}
