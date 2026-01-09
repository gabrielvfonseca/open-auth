# @open-auth/session-store

The persistence layer for user sessions in Open-Auth. It provides a flexible interface for storing and retrieving session data across various storage backends.

## Installation

```bash
bun add @open-auth/session-store
```

## Features

- **Generic Store Interface**: Unified API for interacting with different storage engines.
- **Multiple Backends**:
  - **Redis**: For high-performance, distributed session management.
  - **Memory**: For development and lightweight use cases.
- **Automatic Expiration**: TTL management handled at the store level.

## Documentation

- [Overview](docs/OVERVIEW.md)
- [API Reference](docs/API-REFERENCE.md)
- [Architecture](docs/ARCHITECTURE.md)
