import "server-only";
import { env } from "./env";

export interface TOTPConfig {
  issuer: string;
  period: number;
  digits: number;
  algorithm: "SHA1" | "SHA256" | "SHA512";
  clockSkewTolerance: number;
}

export function getTOTPIssuer(): string {
  return env.TOTP_ISSUER || "Next.js WebAuthn example";
}

export function getTOTPPeriod(): number {
  const period = env.TOTP_PERIOD;
  if (period && period > 0) {
    return period;
  }
  return 30;
}

export function getTOTPDigits(): number {
  const digits = env.TOTP_DIGITS;
  if (digits && (digits === 6 || digits === 8)) {
    return digits;
  }
  return 6;
}

export function getTOTPAlgorithm(): "SHA1" | "SHA256" | "SHA512" {
  const algorithm = env.TOTP_ALGORITHM;
  if (algorithm === "SHA256" || algorithm === "SHA512") {
    return algorithm;
  }
  return "SHA1";
}

export function getClockSkewTolerance(): number {
  const tolerance = env.TOTP_CLOCK_SKEW_TOLERANCE;
  if (tolerance !== undefined && tolerance >= 0 && tolerance <= 5) {
    return tolerance;
  }
  return 1;
}

export function getTOTPConfig(): TOTPConfig {
  return {
    issuer: getTOTPIssuer(),
    period: getTOTPPeriod(),
    digits: getTOTPDigits(),
    algorithm: getTOTPAlgorithm(),
    clockSkewTolerance: getClockSkewTolerance(),
  };
}
