import { GroqProvider } from "@/lib/ai/providers/groq.provider";
import type { AiProvider, AiProviderId, AiRequestKind } from "@/lib/ai/types";

/**
 * Groq is the only AI provider — every request kind defaults to it, and all
 * real call sites pass `{ provider: "groq" }` explicitly. (The legacy Gemini
 * provider was removed to keep a single provider surface; add a new provider
 * by implementing `AiProvider` and registering it below.)
 */
const providers: Record<AiProviderId, AiProvider> = {
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
