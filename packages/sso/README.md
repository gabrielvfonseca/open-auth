# @open-auth/sso

Single Sign-On (SSO) service for Open-Auth, primarily focusing on SAML 2.0 integration for enterprise identity providers (Okta, Azure AD, etc.).

## Installation

```bash
bun add @open-auth/sso
```

## Features

- **SAML 2.0 Support**: Service Provider (SP) implementation for secure enterprise identity delegation.
- **Request Storage**: Distributed storage for SAML request state to prevent replay and timeout issues.
- **Certificate Management**: Robust handling of X.509 certificates and metadata.
- **XML Security**: Secure signing and verification of SAML assertions.

## Documentation

- [Overview](docs/OVERVIEW.md)
- [API Reference](docs/API-REFERENCE.md)
- [Architecture](docs/ARCHITECTURE.md)
