# Email Architecture

The Email package is a downstream service used by Auth, Password, and Magic packages.

## Structure

```
src/
├── email.ts       # Core delivery logic
├── templates.ts   # Template definitions
├── email-types.ts # Shared interfaces
└── index.ts       # Entry point
```

## Security Design

1. **Strict Origin**: Emails are only sent from verified domains and addresses.
2. **Escaping**: Dynamic data in templates is properly escaped to prevent HTML injection.
3. **Sensitive Data**: Email bodies should not contain long-lived sensitive data (like full sessions).
