# OAuth DatabaseAdapter Reference

Location: `packages/core/src/adapters.ts` | Interface: `DatabaseAdapter` | Exported from: `@open-auth/core`

`OAuthService` depends on a `DatabaseAdapter` implementing the OAuth methods below. These are the persistence contract for the authorization server.

## OAuth Application

| Method | Signature | Purpose |
|--------|-----------|---------|
| `createOAuthApplication` | `(data: Omit<OAuthApplication,"id"\|"createdAt"\|"updatedAt">) => Promise<OAuthApplication>` | Register a new client app |
| `getOAuthApplication` | `(id: string) => Promise<OAuthApplication \| null>` | Fetch app by internal id |
| `getOAuthApplicationByClientId` | `(clientId: string) => Promise<OAuthApplication \| null>` | Fetch app by client_id (client auth) |
| `getOAuthApplications` | `(userId, organizationId) => Promise<OAuthApplication[]>` | List a user's apps in an org |
| `updateOAuthApplication` | `(id, data: Partial<OAuthApplication>) => Promise<OAuthApplication>` | Update app fields |
| `deleteOAuthApplication` | `(id: string) => Promise<void>` | Remove an app |

## OAuth Authorization (user consent)

| Method | Signature |
|--------|-----------|
| `getOAuthAuthorization` | `(userId, applicationId) => Promise<OAuthAuthorization \| null>` |
| `createOAuthAuthorization` | `(data: Omit<OAuthAuthorization,"id"\|"createdAt"\|"updatedAt">) => Promise<OAuthAuthorization>` |
| `updateOAuthAuthorization` | `(id, data: Partial<OAuthAuthorization>) => Promise<OAuthAuthorization>` |
| `getOAuthAuthorizations` | `(userId) => Promise<OAuthAuthorization[]>` |
| `deleteOAuthAuthorization` | `(id: string) => Promise<void>` |

## OAuth Authorization Code

| Method | Signature |
|--------|-----------|
| `createOAuthAuthorizationCode` | `(data: Omit<OAuthAuthorizationCode,"id"\|"createdAt"\|"used"\|"usedAt">) => Promise<OAuthAuthorizationCode>` |
| `getOAuthAuthorizationCode` | `(code: string) => Promise<OAuthAuthorizationCode \| null>` |
| `updateOAuthAuthorizationCode` | `(id, data: Partial<OAuthAuthorizationCode>) => Promise<OAuthAuthorizationCode>` |

## OAuth Token (access token)

| Method | Signature |
|--------|-----------|
| `createOAuthToken` | `(data: Omit<OAuthToken,"id"\|"createdAt"\|"lastUsedAt">) => Promise<OAuthToken>` |
| `getOAuthToken` | `(tokenHash: string) => Promise<OAuthToken \| null>` | lookup by SHA-256 hash |
| `updateOAuthToken` | `(id, data: Partial<OAuthToken>) => Promise<OAuthToken>` | returns updated record |
| `deleteOAuthToken` | `(id: string) => Promise<void>` |

## OAuth Refresh Token

| Method | Signature |
|--------|-----------|
| `createOAuthRefreshToken` | `(data: Omit<OAuthRefreshToken,"id"\|"createdAt"\|"revoked"\|"revokedAt">) => Promise<OAuthRefreshToken>` |
| `getOAuthRefreshToken` | `(tokenHash: string) => Promise<OAuthRefreshToken \| null>` |
| `updateOAuthRefreshToken` | `(id, data: Partial<OAuthRefreshToken>) => Promise<OAuthRefreshToken>` |

## Entity types (@open-auth/core)

```ts
export interface OAuthApplication {
  id: string; userId: string; organizationId: string; name: string;
  description: string | null; clientId: string; clientSecret: string; // hashed
  redirectUris: string[]; scopes: string[]; enabled: boolean;
  createdAt: Date; updatedAt: Date;
}
export interface OAuthAuthorization {
  id: string; userId: string; applicationId: string; scopes: string[];
  createdAt: Date; updatedAt: Date;
}
export interface OAuthAuthorizationCode {
  id: string; code: string; userId: string; applicationId: string;
  authorizationId: string; redirectUri: string; scopes: string[];
  codeChallenge: string | null; codeChallengeMethod: string | null;
  expiresAt: Date; used: boolean; usedAt: Date | null; createdAt: Date;
}
export interface OAuthToken {
  id: string; token: string; tokenHash: string; userId: string;
  applicationId: string; authorizationId: string; scopes: string[];
  expiresAt: Date; lastUsedAt: Date | null; createdAt: Date;
}
export interface OAuthRefreshToken {
  id: string; token: string; tokenHash: string; accessTokenId: string;
  userId: string; applicationId: string; expiresAt: Date | null;
  revoked: boolean; revokedAt: Date | null; createdAt: Date;
}
```

## Implementation notes

- `OAuthService.updateOAuthToken` returns the updated record, which `refreshAccessToken` reuses to obtain the old token's `authorizationId` and `scopes`.
- There is no `getOAuthTokenById` or `getOAuthRefreshTokenByAccessTokenId` on the adapter; revocation of the linked refresh token when an access token is revoked is a known gap (TODO in `oauth-server.ts`).
- All create methods omit system-managed fields (`id`, `createdAt`, `updatedAt`, `used`, `usedAt`, `revoked`, `revokedAt`, `lastUsedAt`).
