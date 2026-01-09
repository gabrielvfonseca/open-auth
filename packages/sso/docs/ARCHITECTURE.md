# SSO Architecture

The SSO package handles heavy XML/SAML logic and integrates with the Core and Database packages.

## Structure

```
src/
├── saml.ts              # SAML protocol implementation
├── saml-request-store.ts # Request state management
└── index.ts             # Public API
```

## Security Design

1. **Digital Signatures**: All SAML tokens must be digitally signed and verified using the IdP's public key.
2. **Expiration**: Strict check on the `NotOnOrAfter` and `IssueInstant` conditions.
3. **InResponseTo Validation**: Ensures that every response is a reply to an actual request issued by this service.
4. **RelayState Handling**: Safe propagation of user-specific state through the SSO redirection loop.
