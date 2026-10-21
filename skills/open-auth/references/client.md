# OAuth Client Reference

Location: `packages/oauth/src/oauth.ts` | Exported from: `@open-auth/oauth`

## Providers

Three `arctic` providers are pre-configured as module-level singletons using env vars:

```ts
import { github, google, microsoft } from "@open-auth/oauth";

github  // GitHub   (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)
google  // Google   (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
microsoft // Microsoft Entra ID (MICROSOFT_TENANT_ID, MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET)
```

Redirect URIs default to `${process.env.NEXT_PUBLIC_APP_URL}/sign-in/oauth/<provider>/callback`.

> These are singletons; env vars must be set at import time. To add a provider, instantiate an `arctic` provider in `oauth.ts` and export it from `src/index.ts`.

## Required env vars

| Provider | Env vars |
|----------|----------|
| GitHub | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` |
| Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Microsoft | `MICROSOFT_TENANT_ID`, `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` |
| All | `NEXT_PUBLIC_APP_URL` |

## Typical client flow

### 1. Initiate login (generate authorization URL + state)

```ts
import { github } from "@open-auth/oauth";
import { encodeBase64 } from "@oslojs/encoding";
import { crypto } from "node:crypto";

// CSRF protection state
const state = encodeBase64(crypto.getRandomValues(new Uint8Array(32)));
// Persist `state` in a cookie/session to verify on callback

const url = await github.createAuthorizationURL(state);
// Respond with 302 redirect to url.toString()
```

### 2. Handle the callback (exchange code for tokens + profile)

```ts
import { github } from "@open-auth/oauth";

// `code` and `state` come from the query string; verify state against stored value
const tokens = await github.validateAuthorizationCode(code);
// tokens: { accessToken, refreshToken?, expiresAt? }

const user = await github.getUserProfile(tokens.accessToken);
// user: { id, email, name, avatarUrl, ... } (provider-specific shape)

// Link or create the local account, then create a session
```

### 3. Provider-agnostic helper (arctic base)

Each provider is an `arctic` instance, so you also have access to:
- `createAuthorizationURL(state, scopes?)`
- `validateAuthorizationCode(code)`
- `getUserProfile(accessToken)`
- `createLogoutURL(...)` (where supported)

## Notes

- Built on `arctic` (`^3.7.0`).
- `@open-auth/oauth-providers` offers an alternative registry with Apple included and env-validated instantiation (`getProvider`, `isProviderConfigured`, `getConfiguredProviders`). See `references/providers.md`.
