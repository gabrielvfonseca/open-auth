# Identity Package Overview

The `@open-auth/identity` package is responsible for the "Who" aspect of authentication. It manages user entities and the various ways they prove their identity (Accounts).

## Key Entities

- **User**: The central entity representing a person.
- **Account**: A specific instantiation of an identity (e.g., a Google login, a password account).

## Core Responsibilities

- **CRUD Operations**: managing the lifecycle of users and accounts.
- **Relationship Mapping**: linking multiple authentication accounts to a single user ID.
- **Type Safety**: Providing strict TypeScript types for identity-related data.
