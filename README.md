# Open-Auth

Simple JS/TS authentication library supporting JWT, sessions, and OAuth.

## Features

- **JWT Utilities**: Easy signing and verification of JSON Web Tokens.
- **Monorepo Structure**: Managed with Turborepo and pnpm workspaces.
- **Next.js Example**: A playground for testing auth flows.
- **Docusaurus Docs**: Comprehensive documentation.

## Installation

```bash
pnpm install @open-auth/core
```

## Usage

```typescript
import { signToken, verifyToken } from '@open-auth/core';

const secret = 'your-secret';
const token = signToken({ sub: 'user-1' }, secret);
const decoded = verifyToken(token, secret);
```

## Development

```bash
pnpm install
pnpm build
pnpm dev
```

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-core`.
3. Make your changes and commit them.
4. Push to your branch and create a pull request.

## License

MIT
