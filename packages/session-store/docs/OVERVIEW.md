# Session Store Overview

The `@open-auth/session-store` package decouples the session logic from the underlying database or cache. This allows the platform to scale session management independently.

## Supported Stores

- **RedisStore**: Leverages Redis' native TTL and shared memory for distributed environments.
- **MemoryStore**: A simple in-memory Map implementation for local testing.

## Key Concepts

- **Store Interface**: Defines the contract (`get`, `set`, `delete`) for all implementations.
- **JSON Serialization**: Automatical handling of session data conversion.
