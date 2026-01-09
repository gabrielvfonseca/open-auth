# Database Package Overview

The `@open-auth/database` package encapsulates all interaction with the persistent data store. It uses Prisma as the ORM to provide a modern, type-safe developer experience.

## Key Technologies

- **PostgreSQL**: The primary relational database.
- **Prisma**: Handles schema definition, migrations, and client generation.
- **Zod**: Used for additional validation where necessary.

## Core Entities

- **User**: Profile information and account settings.
- **Identity**: Authentication credentials (passwords, OAuth links).
- **Session**: Active user sessions and device tokens.
- **AuditLog**: Immutable trail of security-relevant events.
