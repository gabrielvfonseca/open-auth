# @open-auth/device

The device identification and fingerprinting service for Open-Auth. It provides a unique signature for every hardware/software environment used to access the platform, enabling advanced security and personalized experiences.

## Installation

```bash
bun add @open-auth/device
```

## Features

- **Device Fingerprinting**: Generates unique identifiers based on browser/system characteristics.
- **Trust Scoring**: Logic for evaluating the reliability of a specific device.
- **Geography Tracking**: Mapping devices to geographic locations (via IP metadata).
- **History**: Maintaining a log of all devices used by a specific user.

## Documentation

- [Overview](docs/OVERVIEW.md)
- [API Reference](docs/API-REFERENCE.md)
- [Architecture](docs/ARCHITECTURE.md)
