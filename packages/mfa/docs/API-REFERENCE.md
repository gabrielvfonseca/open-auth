# MFA API Reference

## TOTP Services

### `generateTotpSecret()`
Generates a new Base32 secret and QR code URI.

### `verifyTotpToken(secret: string, token: string)`
Validates a time-based token.

## Recovery Services

### `generateRecoveryCodes(userId: string)`
Creates a set of unique backup codes.

### `consumeRecoveryCode(userId: string, code: string)`
Validates and burns a recovery code.
