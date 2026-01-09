# Token Architecture

The Token package relies on Core's encryption primitives and Oslojs/crypto.

## Structure

```
src/
├── token.ts    # Main logic for JWT/Opaque tokens
├── types.ts    # Shared token interfaces
└── index.ts    # Entry point
```

## Security Design

1. **Algorithm Selection**: Defaults to secure, modern algorithms like RS256 or better.
2. **Clock Skew**: Verification includes a configurable grace period for timestamp checks.
3. **Payload Safety**: Encourages minimal data in JWTs to prevent overflow or leakage.
