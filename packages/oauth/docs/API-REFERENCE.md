# OAuth API Reference

## OAuth Services

### `initiateOAuthFlow(provider: string)`
Starts the redirection to the external identity provider.

### `handleCallback(code: string, state: string)`
Processes the authorization code and exchanges it for access/ID tokens.

## Authorization Server

### `issueAccessToken(params: TokenParams)`
Generates a new access token for a client.

### `validateToken(token: string)`
Verifies the validity of an issued token.
