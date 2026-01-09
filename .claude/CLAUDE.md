# CLAUDE.md - Open Auth Monorepo

## Quick Start Commands
- **Install Dependencies**: `bun install`
- **Build All Packages**: `bun run build`
- **Build Specific Package**: `bun run build --filter=@open-auth/<package>`
- **Run All Tests**: `bun run test`
- **Run Tests for Package**: `bun run test --filter=@open-auth/<package>`
- **Lint Everything**: `bun run lint`
- **Format Code**: `bun run format`
- **Dead Code Check**: `bun run check` (Knip)
- **Development Mode**: `bun run dev` (runs all dev scripts in parallel)

## Project Structure
- **`packages/`**: Core authentication libraries (auth, session, passkey, mfa, etc.)
- **`apps/docs/`**: Documentation site (Next.js)
- **`examples/`**: Framework integration examples (Hono, Elysia, Express, Astro, SvelteKit, Nuxt, Remix, Next.js)

## Package Manager
This project uses **Bun** as the package manager. All commands should use `bun` instead of `npm` or `pnpm`.

## Code Style Guidelines
- **Module System**: ESM (ES Modules) only
- **Language**: TypeScript with strict mode
- **Formatter**: Biome (configured in `biome.json`)
- **Validation**: Zod for runtime type checking
- **Type Safety**: No `any` types allowed
- **Naming Conventions**:
  - Variables/Functions: `camelCase`
  - Classes/Types: `PascalCase`
  - Files: `kebab-case.ts`
- **Architecture**: Functional, service-oriented architecture
- **Testing**: Vitest for unit and integration tests

## Monorepo Workflow
- Use Turborepo filters to target specific packages: `--filter=@open-auth/<package>`
- Build dependencies are automatically resolved by Turborepo
- Changes to one package trigger rebuilds of dependent packages
- All packages share the root `tsconfig.json` and `biome.json` configurations
