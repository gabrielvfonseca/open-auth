# Device API Reference

## Primary Services

### `generateFingerprint(data: any)`
Calculates a unique hash based on the provided environment data.

### `registerDevice(userId: string, fingerprint: string)`
Associates a device with a user and marks it as "known".

### `isKnownDevice(userId: string, fingerprint: string)`
Checks if the current device has been seen before for this user.

## Types

### `DeviceMetadata`
Interface for storing environmental details (OS, Browser, IP, etc.).
- `os`: string
- `browser`: string
- `ip`: string
- `location`: object
