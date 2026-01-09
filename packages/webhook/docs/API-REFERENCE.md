# Webhook API Reference

## Primary Services

### `dispatchWebhook(eventType: string, payload: any)`
Sends an event to all endpoints registered for that type.

### `registerEndpoint(url: string, secret: string, events: string[])`
Adds a new destination for webhook events.

## Types

### `WebhookEvent`
Standard structure for a webhook payload.
- `id`: Event ID
- `type`: Category (e.g. 'auth.login')
- `data`: Event-specific data
- `timestamp`: Creation time
