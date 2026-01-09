import "server-only";
/**
 * Get Cloudflare Turnstile site key from environment variables
 */
export declare function getTurnstileSiteKey(): string;
/**
 * Get Cloudflare Turnstile secret key from environment variables
 */
export declare function getTurnstileSecretKey(): string;
/**
 * Check if Turnstile is enabled
 */
export declare function getTurnstileEnabled(): boolean;
