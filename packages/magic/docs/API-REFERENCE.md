# Magic API Reference

## Primary Services

### `sendMagicLink(email: string)`
Generates a token, builds the link, and triggers an email send.

### `verifyMagicLink(token: string)`
Validates the token and returns the associated user identity.

## Helper Logic

### `generateMagicToken()`
Internal utility for creating high-entropy tokens.
