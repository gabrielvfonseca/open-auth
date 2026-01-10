# @open-auth/adapter-resend

Resend adapter for Open Auth. This adapter allows you to use Resend for sending transactional emails.

## Installation

```bash
bun add @open-auth/adapter-resend
```

## Usage

```typescript
import { createAuthClient } from "@open-auth/auth";
import { createResendAdapter } from "@open-auth/adapter-resend";

const auth = createAuthClient({
  email: createResendAdapter({
    apiKey: process.env.RESEND_API_KEY,
  }),
  // ...other config
});
```
