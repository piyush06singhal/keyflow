import { logAiRequest } from "@/lib/ai/logger";
import { withRetry } from "@/lib/ai/retry";
import { selectAiProvider } from "@/lib/ai/ai-router";
import { checkUserAiRateLimit } from "@/lib/ai/rate-limit";
import { AiError } from "@/lib/ai/errors";
import type {
  AiGenerateTextInput,
  AiGenerateTextResult,
  AiProviderId,
} from "@/lib/ai/types";

export async function generateAiText(
  input: AiGenerateTextInput,
  options: {
    provider?: AiProviderId;
    retry?: boolean;
    userId?: string;
  } = {},
): Promise<AiGenerateTextResult> {
  if (options.userId) {
    const limit = checkUserAiRateLimit(options.userId);
    if (!limit.allowed) {
      throw new AiError(
        "AI rate limit exceeded. Please try again later.",
        "AI_RATE_LIMIT",
      );
    }
  }

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
