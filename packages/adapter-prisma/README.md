# @open-auth/adapter-prisma

Prisma adapter for Open Auth. This adapter allows you to use Prisma ORM as your data storage layer.

## Installation

```bash
bun add @open-auth/adapter-prisma
```

## Usage

```typescript
import { createAuthClient } from "@open-auth/auth";
import { createPrismaAdapter } from "@open-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const auth = createAuthClient({
  database: createPrismaAdapter(prisma),
  // ...other config
});
```

## Schema Requirements

Your `schema.prisma` must contain the models required by Open Auth (User, Session, Account, etc.). You can refer to the documentation for the full list of required models and fields.
