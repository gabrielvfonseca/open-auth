# Guardian API Reference

## Risk Analysis

### `assessRequestRisk(request: any)`
Evaluates the risk level of an incoming request based on historical and contextual data.

### `detectSessionHijacking(sessionId: string, newMetadata: any)`
Checks for sudden shifts in session characteristics that indicate takeover.

## Protection Mechanisms

### `incrementFailedAttempts(userId: string)`
Tracks authentication failures and triggers lockout if thresholds are met.

### `verifyTurnstileToken(token: string)`
Validates an challenge response from Cloudflare Turnstile.
