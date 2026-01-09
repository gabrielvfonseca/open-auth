# @open-auth/password

The password management package for Open-Auth. It handles secure hashing, password-reset workflows, and password history enforcement.

## Installation

```bash
bun add @open-auth/password
```

## Features

- **Secure Hashing**: Standardized argon2 or bcrypt hashing logic.
- **Password Resets**: Complete flow for generating and validating reset tokens.
- **History Enforcement**: Logic to prevent users from reusing recent passwords.
- **Complexity Validation**: Integrated with Core's validation schemas.

## Documentation

- [Overview](docs/OVERVIEW.md)
- [API Reference](docs/API-REFERENCE.md)
- [Architecture](docs/ARCHITECTURE.md)
