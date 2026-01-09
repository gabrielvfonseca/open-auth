# Identity Architecture

The Identity package sits directly above the Database package and provides a cleaner domain model for identity management.

## Structure

```
src/
├── user.ts     # User domain logic
├── account.ts  # Account management logic
└── index.ts    # Public API
```

## Integration

- **@open-auth/database**: Used for all persistence needs.
- **open-auth**: Uses Identity to perform account linking and user lookups during auth flows.
