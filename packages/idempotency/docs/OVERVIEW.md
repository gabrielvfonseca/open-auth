# Idempotency Package Overview

The `@open-auth/idempotency` package is critical for building resilient APIs. It protects the system from effects like multiple charges, double registration, or duplicate emails caused by client retries.

## Key Concepts

- **Idempotency Key**: A unique client-generated string that identifies a specific request.
- **Process Lock**: A temporary lock to ensure only one instance of a request is active at a time.
- **Response Cache**: Storing the final status and payload of a treated request.
