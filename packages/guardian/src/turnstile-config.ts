import "server-only";
import { env } from "./env";

/**
 * Get Cloudflare Turnstile site key from environment variables
 */
export function getTurnstileSiteKey(): string {
  const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) {
    throw new Error("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set");
  }
  return siteKey;
}

/**
 * Get Cloudflare Turnstile secret key from environment variables
 */
export function getTurnstileSecretKey(): string {
  const secretKey = env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("TURNSTILE_SECRET_KEY is not set");
  }
  return secretKey;
}

/**
 * Check if Turnstile is enabled
 */
export function getTurnstileEnabled(): boolean {
  return env.TURNSTILE_ENABLED === "true" || env.TURNSTILE_ENABLED === "1";
}
