# Authorization Server Reference

Location: `packages/oauth/src/oauth-server.ts` | Class: `OAuthService` | Exported from: `@open-auth/oauth`

`OAuthService` implements the server side of OAuth 2.0. Construct it with a `DatabaseAdapter` (from `@open-auth/core`) and an optional `OAuthConfig`.

## Construction

```ts
import { OAuthService } from "@open-auth/oauth";
import type { DatabaseAdapter } from "@open-auth/core";

const service = new OAuthService(adapter, {
  enabled: true,                              // default true
  authorizationCodeLifetime: 600,             // seconds, default 10 min
  accessTokenLifetime: 3600,                  // seconds, default 1 hour
  refreshTokenLifetime: 60 * 60 * 24 * 30,    // seconds, default 30 days
});
```

## Methods

### createOAuthApplication

Register a new OAuth client application.

```ts
const { id, clientId, clientSecret } = await service.createOAuthApplication(
  userId,                  // string
  organizationId,          // string
  name,                    // string
  description,             // string | null
  redirectUris,            // string[]
  scopes                   // string[]
);
```

- Generates `clientId` (base64 URL-safe, 32 chars).
- Generates a raw `clientSecret`, hashes it with Argon2, stores the hash.
- Returns the plain `clientSecret` **only once**.
- Throws if `enabled` is `false`.

### verifyClientCredentials

Validate a client's `client_id` / `client_secret` (Basic auth or body).

```ts
const app = await service.verifyClientCredentials(clientId, clientSecret);
// { id, organizationId, enabled } | null
```

Returns `null` if the application is missing, disabled, or the secret doesn't match (Argon2 verify).

### regenerateClientSecret

Rotate an application's client secret.

```ts
const newSecret = await service.regenerateClientSecret(applicationId, userId);
// string (plain, returned once)
```

- Verifies ownership (`application.userId === userId`).
- Hashes the new secret with Argon2, updates storage, returns plaintext once.

### createAuthorizationCode (PKCE supported)

Issue an authorization code after user consent.

```ts
const code = await service.createAuthorizationCode(
  userId,
  applicationId,
  redirectUri,           // must be in application.redirectUris
  scopes,                // string[]
  codeChallenge?,        // string (PKCE challenge)
  codeChallengeMethod?   // "S256" | "plain"
);
```

- Creates or updates the `OAuthAuthorization` for (userId, applicationId).
- Stores the code with `expiresAt` (authorizationCodeLifetime).
- Returns the raw `code` to send back to the client.

### exchangeCodeForToken

Exchange an authorization code (and PKCE verifier) for an access + refresh token pair.

```ts
const result = await service.exchangeCodeForToken(
  code,
  clientId,
  redirectUri,
  codeVerifier?          // required if a codeChallenge was present
);
// { accessToken, refreshToken, expiresIn } | null
```

- Validates the code exists, is unused, and not expired.
- Verifies PKCE if a challenge was stored (SHA-256 of verifier for `S256`).
- Confirms `clientId` and `redirectUri` match the application.
- Marks the code as used.
- Creates an `OAuthToken` (SHA-256 hashed) and an `OAuthRefreshToken`.

### verifyAccessToken

Validate a bearer access token.

```ts
const payload = await service.verifyAccessToken(token);
// { userId, scopes, applicationId } | null
```

- Hashes the token (SHA-256) and looks it up.
- Checks expiry and that the application is still enabled.
- Updates `lastUsedAt` on success.

### refreshAccessToken

Rotate an access token using a refresh token.

```ts
const result = await service.refreshAccessToken(
  refreshToken,
  clientId,
  clientSecret
);
// { accessToken, refreshToken, expiresIn } | null
```

- Verifies client credentials.
- Looks up the refresh token (not revoked, not expired, matches application).
- Revokes the old access token (expiresAt = epoch) and old refresh token (revoked = true).
- Issues a new access + refresh token pair with the same scopes/authorization.

### revokeToken

Revoke an access or refresh token (RFC 7009).

```ts
const ok = await service.revokeToken(token, "access_token" | "refresh_token");
// boolean
```

- For `refresh_token`: revokes the refresh token and expires the linked access token.
- For `access_token`: expires the access token (associated refresh-token cleanup is a TODO).

### User / application management

```ts
// List a user's granted authorizations (with application names)
const auths = await service.getUserAuthorizations(userId);
// { id, applicationId, applicationName, scopes, createdAt }[]

// Check whether a user has granted an app all requested scopes
const has = await service.hasAuthorization(userId, applicationId, requestedScopes);
// boolean

// List a user's OAuth applications within an org
const apps = await service.getUserOAuthApplications(userId, organizationId);
// OAuthApplication[]

// Update an application (owner only)
const ok = await service.updateOAuthApplication(applicationId, userId, {
  name?, description?, redirectUris?, scopes?, enabled?
});
// boolean

// Delete an application (owner only)
const ok = await service.deleteOAuthApplication(applicationId, userId);
// boolean
```

## Security notes

- Client secrets are hashed with Argon2: `memoryCost: 19456`, `timeCost: 2`, `outputLen: 32`, `parallelism: 1`.
- Access/refresh tokens are SHA-256 hashed before storage; only plaintext returned once.
- PKCE `S256` challenge verification uses SHA-256 of the code verifier.
- Authorization codes are single-use and short-lived (default 10 min).

## Adapter methods used

`OAuthService` calls these `DatabaseAdapter` methods (see `references/adapter.md`):
`createOAuthApplication`, `getOAuthApplication`, `getOAuthApplicationByClientId`,
`getOAuthApplications`, `updateOAuthApplication`, `deleteOAuthApplication`,
`getOAuthAuthorization`, `createOAuthAuthorization`, `updateOAuthAuthorization`,
`getOAuthAuthorizations`, `deleteOAuthAuthorization`,
`createOAuthAuthorizationCode`, `getOAuthAuthorizationCode`,
`updateOAuthAuthorizationCode`,
`createOAuthToken`, `getOAuthToken`, `updateOAuthToken`, `deleteOAuthToken`,
`createOAuthRefreshToken`, `getOAuthRefreshToken`, `updateOAuthRefreshToken`.
