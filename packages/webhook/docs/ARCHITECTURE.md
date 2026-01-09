# Webhook Architecture

The Webhook package integrates with the Audit and Event-Bus systems (if applicable).

## Structure

```
src/
├── webhook.ts        # Main dispatching logic
├── webhook-events.ts # Event registry and types
└── index.ts          # Entry point
```

## Security Design

1. **Signatures**: Every payload includes a signature in the header, generated using a shared secret.
2. **IP Whitelisting**: Outbound requests are sent from a known range of IP addresses.
3. **Timeout Control**: Strict timeouts on endpoint responses to prevent blocking.
4. **Secret Management**: Webhook secrets are managed securely and rotated regularly.
