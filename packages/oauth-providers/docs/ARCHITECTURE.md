# OAuth Providers Architecture

This package acts as a data and configuration library for the main OAuth service.

## Structure

```
src/
├── providers.ts    # Provider registry
├── env.ts          # Credential validation
├── types.ts        # Shared types
└── index.ts        # Entry point
```

## Separation of Concerns

By isolating provider specifics in this package, the core OAuth logic in `@open-auth/oauth` remains clean and generic. Adding a new provider only requires changes in this package.
