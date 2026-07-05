/**
 * Session Storage
 * 
 * Handles session persistence to localStorage and Supabase.
 */

import type { SessionSnapshot } from "../types";

const STORAGE_KEY = "keyflow-typing-session";
const STORAGE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export class SessionStorage {
  /**
   * Save session snapshot to localStorage
   */
  static saveLocal(snapshot: SessionSnapshot): void {
    try {
      const data = {
        snapshot,
        savedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save session to localStorage:", error);
    }
  }

  /**
   * Load session snapshot from localStorage
   */
  static loadLocal(): SessionSnapshot | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored) as {
        snapshot: SessionSnapshot;
        savedAt: number;
      };

      // Check if expired
      if (Date.now() - data.savedAt > STORAGE_EXPIRY) {
        this.clearLocal();
        return null;
      }

      return data.snapshot;
    } catch (error) {
      console.error("Failed to load session from localStorage:", error);
      return null;
    }
  }

  /**
   * Clear local session
   */
  static clearLocal(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear local session:", error);
    }
  }

  /**
   * Check if there's a saved session
   */
  static hasLocalSession(): boolean {
    return this.loadLocal() !== null;
  }

  /**
   * Auto-save session (throttled)
   */
  static createAutoSaver(
    getSnapshot: () => SessionSnapshot,
    interval: number = 5000
  ): () => void {
    let timeoutId: number | null = null;
    let lastSave = 0;

    const save = () => {
      const now = Date.now();
      if (now - lastSave >= interval) {
        this.saveLocal(getSnapshot());
        lastSave = now;
      }

      timeoutId = window.setTimeout(save, interval);
    };

    // Start auto-saving
    save();

    // Return cleanup function
    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }

  /**
   * Save session to Supabase (placeholder - implement with Supabase client)
   */
  static async saveToSupabase(
    userId: string,
    snapshot: SessionSnapshot
  ): Promise<void> {
    // TODO: Implement Supabase integration
    console.log("Saving session to Supabase:", userId, snapshot.sessionId);
  }

  /**
   * Load session from Supabase (placeholder - implement with Supabase client)
   */
  static async loadFromSupabase(
    userId: string,
    sessionId: string
  ): Promise<SessionSnapshot | null> {
    // TODO: Implement Supabase integration
    console.log("Loading session from Supabase:", userId, sessionId);
    return null;
  }
}
