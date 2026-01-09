# Passkey API Reference

## Registration

### `getRegistrationOptions(userId: string)`
Generates options for the navigator.credentials.create() call.

### `verifyRegistration(credential: any)`
Validates the public key and stores it in the database.

## Authentication

### `getAuthenticationOptions()`
Generates options for the navigator.credentials.get() call.

### `verifyAuthentication(credential: any)`
Validates the signature against the stored public key.
