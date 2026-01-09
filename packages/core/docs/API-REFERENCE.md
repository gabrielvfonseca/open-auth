# Core API Reference

## Validation

### `emailSchema`
Standard Zod schema for email validation.

### `passwordSchema`
Zod schema enforcing complexity requirements for passwords.

## Rate Limiting

### `RateLimiter`
Class for creating rate-limited operations.
- `consume(key: string): Promise<void>`: Consumes a token from the bucket.

## Logger

### `logger`
Global logging instance.
- `info(message: string, meta?: object)`
- `error(message: string, error?: Error)`
- `warn(message: string)`

## Errors

### `AppError`
Base class for all application errors. Includes `code` and `statusCode`.
