# Guardian Architecture

The Guardian package is a stateful service that integrates with Core for rate limiting and Database for persistence.

## Structure

```
src/
├── account-lockout.ts    # Lockout logic
├── risk-detection.ts     # Risk scoring engine
├── turnstile.ts          # External bot protection
├── email-domain-filter.ts # Domain blacklisting
└── audit-log.ts          # Security event delegation
```

## Integration Flow

1. **Monitor**: Every high-security action is sent to Guardian for assessment.
2. **Analyze**: Guardian evaluates the request against current security policies and historical data.
3. **Decide**: Returns an "Allow", "Challenge", or "Block" decision.
4. **Log**: Records the outcome for audit and future risk modeling.
