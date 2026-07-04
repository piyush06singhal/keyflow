export interface AiCache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
}

export class MemoryAiCache implements AiCache {
  private readonly store = new Map<string, { expiresAt: number; value: unknown }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);

    if (!item) return null;
    if (item.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }
}
