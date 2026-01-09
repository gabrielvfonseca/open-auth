# @open-auth/mfa

Multi-Factor Authentication (MFA) service for Open-Auth. It provides TOTP (Time-based One-Time Password) support and fallback recovery code management.

## Installation

```bash
bun add @open-auth/mfa
```

## Features

- **TOTP Support**: Standardized enrollment and verification (Google Authenticator, Authy, etc.).
- **Recovery Codes**: Secure generation and management of one-time backup codes.
- **Configurable Settings**: Customizable token duration and secret length.
- **Security Focused**: Specialized error handling for MFA-specific failure modes.

## Documentation

- [Overview](docs/OVERVIEW.md)
- [API Reference](docs/API-REFERENCE.md)
- [Architecture](docs/ARCHITECTURE.md)
