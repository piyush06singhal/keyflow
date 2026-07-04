import { GoogleGenAI } from "@google/genai";

import { serverEnv } from "@/config/env";
import { toAiError } from "@/lib/ai/errors";
import type {
  AiGenerateTextInput,
  AiGenerateTextResult,
  AiProvider,
} from "@/lib/ai/types";

export class GeminiProvider implements AiProvider {
  readonly id = "gemini" as const;
  readonly defaultModel = "gemini-2.5-flash";

  private get client() {
    if (!serverEnv.GOOGLE_GEMINI_API_KEY) {
      throw toAiError(new Error("Missing GOOGLE_GEMINI_API_KEY."), this.id);
    }

    return new GoogleGenAI({ apiKey: serverEnv.GOOGLE_GEMINI_API_KEY });
  }

  async generateText(input: AiGenerateTextInput): Promise<AiGenerateTextResult> {
    const startedAt = performance.now();
    const model = input.model ?? this.defaultModel;

    try {
      const response = await this.client.models.generateContent({
        model,
        contents: input.messages
          .map((message) => `${message.role.toUpperCase()}:\n${message.content}`)
          .join("\n\n"),
        config: {
          temperature: input.temperature,
          maxOutputTokens: input.maxOutputTokens,
        },
      });

      return {
        provider: this.id,
        model,
        text: response.text ?? "",
        latencyMs: Math.round(performance.now() - startedAt),
        raw: response,
      };
    } catch (error) {
      throw toAiError(error, this.id);
    }
  }
}
