# @open-auth/webhook

The outbound webhook service for Open-Auth. It allows third-party applications and microservices to receive real-time notifications about security events, user activity, and system changes.

## Installation

```bash
bun add @open-auth/webhook
```

## Features

- **Event Notification**: Real-time delivery of events (e.g., `user.created`, `login.success`).
- **Signature Verification**: Secure signing of payloads to allow recipients to verify the sender.
- **Retry Logic**: Robust handling of endpoint failures with exponential backoff.
- **Fan-out**: Ability to send a single event to multiple registered endpoints.

## Documentation

- [Overview](docs/OVERVIEW.md)
- [API Reference](docs/API-REFERENCE.md)
- [Architecture](docs/ARCHITECTURE.md)
