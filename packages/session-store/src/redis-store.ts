import "server-only";
import type Redis from "ioredis";
import type { SessionData, SessionStore } from "./types";

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const KEY_PREFIX = "session:";

/**
 * Redis-backed session store for production
 */
export class RedisSessionStore implements SessionStore {
  private readonly redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async get(sessionId: string): Promise<SessionData | null> {
    const key = `${KEY_PREFIX}${sessionId}`;
    const data = await this.redis.get(key);

    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data) as SessionData;
    } catch {
      return null;
    }
  }

  async set(
    sessionId: string,
    data: SessionData,
    ttlSeconds: number = DEFAULT_TTL_SECONDS
  ): Promise<void> {
    const key = `${KEY_PREFIX}${sessionId}`;
    await this.redis.setex(key, ttlSeconds, JSON.stringify(data));
  }

  async delete(sessionId: string): Promise<void> {
    const key = `${KEY_PREFIX}${sessionId}`;
    await this.redis.del(key);
  }

  async touch(
    sessionId: string,
    ttlSeconds: number = DEFAULT_TTL_SECONDS
  ): Promise<void> {
    const key = `${KEY_PREFIX}${sessionId}`;
    await this.redis.expire(key, ttlSeconds);
  }

  /**
   * Delete all sessions for a user
   */
  async deleteUserSessions(userId: string): Promise<number> {
    const keys = await this.redis.keys(`${KEY_PREFIX}*`);
    let deleted = 0;

    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        try {
          const session = JSON.parse(data) as SessionData;
          if (session.userId === userId) {
            await this.redis.del(key);
            deleted++;
          }
        } catch {
          // Ignore parse errors
        }
      }
    }

    return deleted;
  }
}
