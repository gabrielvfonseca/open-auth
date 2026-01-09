# OAuth Providers API Reference

## Provider Registry

### `providers`
A map of pre-configured provider objects.
- `providers.google`
- `providers.github`

## Client Logic

### `getProviderConfig(name: string)`
Returns the validated configuration for a specific IDP.

### `validateCallback(provider: string, query: any)`
Specific validation logic for incoming provider callbacks.
