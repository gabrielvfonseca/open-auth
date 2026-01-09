import "server-only";
import { consola } from "consola";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export interface TurnstileConfig {
  enabled?: boolean;
  siteKey?: string;
  secretKey?: string;
}

export class TurnstileService {
  private readonly config: Required<TurnstileConfig>;

  constructor(config: TurnstileConfig = {}) {
    this.config = {
      enabled: config.enabled ?? false,
      siteKey: config.siteKey ?? "",
      secretKey: config.secretKey ?? "",
    };
  }
  public async verifyTurnstileToken(
    token: string,
    ipAddress: string | null
  ): Promise<boolean> {
    if (!this.config.enabled) {
      // If Turnstile is disabled, always return true (for development/testing)
      return true;
    }

    if (!token || token.trim() === "") {
      return false;
    }

    const secretKey = this.config.secretKey;

    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ipAddress) {
      formData.append("remoteip", ipAddress);
    }

    try {
      const response = await fetch(TURNSTILE_VERIFY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        return false;
      }

      const data: TurnstileVerifyResponse = await response.json();
      return data.success === true;
    } catch (error) {
      // Log error but don't expose it to user
      consola.error("Turnstile verification error:", error);
      return false;
    }
  }
}
