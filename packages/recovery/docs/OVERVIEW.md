# Recovery Package Overview

The `@open-auth/recovery` package provides the final fallback for account access. It is used when a user loses their password, access to their email, or their 2FA device.

## Key Concepts

- **Recovery Code**: A single-use, high-entropy string generated during account setup or recovery reset.
- **Lockout Prevention**: Ensuring users always have a path back into their account.
- **Emergency Access**: Workflows designed for low-frequency, high-criticality usage.
