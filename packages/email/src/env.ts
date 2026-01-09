import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    AWS_REGION: z.string().default("us-east-1"),
    AWS_SES_FROM_EMAIL: z.string().email().optional(),
    AWS_SES_FROM_NAME: z.string().optional(),
    EMAIL_PROVIDER: z.enum(["ses", "console"]).default("console"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
