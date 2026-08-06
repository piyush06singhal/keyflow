/**
 * Groq Key Pool
 *
 * Rotates requests across multiple Groq API keys (round-robin) and puts a
 * key on a temporary cooldown after a rate-limit/transient error, so a
 * single overloaded key never stalls generation while others are free.
 */

import Groq from "groq-sdk";

import { groqApiKeys } from "@/config/env";

const DEFAULT_COOLDOWN_MS = 30_000;

interface KeyState {
  key: string;
  cooldownUntil: number;
}

function isRateLimitOrTransient(error: unknown): boolean {
  const status = (error as { status?: number } | undefined)?.status;
  return status === 429 || (typeof status === "number" && status >= 500);
}

export class GroqKeyPool {
  private readonly keys: KeyState[];
  private cursor = 0;
  private readonly clients = new Map<string, Groq>();

  constructor(
    rawKeys: string[],
    private readonly cooldownMs = DEFAULT_COOLDOWN_MS,
  ) {
    this.keys = rawKeys.map((key) => ({ key, cooldownUntil: 0 }));
  }

  private acquire(): KeyState {
    const now = Date.now();

    for (let i = 0; i < this.keys.length; i++) {
      const idx = (this.cursor + i) % this.keys.length;
      const candidate = this.keys[idx]!;
      if (candidate.cooldownUntil <= now) {
        this.cursor = (idx + 1) % this.keys.length;
        return candidate;
      }
    }

    // Every key is cooling down — use whichever recovers soonest rather
    // than hard-failing outright.
    return this.keys.reduce((soonest, candidate) =>
      candidate.cooldownUntil < soonest.cooldownUntil ? candidate : soonest,
    );
  }

  private clientFor(key: string): Groq {
    let client = this.clients.get(key);
    if (!client) {
      client = new Groq({ apiKey: key });
      this.clients.set(key, client);
    }
    return client;
  }

  private markCooldown(key: string): void {
    const state = this.keys.find((k) => k.key === key);
    if (state) {
      state.cooldownUntil = Date.now() + this.cooldownMs;
    }
  }

  /**
   * Run `fn` against the next available key. On a rate-limit/transient
   * error, that key is cooled down and the next key is tried instead
   * (bounded by pool size). Non-retryable errors surface immediately.
   */
  async withKey<T>(fn: (client: Groq) => Promise<T>): Promise<T> {
    if (this.keys.length === 0) {
      throw new Error(
        "No Groq API keys configured. Set GROQ_API_KEYS (comma- or newline-separated) in your environment.",
      );
    }

    let lastError: unknown;

    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      const state = this.acquire();

      try {
        return await fn(this.clientFor(state.key));
      } catch (error) {
        lastError = error;

        if (isRateLimitOrTransient(error)) {
          this.markCooldown(state.key);
          continue;
        }

        throw error;
      }
    }

    throw lastError;
  }
}

export const groqKeyPool = new GroqKeyPool(groqApiKeys);
