# Verification Architecture

The Verification package is designed to be multi-channel and relies on Core for shared logic and Database/Cache for state.

## Structure

```
src/
├── verification.ts # Core orchestration logic
├── types.ts        # Shared interfaces
└── index.ts        # Public API
```

## Security Design

1. **Attempt Limits**: Limits the number of failed verification attempts before the challenge is permanently invalidated.
2. **Entropy**: Ensures that verification codes are not predictable.
3. **Atomic Consumption**: Ensures that once a code is successfully checked, it cannot be used again.
