import { logAiRequest } from "@/lib/ai/logger";
import { withRetry } from "@/lib/ai/retry";
import { selectAiProvider } from "@/lib/ai/ai-router";
import type {
  AiGenerateTextInput,
  AiGenerateTextResult,
  AiProviderId,
} from "@/lib/ai/types";

export async function generateAiText(
  input: AiGenerateTextInput,
  options: { provider?: AiProviderId; retry?: boolean } = {},
): Promise<AiGenerateTextResult> {
  const provider = selectAiProvider(input.kind, options.provider);

  try {
    const result = await withRetry(() => provider.generateText(input), {
      attempts: options.retry === false ? 1 : 2,
    });

    logAiRequest({
      provider: result.provider,
      kind: input.kind,
      status: "success",
      latencyMs: result.latencyMs,
      model: result.model,
    });

    return result;
  } catch (error) {
    logAiRequest({
      provider: provider.id,
      kind: input.kind,
      status: "error",
      model: input.model ?? provider.defaultModel,
      error,
    });
    throw error;
  }
}
