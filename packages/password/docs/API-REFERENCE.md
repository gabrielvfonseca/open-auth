# Password API Reference

## Password Logic

### `hashPassword(password: string): Promise<string>`
Hashes a plain-text password for storage.

### `verifyPassword(password: string, hash: string): Promise<boolean>`
Checks if a password matches a stored hash.

## Reset Flows

### `generateResetToken(userId: string)`
Creates a secure token for password recovery.

### `resetPassword(token: string, newPassword: string)`
Updates the user's password if the token is valid.
