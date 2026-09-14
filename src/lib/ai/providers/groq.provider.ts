import { groqKeyPool } from "@/lib/ai/groq-key-pool";
import { toAiError } from "@/lib/ai/errors";
import type {
  AiGenerateTextInput,
  AiGenerateTextResult,
  AiProvider,
} from "@/lib/ai/types";

export class GroqProvider implements AiProvider {
  readonly id = "groq" as const;
  readonly defaultModel = "qwen/qwen3.8-27b";

  async generateText(input: AiGenerateTextInput): Promise<AiGenerateTextResult> {
    const startedAt = performance.now();
    const model = input.model ?? this.defaultModel;

    try {
      const response = await groqKeyPool.withKey((client) =>
        client.chat.completions.create({
          model,
          messages: input.messages,
          temperature: input.temperature,
          max_tokens: input.maxOutputTokens,
        }),
      );

      return {
        provider: this.id,
        model,
        text: response.choices[0]?.message?.content ?? "",
        latencyMs: Math.round(performance.now() - startedAt),
        usage: {
          inputTokens: response.usage?.prompt_tokens,
          outputTokens: response.usage?.completion_tokens,
          totalTokens: response.usage?.total_tokens,
        },
        raw: response,
      };
    } catch (error) {
      throw toAiError(error, this.id);
    }
  }
}
