# @open-auth/token

The token management service for Open-Auth. It provides a unified interface for generating and validating both JWTs and opaque tokens used for various authentication and authorization flows.

## Installation

```bash
bun add @open-auth/token
```

## Features

- **JWT Support**: Standard-compliant JSON Web Token generation and verification.
- **Opaque Tokens**: High-entropy random tokens for database-backed sessions or one-time use.
- **Key Rotation**: Infrastructure-ready logic for managing signing keys.
- **Custom Claims**: Flexible support for adding application-specific metadata to tokens.

## Documentation

- [Overview](docs/OVERVIEW.md)
- [API Reference](docs/API-REFERENCE.md)
- [Architecture](docs/ARCHITECTURE.md)
