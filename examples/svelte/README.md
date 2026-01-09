# Svelte Example for open-auth

This example demonstrates how to integrate `open-auth` into a SvelteKit application using the `open-auth` and `@open-auth/session` packages.

## Getting Started

### 1. Installation

Install dependencies:

```bash
bun install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

You'll need a PostgreSQL database.

### 3. Run the Development Server

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Available Scripts

- `dev`: Start the dev server with Vite.
- `build`: Build the production server.
- `preview`: Preview the production build locally.
- `check`: Run svelte-check for types and sync.

## Learn More

To learn more about SvelteKit, take a look at the following resources:

- [SvelteKit Documentation](https://kit.svelte.dev) - learn about SvelteKit features and API.
- [open-auth Documentation](../../apps/docs) - learn about open-auth.
