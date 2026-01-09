# OAuth Architecture

The OAuth package is a complex service that interacts with external networks and internal identity systems.

## Structure

```
src/
├── oauth.ts        # Common OAuth logic
├── oauth-server.ts # Authorization server implementation
├── constants.ts    # Protcol identifiers
└── index.ts        # Entry point
```

## Workflow

1. **Request**: App requests an OAuth login.
2. **Redirect**: Service redirects user to Provider (e.g. Google).
3. **Consent**: User approves access on Provider's site.
4. **Callback**: Provider sends user back with a Code.
5. **Exchange**: Service exchanges Code for Tokens.
6. **Linking**: Service links the OAuth account to a Local user.
