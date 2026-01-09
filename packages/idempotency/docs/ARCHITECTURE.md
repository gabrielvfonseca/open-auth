# Idempotency Architecture

The Idempotency package relies heavily on the Core package's Redis connection for distributed locking and state storage.

## Structure

```
src/
├── idempotency.ts       # Core logic and locking patterns
├── idempotency-types.ts # Shared interfaces
└── index.ts             # Public API
```

## Workflow

1. **Check**: Service receives an Idempotency-Key.
2. **Retrieve**: If a result exists, return it immediately.
3. **Lock**: If no result, acquire a distributed lock.
4. **Execute**: Run the business logic.
5. **Save**: Store the result and its lifetime.
6. **Release**: Release the lock and return the result.
