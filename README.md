# Open-Auth

A modern, high-level authentication platform for JS/TS applications. Open-Auth provides a comprehensive suite of tools for account management, secure authentication flows, and developer-friendly integration via a modular monorepo architecture.

## Packages

The platform is divided into several specialized packages, with `open-auth` serving as the primary high-level orchestrator.

- **[open-auth](packages/auth)**: The main entry point, orchestrating user management, verification, and authentication flows.
- **[@open-auth/core](packages/core)**: Essential utilities, validation logic, and shared types.
- **[@open-auth/session](packages/session)**: Secure session management and state persistence.
- **[@open-auth/guardian](packages/guardian)**: Security features including rate limiting, risk detection, and bot protection.
- **[@open-auth/mfa](packages/mfa)**: Multi-factor authentication support (TOTP, Recovery Codes).
- **[@open-auth/passkey](packages/passkey)**: Passwordless authentication with WebAuthn/Passkeys.
- **[@open-auth/oauth](packages/oauth)** & **[sso](packages/sso)**: Integration with OAuth providers and SAML.

## Features

- 🔐 **Full Auth Lifecycle**: Sign-up, Sign-in, Sign-out, and Account Deletion.
- 📧 **Verification**: Integrated email verification and magic link support.
- 🛡️ **Security First**: Built-in account lockout, risk-based assessment, and rate limiting.
- 📱 **Modern Auth**: First-class support for Passkeys and Multi-Factor Authentication.
- 🤝 **Integrations**: Standalone adapters for Prisma, Drizzle, and more.
- 🏗️ **Monorepo Architecture**: Clean separation of concerns managed with Turborepo and Bun.

## Installation

```bash
bun add open-auth
```

## Quick Start

```typescript
import { createAuthClient } from 'open-auth';

const auth = createAuthClient({
  database: myDatabaseAdapter,
  session: {
    cookieName: "auth_session",
  },
  // ... other configuration
});

// Use the orchestrated services
const { session, user } = await auth.getCurrentSession();
```

## Examples

Explore our integration examples to see Open-Auth in action:

- [Next.js](examples/nextjs)
- [Astro](examples/astro)
- [Remix](examples/remix)
- [SvelteKit](examples/svelte)
- [Hono](examples/hono)
- [Elysia](examples/elysia)
- [Express](examples/expressjs)
- [Nuxt](examples/nuxt)

## Development

```bash
bun install
bun run build
bun run test
```

## License

MIT

