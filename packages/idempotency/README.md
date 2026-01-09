# @open-auth/idempotency

The idempotency service for Open-Auth. It ensures that critical API operations are processed exactly once, regardless of network retries or client-side errors.

## Installation

```bash
bun add @open-auth/idempotency
```

## Features

- **Request Deduplication**: Automatically blocks duplicate execution of the same request ID.
- **Result Caching**: Stores and returns the result of the initial successful operation for subsequent identical requests.
- **Distributed Lock**: Integrated with Redis to prevent race conditions in high-concurrency environments.
- **Configurable TTL**: Customizable retention for idempotency keys.

## Documentation

- [Overview](docs/OVERVIEW.md)
- [API Reference](docs/API-REFERENCE.md)
- [Architecture](docs/ARCHITECTURE.md)
