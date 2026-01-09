# Auth API Reference

## Client

### `AuthClient`
Main entry point for auth operations.
- `verifyEmail(token: string)`: Completes the email verification process.
- `deleteAccount()`: Schedules account for deletion.
- `updateUsername(newUsername: string)`: Changes the user's display name.

## Action Wrappers

### `authAction()`
Higher-order function for standardizing error handling and logging for auth actions.
