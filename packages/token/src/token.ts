import "server-only";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import type { GeneratedToken, TokenType } from "./types";

export class TokenService {
  private readonly TOKEN_EXPIRY: Record<TokenType, number> = {
    session: 7 * 24 * 60 * 60 * 1000, // 7 days
    api_key: 365 * 24 * 60 * 60 * 1000, // 1 year
    oauth_access: 60 * 60 * 1000, // 1 hour
    oauth_refresh: 30 * 24 * 60 * 60 * 1000, // 30 days
    verification: 24 * 60 * 60 * 1000, // 24 hours
    password_reset: 60 * 60 * 1000, // 1 hour
    magic_link: 15 * 60 * 1000, // 15 minutes
  };

  /**
   * Generate a cryptographically secure token
   */
  public generateToken(type: TokenType, expiryMs?: number): GeneratedToken {
    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);

    const token = encodeBase32LowerCaseNoPadding(tokenBytes);
    const hash = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const expiresAt = new Date(
      Date.now() + (expiryMs ?? this.TOKEN_EXPIRY[type])
    );

    return { token, hash, expiresAt };
  }

  /**
   * Hash a token for storage
   */
  public hashToken(token: string): string {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  }

  /**
   * Verify a token against its hash
   */
  public verifyToken(token: string, expectedHash: string): boolean {
    const hash = this.hashToken(token);
    return hash === expectedHash;
  }

  /**
   * Generate a short numeric code (for email verification, etc.)
   */
  public generateNumericCode(length = 6): string {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    let code = "";
    for (let i = 0; i < length; i++) {
      code += (bytes[i] % 10).toString();
    }

    return code;
  }

  /**
   * Generate an API key with prefix
   */
  public generateApiKey(prefix = "frt"): GeneratedToken {
    const generated = this.generateToken("api_key");
    const apiKey = `${prefix}_${generated.token}`;

    return {
      token: apiKey,
      hash: generated.hash,
      expiresAt: generated.expiresAt,
    };
  }
}

export const tokenService = new TokenService();

// Exporting standalone functions for backward compatibility if needed by other packages during refactor/build
export function generateNumericCode(length = 6): string {
  return tokenService.generateNumericCode(length);
}
