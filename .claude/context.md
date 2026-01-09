# Project Overview

Open-Auth is a modular, high-performance authentication and authorization monorepo built with Bun, Turborepo, and Biome. It provides a suite of packages for handling everything from session management to WebAuthn (Passkeys) and MFA.

## Tech Stack
- **Runtime**: Bun
- **Monorepo Tooling**: Turborepo
- **Linter/Formatter**: Biome
- **Testing**: Vitest
- **Database**: Prisma (PostgreSQL / SQLite / MySQL)
- **Frameworks**: Hono, Elysia, Express, Astro, SvelteKit, Nuxt, Remix

## Core Components
- **@open-auth/auth**: Main authentication client and entry point
- **@open-auth/session**: SHA-256 hashed session management
- **@open-auth/guardian**: Security features (rate limiting, Turnstile, etc.)
- **@open-auth/passkey**: WebAuthn/Passkeys implementation
- **@open-auth/mfa**: Multi-factor authentication
- **@open-auth/oauth**: OAuth 2.0 providers
- **@open-auth/password**: Password hashing and validation
- **@open-auth/database**: Prisma-based database layer
- **@open-auth/core**: Core utilities and types

## Architecture
- **Monorepo Structure**: Managed by Turborepo with Bun workspaces
- **Package Organization**: `packages/*` for libraries, `apps/*` for applications, `examples/*` for framework integrations
- **Build System**: TypeScript compilation with shared tsconfig
- **Code Quality**: Biome for linting/formatting, Knip for dead code detection
