import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import type { DeviceFingerprint } from "./device-types";

/**
 * Generate a device fingerprint from collected data
 */
export function generateFingerprint(data: DeviceFingerprint): string {
  const components = [
    data.userAgent,
    data.language,
    data.platform,
    data.screenResolution,
    data.timezone,
    data.cookiesEnabled ? "1" : "0",
  ];

  const fingerprint = components.join("|");
  const hash = sha256(new TextEncoder().encode(fingerprint));

  return encodeHexLowerCase(hash);
}

/**
 * Generate a device name from user agent
 */
export function generateDeviceName(userAgent: string): string {
  // Simple parsing - can be enhanced with a proper UA parser
  if (userAgent.includes("iPhone")) {
    return "iPhone";
  }
  if (userAgent.includes("iPad")) {
    return "iPad";
  }
  if (userAgent.includes("Android")) {
    return "Android Device";
  }
  if (userAgent.includes("Mac")) {
    return "Mac";
  }
  if (userAgent.includes("Windows")) {
    return "Windows PC";
  }
  if (userAgent.includes("Linux")) {
    return "Linux";
  }
  return "Unknown Device";
}
