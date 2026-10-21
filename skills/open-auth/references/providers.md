# OAuth Provider Registry Reference

Location: `packages/oauth-providers/src/` | Exported from: `@open-auth/oauth-providers`

This package is a registry of configured `arctic` OAuth identity providers, validated via `@t3-oss/env-core` (zod). Providers are `null` when their env vars are missing, so you can check availability at runtime.

## Providers

```ts
import { github, google, microsoft, apple } from "@open-auth/oauth-providers";
import { getProvider, isProviderConfigured, getConfiguredProviders } from "@open-auth/oauth-providers";
```

| Provider | Env vars required | Class |
|----------|-------------------|-------|
| GitHub | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | `arctic.GitHub` |
| Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | `arctic.Google` |
| Microsoft Entra ID | `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` | `arctic.MicrosoftEntraId` (tenant "common") |
| Apple | `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` | `arctic.Apple` |

> Note: `@open-auth/oauth` (core package) also exports `github`, `google`, `microsoft` directly but does **not** include Apple and does not gate on env presence. Use `@open-auth/oauth-providers` when you want env-aware, optionally-instantiated providers with Apple support.

## Helper functions

### getProvider(type)

```ts
import type { OAuthProviderType } from "@open-auth/oauth-providers";

const provider = getProvider("github"); // GitHub | null
```

Returns the provider instance for `"github" | "google" | "microsoft" | "apple"`, or `null` if not configured.

### isProviderConfigured(type)

```ts
if (isProviderConfigured("apple")) {
  // apple is available
}
```

### getConfiguredProviders()

```ts
const available: OAuthProviderType[] = getConfiguredProviders();
// e.g. ["github", "google"]
```

## Types

```ts
export type OAuthProviderType = "github" | "google" | "microsoft" | "apple";

export interface OAuthUserInfo {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: OAuthProviderType;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}
```

## Env validation

Env is parsed with `createEnv` from `@t3-oss/env-core`; all OAuth provider vars are `z.string().optional()` and `emptyStringAsUndefined: true`. Missing vars → provider is `null`.

## Typical use with the registry

```ts
import { getProvider } from "@open-auth/oauth-providers";

const provider = getProvider("google");
if (!provider) throw new Error("Google not configured");

const url = await provider.createAuthorizationURL(state);
// ... callback ...
const tokens = await provider.validateAuthorizationCode(code);
const profile = await provider.getUserProfile(tokens.accessToken);
```
