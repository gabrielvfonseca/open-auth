import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      REDIS_URL: z
        .string()
        .default("redis://localhost:6379")
        .describe("Redis connection URL"),
    },
    runtimeEnv: {
      REDIS_URL: process.env.REDIS_URL,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  });
