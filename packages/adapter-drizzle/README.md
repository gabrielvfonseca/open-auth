# @open-auth/adapter-drizzle

Drizzle adapter for Open Auth. This adapter allows you to use Drizzle ORM as your data storage layer.

## Installation

```bash
bun add @open-auth/adapter-drizzle
```

## Usage

```typescript
import { createAuthClient } from "@open-auth/auth";
import { createDrizzleAdapter } from "@open-auth/adapter-drizzle";
import { db } from "./db"; // Your drizzle db instance
import * as schema from "./db/schema"; // Your drizzle schema

const auth = createAuthClient({
  database: createDrizzleAdapter(db, { schema }),
  // ...other config
});
```

## Schema Requirements

Your Drizzle schema must contain the tables required by Open Auth. You can refer to the documentation for the full list of required tables and columns.
