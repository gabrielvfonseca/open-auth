# Session API Reference

## Session Services

### `createSession(userId: string, metadata: SessionMetadata)`
Initializes a new session for a user.

### `validateSession(sessionId: string)`
Verifies if a session is still active and valid.

### `revokeSession(sessionId: string)`
Immediately terminates a specific session.

## Device Services

### `trackDevice(sessionId: string, deviceInfo: any)`
Binds hardware/software metadata to an active session.

### `getSessionsByDevice(deviceId: string)`
Lists all sessions active on a specific device.
