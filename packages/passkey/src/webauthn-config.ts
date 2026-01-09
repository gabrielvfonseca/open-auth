import "server-only";
import { headers } from "next/headers";
import { env } from "./env";

export interface WebAuthnConfig {
  relyingPartyId: string;
  relyingPartyName: string;
  origin: string;
  allowedOrigins: string[];
}

/**
 * Get the Relying Party ID from environment or derive from origin
 */
export function getRelyingPartyId(): string {
  const rpId = env.WEBAUTHN_RP_ID;
  if (rpId) {
    return rpId;
  }
  // Derive from origin if not set
  const origin = getOrigin();
  try {
    const url = new URL(origin);
    return url.hostname;
  } catch {
    return "localhost";
  }
}

/**
 * Get the Relying Party name from environment or default
 */
export function getRelyingPartyName(): string {
  return env.WEBAUTHN_RP_NAME || "Next.js WebAuthn example";
}

/**
 * Get the current origin from request headers or environment
 */
export function getOrigin(): string {
  // Try to get from environment first
  const envOrigin = env.NEXT_PUBLIC_BASE_URL || env.WEBAUTHN_ORIGIN;
  if (envOrigin) {
    return envOrigin;
  }

  // Try to get from request headers
  try {
    const headersList = headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";
    if (host) {
      return `${protocol}://${host}`;
    }
  } catch {
    // Headers not available (e.g., in non-request context)
  }

  // Fallback to localhost
  return "http://localhost:3000";
}

/**
 * Get allowed origins from environment or default
 */
export function getAllowedOrigins(): string[] {
  const origins = env.WEBAUTHN_ALLOWED_ORIGINS;
  if (origins) {
    return origins.split(",").map((origin: string) => origin.trim());
  }
  const origin = getOrigin();
  return [origin];
}

/**
 * Verify if an origin is allowed
 */
export function isOriginAllowed(origin: string): boolean {
  const allowedOrigins = getAllowedOrigins();
  return allowedOrigins.includes(origin);
}

/**
 * Get complete WebAuthn configuration
 */
export function getWebAuthnConfig(): WebAuthnConfig {
  return {
    relyingPartyId: getRelyingPartyId(),
    relyingPartyName: getRelyingPartyName(),
    origin: getOrigin(),
    allowedOrigins: getAllowedOrigins(),
  };
}
