# Session Package Overview

The `@open-auth/session` package is responsible for maintaining the authenticated state of users. It manages the metadata associated with each active login.

## Key Modules

- **Session**: Logic for generating session IDs, setting expiration, and verifying tokens.
- **Device**: Registry for tracking the user agents and IP addresses used during sessions.
- **Persistence**: Integration with session stores for scalable management.
