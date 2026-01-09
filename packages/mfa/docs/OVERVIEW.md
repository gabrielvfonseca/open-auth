# MFA Package Overview

The `@open-auth/mfa` package adds a layer of security by requiring a second form of verification. It primarily implements the TOTP algorithm (RFC 6238).

## Key Modules

- **TOTP**: Logic for generating secrets, producing URI for QR codes, and verifying 6-digit tokens.
- **Recovery**: Management of backup codes to prevent permanent account lockout.
- **2FA Orchestration**: Higher-level logic for enabling/disabling 2FA for a user.
