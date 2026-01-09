# Telemetry Architecture

The Telemetry package is designed to be low-overhead and is used by almost every other package in the monorepo.

## Structure

```
src/
├── telemetry.ts # Core instrumentation logic
├── metrics.ts   # Metric definitions
├── types.ts     # Shared interfaces
└── index.ts     # Public API
```

## Design Principles

1. **Performance**: Telemetry collection should have negligible impact on the performance of the primary application logic.
2. **Standardization**: Adheres to OpenTelemetry (OTel) standards for naming and data structures.
3. **Decoupling**: Services record telemetry to an abstract interface; the actual destination is configured at the platform level.
