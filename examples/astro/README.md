# Astro Example for open-auth

This example demonstrates how to integrate `open-auth` into an Astro application using the `open-auth` and `@open-auth/session` packages.

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

Open [http://localhost:4321](http://localhost:4321) with your browser to see the result.

## Available Scripts

- `dev`: Start the dev server.
- `build`: Build the production server.
- `start`: Start the production server.
- `type-check`: Run Astro check for types.

## Learn More

To learn more about Astro, take a look at the following resources:

- [Astro Documentation](https://docs.astro.build) - learn about Astro features and API.
- [open-auth Documentation](../../apps/docs) - learn about open-auth.
