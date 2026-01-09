import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    TOTP_ISSUER: z.string().optional(),
    TOTP_PERIOD: z.coerce.number().optional(),
    TOTP_DIGITS: z.coerce.number().optional(),
    TOTP_ALGORITHM: z.string().optional(),
    TOTP_CLOCK_SKEW_TOLERANCE: z.coerce.number().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
