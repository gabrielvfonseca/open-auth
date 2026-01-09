# Session Store API Reference

## Base Interface

### `SessionStore`
Abstract class/interface for all stores.
- `get(id: string): Promise<Session | null>`
- `set(id: string, session: Session, ttl: number): Promise<void>`
- `delete(id: string): Promise<void>`

## Implementations

### `RedisStore`
Constructor accepts an `ioredis` instance.

### `MemoryStore`
Perfect for functional tests.
