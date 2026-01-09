# Auth Architecture

The Auth package acts as a coordinator layer between external requests and internal data/identity services.

## Structure

```
src/
├── email-verification.ts  # Verification logic
├── account-deletion.ts    # Deletion workflows
├── username.ts           # Username handling
├── action-wrapper.ts     # Request wrapping
└── client.ts             # Main API client
```

## Dependencies

- **@open-auth/core**: For validation and rate limiting.
- **@open-auth/database**: For persistent storage.
- **@open-auth/email**: For sending verification codes.
