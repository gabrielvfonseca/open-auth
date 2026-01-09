# Magic Architecture

The Magic package acts as a bridge between the Identity, Token, and Email services.

## Structure

```
src/
├── magic-link.ts   # Main orchestration logic
└── index.ts        # Public API
```

## Security Design

1. **Short Lifespan**: Magic links typically expire within 10-15 minutes.
2. **One-Time Use**: Tokens are invalidated immediately after a successful login.
3. **Entropy**: Uses cryptographically secure random number generators for token creation.
