# Idempotency API Reference

## Primary Services

### `executeIdempotent(key: string, fn: Function)`
Wraps a block of logic. Checks for existing results, acquires a lock, executes the function, and stores the result.

### `cleanupIdempotencyKeys()`
Utility for purging expired keys from the store.

## Types

### `IdempotencyResult`
Interface for cached operation results.
- `status`: 'processing' | 'success' | 'error'
- `payload`: The return value of the wrapped function
- `expiresAt`: Expiration timestamp
