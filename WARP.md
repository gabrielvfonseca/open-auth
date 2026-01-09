# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This repository is a Turborepo-managed monorepo using **Bun** workspaces for a JavaScript/TypeScript authentication library called **Open-Auth**.

The monorepo is organized into:
- `packages/` — reusable authentication libraries (e.g. `@open-auth/auth`, `@open-auth/session`, `@open-auth/passkey`).
- `apps/` — runnable applications (e.g. Next.js docs site).
- `examples/` — framework integration examples (Hono, Elysia, Express, Astro, SvelteKit, Nuxt, Remix, Next.js).

Open-Auth provides a comprehensive suite of authentication packages including session management, WebAuthn/Passkeys, MFA, OAuth, and more.

## Commands

All commands below are intended to be run from the **repository root**, using **Bun** and **Turborepo**.

### Install dependencies

- Install all workspace dependencies:
  - `bun install`

### Monorepo-wide scripts (via Turborepo)

Root `package.json` exposes turbo-powered scripts:

- Development (run all `dev` scripts in parallel where defined):
  - `bun run dev`
- Build all packages and apps:
  - `bun run build`
- Lint everything with Biome:
  - `bun run lint`
- Format code with Biome:
  - `bun run format`
- Run tests across all packages (Vitest):
  - `bun run test`
- Dead code detection (Knip):
  - `bun run check`

### Working on a single package/app (Turborepo filters)

Use Turborepo filters to target a specific workspace:

- Core library `@open-auth/auth`:
  - Run tests: `bun run test --filter @open-auth/auth`
  - Build: `bun run build --filter @open-auth/auth`
  - Lint: `bun run lint --filter @open-auth/auth`
  - Dev mode: `bun run dev --filter @open-auth/auth`

- Example app (e.g., Next.js):
  - Dev server: `bun run dev --filter examples/nextjs`
  - Production build: `bun run build --filter examples/nextjs`

- Docs app:
  - Dev server: `bun run dev --filter docs`
  - Production build: `bun run build --filter docs`

### Git hooks (Husky)

- Husky is used for Git hooks.
- `bun run prepare` should have been run once to install Husky.
- The `pre-commit` hook runs `bun run lint` to enforce Biome checks before commits.

If hooks are not active (e.g. after cloning), run:
- `bun install`
- `bun run prepare`

## Architecture and structure

### Monorepo layout

- **Root**
  - `package.json`: declares the monorepo root (`@open-auth/root`), turbo scripts (`dev`, `build`, `lint`, `test`, `format`, `check`), and engines (Bun >= 1.0).
  - Workspaces: defined in `package.json` with `"workspaces": ["packages/*", "apps/*"]`.
  - `turbo.json`: configures the build/test/lint/dev pipelines and caching.
  - `tsconfig.json`: shared strict TypeScript configuration and path aliases.
  - `biome.json`: Biome configuration for linting/formatting.

- **Packages** (`packages/*`)
  - Core authentication libraries:
    - `@open-auth/auth`: Main authentication client
    - `@open-auth/session`: Session management
    - `@open-auth/passkey`: WebAuthn/Passkeys
    - `@open-auth/mfa`: Multi-factor authentication
    - `@open-auth/oauth`: OAuth 2.0 providers
    - `@open-auth/password`: Password hashing and validation
    - `@open-auth/database`: Prisma-based database layer
    - `@open-auth/core`: Core utilities and types
    - And more...
  - Each package:
    - Uses TypeScript with strict mode
    - Builds with `tsc` using shared root `tsconfig.json`
    - Tests with Vitest (`.test.ts` files)
    - Lints with Biome

- **Apps** (`apps/*`)
  - `apps/docs`: Next.js documentation site

- **Examples** (`examples/*`)
  - Framework integration examples: Hono, Elysia, Express, Astro, SvelteKit, Nuxt, Remix, Next.js

### TypeScript configuration

- Root `tsconfig.json` defines strict compiler options and path aliases.
- Each package/app extends the root config to inherit common settings.
- Shared TypeScript config in `packages/typescript-config`.

### Testing

- Vitest is configured as the primary test runner.
- Test files use `.test.ts` extension and are placed next to source files.
- Run all tests: `bun run test`
- Run tests for a package: `bun run test --filter @open-auth/<package>`

### Linting and formatting (Biome)

- Biome is used both for linting and formatting.
- Global configuration lives in `biome.json` at the root.
- Format on save is enabled in VS Code.
- Typical usage:
  - Monorepo-wide: `bun run lint` or `bun run format`
  - Package/app-specific: Use Turborepo filters

## Warp Workflows

The `.warp/workflows/` directory contains pre-configured workflows:

- `build-all.yaml`: Build all packages
- `monorepo-check.yaml`: Run linting and tests
- `example-dev.yaml`: Start an example app in dev mode
- `package-dev.yaml`: Start a package in dev mode
- `package-build.yaml`: Build a specific package
- `format-code.yaml`: Format all code
- `dead-code-check.yaml`: Run Knip to find dead code

## Notes for future agents

- **Always use `bun` commands**, not `npm` or `pnpm`.
- Prefer using **Turborepo filters** (`--filter`) rather than changing directories and running local installs.
- When adding new packages/apps, include them under `packages/` or `apps/`, update their `package.json` with proper `name` and scripts, and ensure they are covered by turbo pipelines (`build`, `lint`, `test`).
- Reuse the existing TypeScript and Biome configuration by extending the root configs instead of duplicating settings.
- Use `consola` for logging, never `console.log`.
- Follow the coding standards defined in `.claude/rules.md` and `.cursor/rules`.
