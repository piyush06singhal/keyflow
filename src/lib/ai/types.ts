import { z } from "zod";

export type AiProviderId = "groq";

export type AiRequestKind =
  | "typing_session_analysis"
  | "coding_exercise_generation"
  | "lesson_generation"
  | "practice_plan"
  | "coach_chat"
  | "progress_summary";

export type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AiGenerateTextInput = {
  kind: AiRequestKind;
  messages: AiMessage[];
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  metadata?: Record<string, unknown>;
};

export type AiGenerateTextResult = {
  provider: AiProviderId;
  model: string;
  text: string;
  latencyMs: number;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  raw?: unknown;
};

export interface AiProvider {
  id: AiProviderId;
  defaultModel: string;
  generateText(input: AiGenerateTextInput): Promise<AiGenerateTextResult>;
}

export const aiJsonResponseSchema = z.object({
  title: z.string().optional(),
  summary: z.string().optional(),
  actions: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AiJsonResponse = z.infer<typeof aiJsonResponseSchema>;
