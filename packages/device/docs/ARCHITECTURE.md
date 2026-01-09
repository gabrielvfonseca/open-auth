# Device Architecture

The Device package is a lightweight utility that works with the Identity and Session services.

## Structure

```
src/
├── device.ts        # Core registry logic
├── fingerprint.ts   # Hashing algorithms
├── device-types.ts  # Shared interfaces
└── index.ts         # Entry point
```

## Privacy Design

1. **Hashing**: Environmental data is hashed to produce the fingerprint, preventing the storage of raw PII where possible.
2. **Consent**: Respects "Do Not Track" and other privacy-preserving browser settings.
3. **Data Retention**: Device records are subject to strict data retention policies.
4. **Anonymization**: Supports tracking devices in an anonymized way for risk analysis without linking to a specific user.
