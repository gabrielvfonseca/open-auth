# @open-auth/cache

A high-performance caching package for the open-auth monorepo, powered by [Bun's native Redis client](https://bun.com/docs/runtime/redis).

## Usage

```typescript
import { redis, cache } from "@open-auth/cache";

// Direct client usage
await redis.set("hello", "world");
const result = await redis.get("hello");

// Utility helper usage
await cache.set("user:1", JSON.stringify(userData), 3600);
const user = await cache.get("user:1");
```

## Configuration

Required environment variables:
- `REDIS_URL`: The Redis connection string (e.g., `redis://localhost:6379`). Defaults to localhost if not provided.
