import { GeminiProvider } from "@/lib/ai/providers/gemini.provider";
import { GroqProvider } from "@/lib/ai/providers/groq.provider";
import type { AiProvider, AiProviderId, AiRequestKind } from "@/lib/ai/types";

const providers: Record<AiProviderId, AiProvider> = {
  gemini: new GeminiProvider(),
  groq: new GroqProvider(),
};

const defaultProviderByKind: Record<AiRequestKind, AiProviderId> = {
  typing_session_analysis: "gemini",
  coding_exercise_generation: "gemini",
  lesson_generation: "gemini",
  practice_plan: "gemini",
  coach_chat: "groq",
  progress_summary: "gemini",
};

export function selectAiProvider(kind: AiRequestKind, preferred?: AiProviderId) {
  return providers[preferred ?? defaultProviderByKind[kind]];
}
