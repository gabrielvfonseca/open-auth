# Verification API Reference

## Primary Services

### `createVerification(target: string, type: string)`
Initializes a new verification challenge and returns a code (or sends it via the appropriate service).

### `checkVerification(target: string, code: string)`
Validates the provided code against the stored value.

## Configuration

### `setupVerification(config: VerificationConfig)`
Customizes code lengths, characters, and expiration times.
