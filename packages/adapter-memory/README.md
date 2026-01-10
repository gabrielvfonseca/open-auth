# @open-auth/adapter-memory

Memory adapter for Open Auth. This adapter stores data in-memory and is intended for development and testing purposes. **Do not use in production.**

## Installation

```bash
bun add @open-auth/adapter-memory
```

## Usage

```typescript
import { createAuthClient } from "@open-auth/auth";
import { createMemoryAdapter } from "@open-auth/adapter-memory";

const auth = createAuthClient({
  database: createMemoryAdapter(),
  // ...other config
});
```
