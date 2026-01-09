import type { SessionData, SessionStore } from "./types";

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * In-memory session store for development/testing
 */
export class MemorySessionStore implements SessionStore {
  private readonly store = new Map<
    string,
    { data: SessionData; expiresAt: number }
  >();

  async get(sessionId: string): Promise<SessionData | null> {
    const entry = this.store.get(sessionId);
    if (!entry) {
      return null;
    }

    if (entry.expiresAt < Date.now()) {
      this.store.delete(sessionId);
      return null;
    }

    return entry.data;
  }

  async set(
    sessionId: string,
    data: SessionData,
    ttlSeconds: number = DEFAULT_TTL_SECONDS
  ): Promise<void> {
    this.store.set(sessionId, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async delete(sessionId: string): Promise<void> {
    this.store.delete(sessionId);
  }

  async touch(
    sessionId: string,
    ttlSeconds: number = DEFAULT_TTL_SECONDS
  ): Promise<void> {
    const entry = this.store.get(sessionId);
    if (entry) {
      entry.expiresAt = Date.now() + ttlSeconds * 1000;
    }
  }

  // For testing
  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}
