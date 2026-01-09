# Recovery Architecture

The Recovery package is a high-security domain service that interacts closely with the Identity and Database packages.

## Structure

```
src/
├── recovery-codes.ts # Logic for code lifecycle
├── recovery-types.ts # Shared recovery interfaces
└── index.ts          # Entry point
```

## Security Design

1. **At-Rest Protection**: Recovery codes are never stored in plain text; they are hashed before being saved to the database.
2. **One-Time Consumption**: Once a code is used successfully, it is purged from the system.
3. **Notification**: Successful recovery attempts trigger immediate security notifications to the user's registered contact methods.
