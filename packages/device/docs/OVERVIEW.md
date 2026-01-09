# Device Package Overview

The `@open-auth/device` package allows the platform to recognize returning users on the same machine and detect when a login attempt comes from an unrecognized or suspicious environment.

## Key Modules

- **Fingerprint**: Algorithm for combining multiple data points into a stable device ID.
- **Device Registry**: Management of known and trusted devices for each user.
- **Security Logic**: Triggers for multi-factor authentication when a new device is detected.
