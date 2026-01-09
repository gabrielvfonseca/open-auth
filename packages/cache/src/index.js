import Redis from "ioredis";
import { keys } from "./keys";
/**
 * Global Redis Client instance using ioredis.
 * It automatically uses process.env.REDIS_URL if available via the keys() helper.
 */
export const redis = new Redis(keys().REDIS_URL);
/**
 * Cache utilities for common operations
 */
export const cache = {
  /**
   * Set a value in cache with optional TTL (in seconds)
   */
  set: async (key, value, ttlSeconds) => {
    await redis.set(key, value);
    if (ttlSeconds) {
      await redis.expire(key, ttlSeconds);
    }
  },
  /**
   * Get a value from cache
   */
  get: async (key) => {
    return await redis.get(key);
  },
  /**
   * Delete a value from cache
   */
  del: async (key) => {
    await redis.del(key);
  },
  /**
   * Check if a key exists
   */
  exists: async (key) => {
    const result = await redis.exists(key);
    return Boolean(result);
  },
};
export { Redis };
