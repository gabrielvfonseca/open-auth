export interface IdempotencyResult<T> {
  isNew: boolean;
  result: T | null;
}

export interface IdempotencyOptions {
  ttlSeconds?: number;
  keyPrefix?: string;
}

export const DEFAULT_TTL_SECONDS = 86_400; // 24 hours
export const DEFAULT_KEY_PREFIX = "idempotency:";
