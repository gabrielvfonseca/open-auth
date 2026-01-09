# Contract Architecture

The Contract package is a pure TypeScript/Zod library with no runtime side effects or external service dependencies.

## Structure

```
src/
├── user.ts    # User-related schemas
├── auth.ts    # Authentication request/response shapes
├── session.ts # Session data structures
└── index.ts   # Main exports
```

## Integration

1. **Backend**: Uses these schemas to validate incoming requests.
2. **Frontend**: Uses the inferred types to ensure form data matches the API requirements.
3. **Database**: The Prisma schema in the `database` package is designed to align with these contracts.
