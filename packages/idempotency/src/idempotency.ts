import "server-only";
import { logger } from "@open-auth/core";
import type {
  IdempotencyOptions,
  IdempotencyResult,
} from "./idempotency-types";
import { DEFAULT_KEY_PREFIX, DEFAULT_TTL_SECONDS } from "./idempotency-types";

// In-memory store for idempotency keys
const idempotencyStore = new Map<
  string,
  { result: unknown; expiresAt: number }
>();

/**
 * Check if an idempotency key exists and return cached result if available
 */
export async function checkIdempotency<T>(
  key: string,
  options: IdempotencyOptions = {}
): Promise<IdempotencyResult<T>> {
  const prefix = options.keyPrefix ?? DEFAULT_KEY_PREFIX;
  const fullKey = `${prefix}${key}`;

  const cached = idempotencyStore.get(fullKey);

  if (cached && cached.expiresAt > Date.now()) {
    logger.debug("Idempotency key found", { key: fullKey });
    return {
      isNew: false,
      result: cached.result as T,
    };
  }

  // Clean up expired entry if exists
  if (cached) {
    idempotencyStore.delete(fullKey);
  }

  return {
    isNew: true,
    result: null,
  };
}

/**
 * Store result for an idempotency key
 */
export async function setIdempotencyResult<T>(
  key: string,
  result: T,
  options: IdempotencyOptions = {}
): Promise<void> {
  const prefix = options.keyPrefix ?? DEFAULT_KEY_PREFIX;
  const ttlSeconds = options.ttlSeconds ?? DEFAULT_TTL_SECONDS;
  const fullKey = `${prefix}${key}`;

  idempotencyStore.set(fullKey, {
    result,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });

  logger.debug("Idempotency result stored", { key: fullKey, ttlSeconds });
}

/**
 * Delete an idempotency key (useful for retries after failures)
 */
export async function deleteIdempotencyKey(
  key: string,
  options: IdempotencyOptions = {}
): Promise<void> {
  const prefix = options.keyPrefix ?? DEFAULT_KEY_PREFIX;
  const fullKey = `${prefix}${key}`;

  idempotencyStore.delete(fullKey);
  logger.debug("Idempotency key deleted", { key: fullKey });
}

/**
 * Wrapper function to execute with idempotency
 */
export async function withIdempotency<T>(
  key: string,
  fn: () => Promise<T>,
  options: IdempotencyOptions = {}
): Promise<T> {
  const check = await checkIdempotency<T>(key, options);

  if (!check.isNew && check.result !== null) {
    return check.result;
  }

  const result = await fn();
  await setIdempotencyResult(key, result, options);

  return result;
}
