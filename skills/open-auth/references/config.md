# OAuth Config & AuthClient Integration Reference

Location: `packages/auth/src/config.ts` (`OAuthConfig`, `OAuthProviderConfig`) |
`packages/auth/src/client.ts` (`AuthClient.oauth`) |
`packages/oauth/src/oauth-server.ts` (`OAuthConfig`) |
Exported from: `@open-auth/auth`, `@open-auth/oauth`

## Two OAuth configs

There are two distinct `OAuthConfig` shapes:

1. **`@open-auth/oauth` `OAuthConfig`** — runtime config for `OAuthService`:
   ```ts
   export interface OAuthConfig {
     enabled?: boolean;
     authorizationCodeLifetime?: number; // seconds, default 600
     accessTokenLifetime?: number;       // seconds, default 3600
     refreshTokenLifetime?: number;      // seconds, default 30 days
   }
   ```

2. **`@open-auth/auth` `OAuthConfig`** — high-level config in `AuthConfig.oauth`:
   ```ts
   export interface OAuthProviderConfig {
     clientId: string;
     clientSecret: string;
     scopes?: string[];
     authorizationUrl?: string;
     tokenUrl?: string;
   }
   export interface OAuthConfig {
     enabled?: boolean;          // default false
     providers?: {
       google?, github?, microsoft?, apple?, discord?, slack?,
       [key: string]: OAuthProviderConfig | undefined;
     };
     redirectUri?: string;       // default redirect after OAuth
     allowLinking?: boolean;     // default true
   }
   ```

## Wiring OAuth into AuthClient

`AuthClient` constructs `OAuthService` from the adapter and `config.oauth`:

```ts
// packages/auth/src/client.ts:155
this.oauth = new OAuthService(adapter, config.oauth);
```

Note: `AuthConfig.oauth` is passed directly as the `OAuthService` constructor config, so `enabled`, `authorizationCodeLifetime`, `accessTokenLifetime`, `refreshTokenLifetime` are honored there too.

Access it via `auth.oauth.<method>()`:

```ts
import { createAuthClient } from "open-auth";
import { createPrismaAdapter } from "@open-auth/adapter-prisma";
import { prisma } from "./prisma";

const auth = createAuthClient({
  database: createPrismaAdapter(prisma),
  baseUrl: "https://app.example.com",
  secret: process.env.AUTH_SECRET,
  oauth: {
    enabled: true,
    redirectUri: "https://app.example.com/sign-in/oauth/callback",
    allowLinking: true,
    authorizationCodeLifetime: 600,
    accessTokenLifetime: 3600,
    refreshTokenLifetime: 60 * 60 * 24 * 30,
  },
});

// In a route handler:
const app = await auth.oauth.createOAuthApplication(
  userId, organizationId, "My App", null,
  ["https://app.example.com/callback"],
  ["read:user", "write:user"]
);
```

## Prisma schema

OAuth tables are expected in your Prisma schema (see examples, e.g. `examples/nextjs/prisma/schema.prisma`): `OAuthApplication`, `OAuthAuthorization`, `OAuthAuthorizationCode`, `OAuthToken`, `OAuthRefreshToken`. The `createPrismaAdapter` maps these to the `DatabaseAdapter` methods.

## Prerequisites

- `DATABASE_URL` set for the adapter.
- A `DatabaseAdapter` implementation (`@open-auth/adapter-prisma`, `@open-auth/adapter-drizzle`, `@open-auth/adapter-memory`, or custom).
- For external provider login, set provider env vars (`GITHUB_CLIENT_ID`, etc.) — see `references/client.md` and `references/providers.md`.
