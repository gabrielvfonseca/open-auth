import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    ACCOUNT_LOCKOUT_ATTEMPTS: z.coerce.number().optional(),
    ACCOUNT_LOCKOUT_DURATION_MINUTES: z.coerce.number().optional(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
    TURNSTILE_SECRET_KEY: z.string().optional(),
    TURNSTILE_ENABLED: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
