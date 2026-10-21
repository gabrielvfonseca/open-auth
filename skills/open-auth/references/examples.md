# OAuth Usage Examples

Location: `packages/oauth/src/oauth-server.ts`, `packages/oauth/src/oauth.ts` |
Pattern references across `packages/auth/src/client.ts` and `examples/`

## Example 1: Create an OAuth application (authorization server)

```ts
import { OAuthService } from "@open-auth/oauth";
import { createPrismaAdapter } from "@open-auth/adapter-prisma";
import { prisma } from "./prisma";

const oauth = new OAuthService(createPrismaAdapter(prisma), {
  enabled: true,
  authorizationCodeLifetime: 600,
  accessTokenLifetime: 3600,
  refreshTokenLifetime: 60 * 60 * 24 * 30,
});

const { id, clientId, clientSecret } = await oauth.createOAuthApplication(
  "user_123",
  "org_456",
  "My Third-Party App",
  "Demo OAuth client",
  ["https://client.example.com/callback"],
  ["read:user", "write:user", "read:organization"]
);
// clientSecret is plaintext — show it to the developer once, then it's hashed in storage
```

## Example 2: Client credentials token exchange

```ts
// Verify client_id / client_secret (e.g. Authorization: Basic header)
const app = await oauth.verifyClientCredentials(clientId, clientSecret);
if (!app) return new Response("Unauthorized", { status: 401 });
// app: { id, organizationId, enabled }
```

## Example 3: Authorization code flow with PKCE

```ts
// Step A: after user consents, create the code
const code = await oauth.createAuthorizationCode(
  userId,
  applicationId,
  "https://client.example.com/callback",
  ["read:user"],
  codeChallenge,     // base64url SHA-256 of verifier
  "S256"
);

// Step B: client exchanges code + verifier
const tokens = await oauth.exchangeCodeForToken(
  code,
  clientId,
  "https://client.example.com/callback",
  codeVerifier
);
// tokens: { accessToken, refreshToken, expiresIn }
```

## Example 4: Verify a bearer access token (protected resource)

```ts
const payload = await oauth.verifyAccessToken(accessToken);
if (!payload) return new Response("Invalid token", { status: 401 });
// payload: { userId, scopes: string[], applicationId }
// enforce scopes: payload.scopes.includes("read:user")
```

## Example 5: Refresh an access token

```ts
const refreshed = await oauth.refreshAccessToken(
  refreshToken,
  clientId,
  clientSecret
);
// refreshed: { accessToken, refreshToken, expiresIn } | null
```

## Example 6: Revoke a token (RFC 7009)

```ts
await oauth.revokeToken(token, "refresh_token");
// revokes the refresh token and expires its linked access token
```

## Example 7: External provider login (OAuth client)

```ts
import { google } from "@open-auth/oauth";
import { encodeBase64 } from "@oslojs/encoding";
import { crypto } from "node:crypto";

// Redirect user to Google
const state = encodeBase64(crypto.getRandomValues(new Uint8Array(32)));
// store state in session/cookie
const url = await google.createAuthorizationURL(state);
return Response.redirect(url.toString());

// Callback handler
const tokens = await google.validateAuthorizationCode(code);
const profile = await google.getUserProfile(tokens.accessToken);
// { id, email, name, avatarUrl } → link/create local account + session
```

## Example 8: List & manage a user's applications

```ts
const apps = await oauth.getUserOAuthApplications(userId, organizationId);
const auths = await oauth.getUserAuthorizations(userId);

const ok = await oauth.hasAuthorization(
  userId,
  applicationId,
  ["read:user", "write:user"]
);

await oauth.updateOAuthApplication(appId, userId, { name: "Renamed" });
await oauth.deleteOAuthApplication(appId, userId);
```

## Example 9: Rotate a client secret

```ts
const newSecret = await oauth.regenerateClientSecret(applicationId, userId);
// return newSecret to the developer once
```

## Key gotchas

- `clientSecret` / raw tokens are returned **plaintext only once**; afterwards only hashes exist in storage.
- Authorization codes are single-use; `exchangeCodeForToken` marks them used.
- PKCE `S256` requires `codeVerifier` on exchange when a `codeChallenge` was stored.
- `refreshAccessToken` revokes the previous access + refresh tokens (token rotation).
- Revoking an `access_token` does **not** automatically revoke its linked refresh token (known adapter gap).
