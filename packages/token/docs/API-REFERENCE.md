# Token API Reference

## JWT Services

### `signJwt(payload: object, options: SignOptions)`
Generates a signed JWT.

### `verifyJwt(token: string)`
Validates signature and claims of a JWT.

## Opaque Token Services

### `generateOpaqueToken(length: number)`
Creates a high-entropy random string.

### `hashOpaqueToken(token: string)`
Prepares a token for secure database storage.
