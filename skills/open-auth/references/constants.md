# OAuth Constants Reference

Location: `packages/oauth/src/constants.ts` | Exported from: `@open-auth/oauth`

## OAUTH_SCOPES

Exported as `as const`, so each value is a string literal type.

```ts
import { OAUTH_SCOPES } from "@open-auth/oauth";

OAUTH_SCOPES.READ_USER          // "read:user"
OAUTH_SCOPES.WRITE_USER         // "write:user"
OAUTH_SCOPES.READ_ORGANIZATION  // "read:organization"
OAUTH_SCOPES.WRITE_ORGANIZATION // "write:organization"
OAUTH_SCOPES.ADMIN              // "admin"
```

Type: `{ readonly READ_USER: "read:user"; readonly WRITE_USER: "write:user"; readonly READ_ORGANIZATION: "read:organization"; readonly WRITE_ORGANIZATION: "write:organization"; readonly ADMIN: "admin" }`

## DEFAULT_SCOPES

The default scope set granted to a new `OAuthAuthorization` unless a narrower set is requested.

```ts
import { DEFAULT_SCOPES } from "@open-auth/oauth";

// [
//   "read:user",
//   "write:user",
//   "read:organization",
//   "write:organization"
// ]
```

Type: `readonly ["read:user", "write:user", "read:organization", "write:organization"]`

## Usage

Pass scopes (string[]) to `createOAuthApplication`, `createAuthorizationCode`, and check them with `hasAuthorization`. Scopes are stored on `OAuthApplication`, `OAuthAuthorization`, `OAuthAuthorizationCode`, `OAuthToken`.
