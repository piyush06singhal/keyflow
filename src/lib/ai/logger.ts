import { logError } from "@/lib/errors/logger";

export type AiLogEntry = {
  provider: string;
  kind: string;
  status: "success" | "error";
  latencyMs?: number;
  model?: string;
  error?: unknown;
};

export function logAiRequest(entry: AiLogEntry) {
  if (entry.status === "error") {
    logError(entry.error, {
      area: "ai",
      provider: entry.provider,
      kind: entry.kind,
      model: entry.model,
    });
  }
}
