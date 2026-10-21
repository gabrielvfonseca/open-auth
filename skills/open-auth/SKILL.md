---
name: open-auth
description: Comprehensive skill for the Open-Auth OAuth ecosystem (@open-auth/oauth, @open-auth/oauth-providers): OAuth 2.0 / OpenID Connect client flows, the OAuthService authorization server, scopes/constants, provider registry, DatabaseAdapter OAuth interface, AuthClient integration, and config. Use for adding providers, implementing authorization-server endpoints, managing OAuth tokens/applications, and wiring OAuth into an AuthClient.
references:
  - client
  - server
  - constants
  - providers
  - adapter
  - config
  - examples
---

# Open-Auth OAuth Skill

The Open-Auth OAuth ecosystem covers two packages:

1. **`@open-auth/oauth`** — the core OAuth 2.0 / OpenID Connect service.
   - **OAuth client** (`oauth.ts`) — pre-configured `arctic` providers (GitHub, Google, Microsoft Entra ID) for external login flows.
   - **Authorization server** (`oauth-server.ts`) — `OAuthService` class acting as an OAuth authorization server (applications, tokens, PKCE, refresh, revoke).
   - **Constants** (`constants.ts`) — `OAUTH_SCOPES` and `DEFAULT_SCOPES`.
   - Source: `packages/oauth/src/` | Entry: `src/index.ts`

2. **`@open-auth/oauth-providers`** — provider registry & configuration.
   - Registry of `arctic` provider instances (GitHub, Google, Microsoft Entra ID, Apple) keyed by env vars.
   - Helpers: `getProvider(type)`, `isProviderConfigured(type)`, `getConfiguredProviders()`.
   - Source: `packages/oauth-providers/src/` | Entry: `src/index.ts`

Install:

```
bun add @open-auth/oauth @open-auth/oauth-providers
```

Build:

```
bun run build --filter @open-auth/oauth
bun run build --filter @open-auth/oauth-providers
```

Type-check:

```
bun run type-check --filter @open-auth/oauth
bun run type-check --filter @open-auth/oauth-providers
```

## Quick Decision Trees

### "I need to log users in with an external provider (OAuth client)"

```
Need external OAuth login?
├─ GitHub → import { github } from "@open-auth/oauth" → createAuthorizationURL(state) → redirect
├─ Google → import { google } from "@open-auth/oauth" → createAuthorizationURL(state) → redirect
├─ Microsoft Entra ID → import { microsoft } from "@open-auth/oauth" → createAuthorizationURL(state) → redirect
├─ Apple / provider-registry → @open-auth/oauth-providers getProvider("apple") → createAuthorizationURL(state)
└─ Handle callback → provider.validateAuthorizationCode(code) → getUserProfile(tokens.accessToken) → link/create account
```

See `references/client.md`, `references/providers.md`.

### "I need to act as an OAuth 2.0 authorization server"

```
Need authorization server?
├─ Create OAuth application → OAuthService.createOAuthApplication(userId, orgId, name, desc, redirectUris, scopes)
├─ Verify client credentials → OAuthService.verifyClientCredentials(clientId, clientSecret)
├─ Rotate client secret → OAuthService.regenerateClientSecret(applicationId, userId)
├─ Create authorization code (PKCE) → OAuthService.createAuthorizationCode(userId, appId, redirectUri, scopes, codeChallenge?, method?)
├─ Exchange code for token → OAuthService.exchangeCodeForToken(code, clientId, redirectUri, codeVerifier?)
├─ Verify access token → OAuthService.verifyAccessToken(token)
├─ Refresh access token → OAuthService.refreshAccessToken(refreshToken, clientId, clientSecret)
├─ Revoke token → OAuthService.revokeToken(token, "access_token" | "refresh_token")
├─ List user authorizations → OAuthService.getUserAuthorizations(userId)
├─ Check authorization → OAuthService.hasAuthorization(userId, appId, requestedScopes)
├─ List user applications → OAuthService.getUserOAuthApplications(userId, orgId)
├─ Update application → OAuthService.updateOAuthApplication(appId, userId, data)
└─ Delete application → OAuthService.deleteOAuthApplication(appId, userId)
```

See `references/server.md`.

### "I need scopes"

```
Need scopes?
├─ read:user, write:user → OAUTH_SCOPES.READ_USER / WRITE_USER
├─ read:organization, write:organization → OAUTH_SCOPES.READ_ORGANIZATION / WRITE_ORGANIZATION
├─ admin → OAUTH_SCOPES.ADMIN
├─ Default grant set → DEFAULT_SCOPES ([read:user, write:user, read:organization, write:organization])
```

See `references/constants.md`.

### "I need to wire OAuth into AuthClient"

```
Need AuthClient OAuth integration?
├─ Configure OAuthConfig in AuthConfig (oauth: { enabled, providers, redirectUri, allowLinking })
├─ AuthClient constructs OAuthService(adapter, config.oauth) → auth.oauth
├─ Use DatabaseAdapter OAuth methods (createOAuthApplication, getOAuthApplicationByClientId, createOAuthToken, ...)
└─ Call auth.oauth.<method>() from routes/handlers
```

See `references/config.md`, `references/adapter.md`, `references/examples.md`.

## Product Index

| Area | Reference |
|------|-----------|
| OAuth client (arctic providers, callback flow) | `references/client.md` |
| Authorization server (OAuthService full API) | `references/server.md` |
| Scopes & constants | `references/constants.md` |
| Provider registry (@open-auth/oauth-providers) | `references/providers.md` |
| DatabaseAdapter OAuth interface | `references/adapter.md` |
| OAuthConfig & AuthClient wiring | `references/config.md` |
| Usage examples & recipes | `references/examples.md` |
