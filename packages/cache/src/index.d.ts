import Redis from "ioredis";
/**
 * Global Redis Client instance using ioredis.
 * It automatically uses process.env.REDIS_URL if available via the keys() helper.
 */
export declare const redis: Redis;
/**
 * Cache utilities for common operations
 */
export declare const cache: {
  /**
   * Set a value in cache with optional TTL (in seconds)
   */
  set: (key: string, value: string, ttlSeconds?: number) => Promise<void>;
  /**
   * Get a value from cache
   */
  get: (key: string) => Promise<string | null>;
  /**
   * Delete a value from cache
   */
  del: (key: string) => Promise<void>;
  /**
   * Check if a key exists
   */
  exists: (key: string) => Promise<boolean>;
};
export { Redis };
