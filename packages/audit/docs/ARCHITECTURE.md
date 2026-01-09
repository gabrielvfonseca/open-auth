# Audit Architecture

The Audit package provides a unified ingestion point for all services and delegates storage to the Database package.

## Structure

```
src/
├── audit-log.ts    # Main logging logic
├── audit-types.ts  # Standard event definitions
└── index.ts        # Entry point
```

## Design Principles

1. **Non-Blocking**: Audit logging is designed to fail safe and not block the primary business flow (though high-security actions may require confirmation of logging).
2. **Standardization**: Uses a strict schema for all events to ensure consistency across services.
3. **Contextual Richness**: Encourages including as much context (request ID, traceback, device info) as possible without leaking PII unnecessarily.
