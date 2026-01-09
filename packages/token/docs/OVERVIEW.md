# Token Package Overview

The `@open-auth/token` package is the cryptographic engine for assertions in the Open-Auth platform. It ensures that tokens are secure, unforgeable, and verifiable.

## Key Modules

- **JWT**: Implementation for signed assertions using RSA or EdDSA.
- **Opaque**: Logic for database-backed tokens that don't leak information.
- **Verification**: Unified patterns for validating token expiration and integrity.
