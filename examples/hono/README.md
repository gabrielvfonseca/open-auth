# Hono Example for open-auth

This example demonstrates how to integrate `open-auth` into a Hono application using the `open-auth` and `@open-auth/session` packages.

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `dev`: Start the dev server with hot reload.
- `build`: Build the project with Bun.
- `start`: Run the built project with Bun.
- `type-check`: Run type checking.

## Learn More

To learn more about Hono, take a look at the following resources:

- [Hono Documentation](https://hono.dev) - learn about Hono features and API.
- [open-auth Documentation](../../apps/docs) - learn about open-auth.
