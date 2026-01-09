# Session Architecture

The Session package depends on the Session-Store for persistence and the Core package for validation.

## Structure

```
src/
├── session.ts      # Session management logic
├── device.ts       # Device tracking logic
└── index.ts        # Entry point
```

## Security Design

1. **Random Identifiers**: Session IDs are generated with cryptographically secure high entropy.
2. **Short Lifetimes**: Sessions are configured with sliding or absolute expiration.
3. **Binding**: Sessions are optionally bound to specific device characteristics to prevent hijacking.
4. **Revocation**: Supports immediate global logout by purging all sessions for a user ID.
