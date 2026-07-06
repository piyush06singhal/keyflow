/**
 * Offline Storage Manager
 *
 * Manages offline session persistence using IndexedDB.
 * Automatically syncs pending sessions when online.
 */

import type { PendingSession, SessionSyncStatus, SyncResult } from "./types";
import type { SessionResult } from "@/lib/typing-engine";

const DB_NAME = "keyflow_offline";
const DB_VERSION = 1;
const STORE_NAME = "pending_sessions";
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5000;

/**
 * Initialize IndexedDB
 */
function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp", { unique: false });
        store.createIndex("userId", "userId", { unique: false });
      }
    };
  });
}

/**
 * Store session offline
 */
export async function storeSessionOffline(
  userId: string,
  sessionData: SessionResult,
  practiceMode: string,
): Promise<void> {
  try {
    const db = await initDB();

    const pendingSession: PendingSession = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sessionData,
      practiceMode,
      timestamp: Date.now(),
      attempts: 0,
      lastAttemptTime: Date.now(),
    };

    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.add(pendingSession);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    db.close();
  } catch (error) {
    console.error("Failed to store session offline:", error);
    throw error;
  }
}

/**
 * Get all pending sessions
 */
export async function getPendingSessions(): Promise<PendingSession[]> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as PendingSession[]);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to get pending sessions:", error);
    return [];
  }
}

/**
 * Remove session from offline storage
 */
export async function removePendingSession(sessionId: string): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(sessionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    db.close();
  } catch (error) {
    console.error("Failed to remove pending session:", error);
    throw error;
  }
}

/**
 * Update pending session retry count
 */
export async function updateSessionRetry(
  sessionId: string,
  attempts: number,
): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const session = await new Promise<PendingSession>((resolve, reject) => {
      const request = store.get(sessionId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (session) {
      session.attempts = attempts;
      session.lastAttemptTime = Date.now();

      await new Promise<void>((resolve, reject) => {
        const request = store.put(session);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    db.close();
  } catch (error) {
    console.error("Failed to update session retry:", error);
  }
}

/**
 * Get sync status
 */
export async function getSyncStatus(): Promise<SessionSyncStatus> {
  try {
    const pendingSessions = await getPendingSessions();
    const lastSyncTime = localStorage.getItem("last_sync_time");
    const lastSyncError = localStorage.getItem("last_sync_error");

    return {
      isPending: pendingSessions.length > 0,
      pendingCount: pendingSessions.length,
      lastSyncTime: lastSyncTime ? parseInt(lastSyncTime) : null,
      lastSyncError,
    };
  } catch (error) {
    console.error("Failed to get sync status:", error);
    return {
      isPending: false,
      pendingCount: 0,
      lastSyncTime: null,
      lastSyncError: null,
    };
  }
}

/**
 * Clear all pending sessions (use with caution)
 */
export async function clearPendingSessions(): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    db.close();
  } catch (error) {
    console.error("Failed to clear pending sessions:", error);
    throw error;
  }
}

/**
 * Sync pending sessions
 */
export async function syncPendingSessions(
  syncFunction: (
    userId: string,
    sessionData: SessionResult,
    practiceMode: string,
  ) => Promise<{ data: unknown; error: Error | null }>,
): Promise<SyncResult> {
  const result: SyncResult = {
    successful: 0,
    failed: 0,
    errors: [],
  };

  try {
    const pendingSessions = await getPendingSessions();

    for (const session of pendingSessions) {
      // Skip if max retries exceeded
      if (session.attempts >= MAX_RETRY_ATTEMPTS) {
        result.failed++;
        result.errors.push({
          sessionId: session.id,
          error: "Max retry attempts exceeded",
        });
        continue;
      }

      // Skip if retry delay not elapsed
      if (Date.now() - session.lastAttemptTime < RETRY_DELAY_MS) {
        continue;
      }

      try {
        const { error } = await syncFunction(
          session.userId,
          session.sessionData,
          session.practiceMode,
        );

        if (error) {
          await updateSessionRetry(session.id, session.attempts + 1);
          result.failed++;
          result.errors.push({
            sessionId: session.id,
            error: error.message,
          });
        } else {
          await removePendingSession(session.id);
          result.successful++;
        }
      } catch (error) {
        await updateSessionRetry(session.id, session.attempts + 1);
        result.failed++;
        result.errors.push({
          sessionId: session.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Update last sync time
    localStorage.setItem("last_sync_time", Date.now().toString());
    if (result.errors.length > 0) {
      localStorage.setItem(
        "last_sync_error",
        result.errors[0]?.error || "Unknown error",
      );
    } else {
      localStorage.removeItem("last_sync_error");
    }
  } catch (error) {
    console.error("Failed to sync pending sessions:", error);
  }

  return result;
}

/**
 * Check if online and start background sync
 */
export function startBackgroundSync(
  syncFunction: (
    userId: string,
    sessionData: SessionResult,
    practiceMode: string,
  ) => Promise<{ data: unknown; error: Error | null }>,
): () => void {
  let intervalId: NodeJS.Timeout | null = null;

  const sync = async () => {
    if (navigator.onLine) {
      await syncPendingSessions(syncFunction);
    }
  };

  // Initial sync
  sync();

  // Periodic sync every 30 seconds
  intervalId = setInterval(sync, 30000);

  // Sync on online event
  const handleOnline = () => sync();
  window.addEventListener("online", handleOnline);

  // Cleanup function
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    window.removeEventListener("online", handleOnline);
  };
}
