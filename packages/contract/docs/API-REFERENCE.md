# Contract API Reference

## User Schemas

### `UserSchema`
Defines the structure of a user entity.
- `id`: string (ULID/UUID)
- `email`: string
- `emailVerified`: boolean
- `metadata`: object

## Auth Schemas

### `LoginRequestSchema`
Validation for sign-in payloads.

### `RegisterRequestSchema`
Validation for sign-up payloads.

## Session Schemas

### `SessionSchema`
Structure for active session tokens and metadata.
