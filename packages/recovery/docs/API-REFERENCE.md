# Recovery API Reference

## Recovery Services

### `generateAccountRecoveryCodes(userId: string)`
Creates a new set of master recovery codes for the user.

### `verifyRecoveryCode(userId: string, code: string)`
Validates and immediately consumes a recovery code.

## Types

### `RecoveryCode`
Interface representing a single recovery code and its status (e.g., hashed value, usage date).
