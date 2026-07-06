/**
 * Specialized Error class for application-specific exceptions
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = "INTERNAL_ERROR",
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Standardized logging utility.
 * In a real production app, this acts as the facade for Sentry, LogRocket, or Datadog.
 */
export const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.info(`[INFO]: ${message}`, meta ? meta : "");
  },
  warn: (message: string, meta?: Record<string, any>) => {
    console.warn(`[WARN]: ${message}`, meta ? meta : "");
  },
  error: (error: Error | AppError, meta?: Record<string, any>) => {
    console.error(`[ERROR]: ${error.message}`, {
      stack: error.stack,
      code: error instanceof AppError ? error.code : "UNKNOWN",
      ...meta,
    });

    // Future integration: Sentry.captureException(error, { extra: meta });
  },
};

/**
 * Generic retry mechanism with exponential backoff.
 * Extremely useful for flaky network requests or Rate Limited AI generation (Groq API).
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 500,
): Promise<T> {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      attempt++;

      if (attempt >= maxRetries) {
        logger.error(error instanceof Error ? error : new Error(String(error)), {
          context: "withRetry",
          maxRetriesReached: true,
        });
        throw error;
      }

      const delay = baseDelayMs * Math.pow(2, attempt - 1); // Exponential backoff
      logger.warn(
        `Operation failed, retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`,
        { error: String(error) },
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Retry loop exhausted"); // Should logically never hit this due to throw in catch
}
