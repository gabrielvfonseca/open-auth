# SSO API Reference

## SAML Services

### `createSamlAuthRequest(idpMetadata: string)`
Generates an AuthnRequest to be sent to the IdP.

### `validateSamlResponse(responseBody: string)`
Parses and verifies the SAML response from the IdP.

## Storage Services

### `saveSamlRequest(id: string, state: any)`
Persists the SAML request context.

### `getSamlRequest(id: string)`
Retrieves the context for validation.
