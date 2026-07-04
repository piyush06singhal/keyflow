type LogContext = Record<string, unknown>;

export function logError(error: unknown, context: LogContext = {}) {
  if (process.env.NODE_ENV !== "production") {
    console.error("[KeyFlow error]", { error, context });
  }

  // Production observability can be wired here later without changing callers.
}
