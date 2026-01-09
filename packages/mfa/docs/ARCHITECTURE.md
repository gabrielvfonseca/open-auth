# MFA Architecture

The MFA package is a standalone domain service that works with the Identity and Database packages to store second-factor secrets and codes.

## Structure

```
src/
├── totp.ts              # Core TOTP logic
├── totp-verification.ts # Verification workflows
├── recovery-codes.ts    # Backup code management
└── 2fa.ts               # Higher-level orchestration
```

## Security Considerations

1. **Secret Storage**: MFA secrets should be encrypted at rest (handled by the Database layer).
2. **Rate Limiting**: MFA verification attempts should be strictly rate-limited (handled via Core).
3. **Single Use**: Fallback recovery codes are deleted or marked used immediately upon consumption.
