# Next.js Example for open-auth

This example demonstrates how to integrate `open-auth` into a Next.js 14 (App Router) application using the `open-auth` and other domain packages.

## Features

- Email & Password Authentication
- Passkey (WebAuthn) Support
- Two-Factor Authentication (TOTP)
- Session Management
- OAuth / SSO ready
- Modern UI with Tailwind CSS

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

- `dev`: Start the dev server.
- `build`: Build the production application.
- `start`: Start the production server.
- `lint`: Run ESLint.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [open-auth Documentation](../../apps/docs) - learn about open-auth.
