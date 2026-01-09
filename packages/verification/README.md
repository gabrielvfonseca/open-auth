# @open-auth/verification

Generic verification service for Open-Auth. It manages the creation and validation of short-lived codes used for email confirmation, SMS verification, and other challenge-response flows.

## Installation

```bash
bun add @open-auth/verification
```

## Features

- **Code Generation**: Secure generation of numeric or alphanumeric codes.
- **State Management**: Distributed storage for pending verification attempts.
- **Expiration**: Automatic TTL handling for verification challenges.
- **Attempts Tracking**: Integrated protection against brute-force verification.

## Documentation

- [Overview](docs/OVERVIEW.md)
- [API Reference](docs/API-REFERENCE.md)
- [Architecture](docs/ARCHITECTURE.md)
