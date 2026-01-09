# Email Package Overview

The `@open-auth/email` package is responsible for all outbound communication via email. It centralizes the logic for verification codes, password resets, and security notifications.

## Key Modules

- **Email Client**: The core engine for dispatching messages to the delivery provider.
- **Templates**: A collection of pre-defined email layouts and content.
- **Env**: Management of SMTP/SES credentials and sender configurations.
