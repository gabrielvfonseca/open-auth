# Contract Package Overview

The `@open-auth/contract` package defines the single source of truth for data shapes in the Open-Auth platform. By centralizing Zod schemas here, we prevent drift between different services.

## Key Concepts

- **Schema-First Design**: Changes to data structures must start in this package.
- **Reusability**: These schemas are used for both runtime validation (via Core) and compile-time type safety.
- **Namespaced Contracts**: Separate contracts for Auth, User, and Session logic.
