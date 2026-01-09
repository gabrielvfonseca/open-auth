# Core Package Overview

The `@open-auth/core` package serves as the foundational layer of the Open-Auth ecosystem. It centralizes common logic that every other package and application in the monorepo depends on.

## Key Modules

- **Validation**: Provides pre-configured Zod schemas for common entities like email, passwords, and API keys.
- **Rate Limit**: Implements a robust rate-limiting system using `ioredis`, supporting sliding window algorithms.
- **Logger**: A lightweight wrapper for standardized logging across microservices.
- **Errors**: Defines a hierarchy of custom error classes (e.g., `AppError`, `ValidationError`) that facilitate consistent error handling and reporting.
- **Encryption**: High-level utilities for hashing and data protection.
