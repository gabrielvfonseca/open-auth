# @open-auth/telemetry

The observability and monitoring service for Open-Auth. It provides a unified way to collect metrics, traces, and performance data across all services to ensure platform health and reliability.

## Installation

```bash
bun add @open-auth/telemetry
```

## Features

- **Metrics Collection**: High-performance counters and histograms for monitoring system throughput and latency.
- **Distributed Tracing**: Standardized trace injection and extraction to follow requests across microservice boundaries.
- **Reporting**: Integrated exporters for popular monitoring backends (e.g., Prometheus, OpenTelemetry).
- **Health Checks**: Standardized interface for reporting service status.

## Documentation

- [Overview](docs/OVERVIEW.md)
- [API Reference](docs/API-REFERENCE.md)
- [Architecture](docs/ARCHITECTURE.md)
