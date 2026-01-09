# Core Architecture

The Core package is designed with a "zero-dependency" philosophy where possible, only including essential libraries like Zod and ioredis.

## Structure

```
src/
├── validation.ts  # Zod schemas
├── rate-limit.ts # Redis logic
├── logger.ts     # Logging engine
├── errors.ts     # Error hierarchy
└── encryption.ts # Crypto helpers
```

## Design Principles

1. **Strictness**: Every input passing through core must be validated.
2. **Performance**: Utilities like rate limiting are optimized for low-latency environments.
3. **Consistency**: Error codes and logging formats are standardized here to ensure coherence across the monorepo.
