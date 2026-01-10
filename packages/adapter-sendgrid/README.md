# @open-auth/adapter-sendgrid

SendGrid adapter for Open Auth. This adapter allows you to use SendGrid for sending transactional emails.

## Installation

```bash
bun add @open-auth/adapter-sendgrid
```

## Usage

```typescript
import { createAuthClient } from "@open-auth/auth";
import { createSendGridAdapter } from "@open-auth/adapter-sendgrid";

const auth = createAuthClient({
  email: createSendGridAdapter({
    apiKey: process.env.SENDGRID_API_KEY,
  }),
  // ...other config
});
```
