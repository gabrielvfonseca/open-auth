# @open-auth/adapter-console

Console adapter for Open Auth. This is a special adapter primarily used for development to log actions or emails to the console instead of sending them.

## Installation

```bash
bun add @open-auth/adapter-console
```

## Usage

```typescript
import { createAuthClient } from "@open-auth/auth";
import { createConsoleAdapter } from "@open-auth/adapter-console";

const auth = createAuthClient({
  database: createConsoleAdapter(),
  // ...other config
});
```
