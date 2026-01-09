# Password Architecture

The Password package interacts with the Database and Core packages to ensure secure storage and validation.

## Structure

```
src/
├── password.ts         # Core hashing/verification
├── password-reset.ts   # Reset token workflows
└── password-history.ts # Previous password tracking
```

## Security Design

1. **Slow Hashing**: Uses computationally expensive algorithms to prevent brute force.
2. **Salted Hashes**: Every password has a unique salt (managed by the hashing library).
3. **Token Expiry**: Reset tokens are short-lived and single-use.
