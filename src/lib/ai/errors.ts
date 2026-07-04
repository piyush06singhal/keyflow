export class AiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly provider?: string,
    public override readonly cause?: unknown,
  ) {
    super(message);
    this.name = "AiError";
  }
}

export function toAiError(error: unknown, provider?: string): AiError {
  if (error instanceof AiError) {
    return error;
  }

  if (error instanceof Error) {
    return new AiError(error.message, "AI_PROVIDER_ERROR", provider, error);
  }

  return new AiError("Unknown AI provider error.", "AI_UNKNOWN_ERROR", provider, error);
}
