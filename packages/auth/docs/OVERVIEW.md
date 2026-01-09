# Auth Package Overview

The `open-auth` package is the primary interface for authentication-related business logic. It orchestrates complex flows that involve multiple other packages (like `email`, `database`, and `core`).

## Core Responsibilities

- **Flow Orchestration**: Coordinating steps for registration, verification, and account maintenance.
- **Client Interface**: Providing a unified client for applications to interact with the auth system.
- **Security Logic**: Implementing domain-specific security checks during authentication actions.
