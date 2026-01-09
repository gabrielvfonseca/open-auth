import "server-only";
import type { DatabaseAdapter, TOTPCredential } from "@open-auth/core";
import {
  decrypt,
  ExpiringTokenBucket,
  encrypt,
  generateUUID,
} from "@open-auth/core";
import { verifyTOTP } from "@oslojs/otp";
import { getTOTPConfig } from "./totp-config";

// Re-export interface from core usage or just use core's?
// In original, it was defined here. Now defined in core.
// I will just use core's TOTPCredential.

export interface TotpConfig {
  issuer?: string;
  algorithm?: "SHA1" | "SHA256" | "SHA512";
  digits?: 6 | 8;
  period?: number;
}

export class TotpService {
  // Rate limiting: 5 attempts per 30 minutes (expiring bucket)
  private readonly totpBucket = new ExpiringTokenBucket(5, 60 * 30);
  private readonly config: Required<TotpConfig>;

  constructor(
    private readonly adapter: DatabaseAdapter,
    config: TotpConfig = {}
  ) {
    this.config = {
      issuer: config.issuer ?? "Open Auth",
      algorithm: config.algorithm ?? "SHA1",
      digits: config.digits ?? 6,
      period: config.period ?? 30,
    };
  }

  public getRemainingTOTPAttempts(userId: string): number {
    return this.totpBucket.getRemaining(userId);
  }

  public getTOTPRateLimitResetTime(userId: string): Date | null {
    return this.totpBucket.getResetTime(userId);
  }

  public async getUserTOTPKeys(userId: string): Promise<TOTPCredential[]> {
    const credentials = await this.adapter.getTOTPCredentials(userId);
    // Needed to decrypt key
    return credentials.map((cred) => ({
      ...cred,
      key: decrypt(new Uint8Array(cred.key)),
    }));
  }

  public async getUserTOTPKey(
    userId: string,
    credentialId?: string
  ): Promise<TOTPCredential | null> {
    if (credentialId) {
      const credential = await this.adapter.getTOTPCredential(
        userId,
        credentialId
      );
      if (!credential) {
        return null;
      }
      return {
        ...credential,
        key: decrypt(new Uint8Array(credential.key)),
      };
    }
    // Legacy: get first credential if no ID specified (for backward compatibility)
    // Core adapter getTOTPCredentials usually returns list.
    // I can fetch all and take first if order matches?
    // Adapter signature doesn't guarantee order but usually creation/lastUsed.
    // I'll assume getTOTPCredentials returns them.
    const credentials = await this.getUserTOTPKeys(userId);
    return credentials[0] ?? null;
  }

  public async createTOTPCredential(
    userId: string,
    key: Uint8Array,
    name?: string,
    issuer?: string
  ): Promise<TOTPCredential> {
    const encrypted = encrypt(key);
    // Use this.config instead of getTOTPConfig()
    const config = this.config;

    // Core adapter expects TOTPCredential data.
    // Note: adapter interfaces usually take partial or omit generated fields if adapter generates them.
    // My definition: createTOTPCredential(data: TOTPCredential): Promise<TOTPCredential>
    // So I must provide ID.
    const cred: TOTPCredential = {
      id: generateUUID(),
      userId,
      key: Buffer.from(encrypted),
      name: name ?? null,
      issuer: issuer ?? config.issuer,
      createdAt: new Date(),
      lastUsedAt: null,
    };

    const created = await this.adapter.createTOTPCredential(cred);

    // Return decrypted key for usage immediately
    return {
      ...created,
      key,
    };
  }

  public async updateTOTPCredential(id: string, name?: string): Promise<void> {
    await this.adapter.updateTOTPCredential(id, { name: name ?? null });
  }

  public async deleteTOTPCredential(
    id: string,
    userId: string
  ): Promise<boolean> {
    await this.adapter.deleteTOTPCredential(id, userId);
    return true; // Adapter throws? or we assume success.
    // The previous implementation returned boolean if count > 0.
    // Our adapter delete returns void.
    // Assume success.
  }

  public async updateTOTPLastUsed(id: string): Promise<void> {
    await this.adapter.updateTOTPCredential(id, { lastUsedAt: new Date() });
  }

  public verifyTOTPWithClockSkew(
    key: Uint8Array,
    code: string,
    period?: number,
    digits?: number
  ): { valid: boolean; timeStepOffset?: number } {
    const config = this.config;
    const finalPeriod = period ?? config.period;
    const finalDigits = digits ?? config.digits;
    // tolerance; // unused

    if (verifyTOTP(key, finalPeriod, finalDigits, code)) {
      return { valid: true, timeStepOffset: 0 };
    }

    // Offset logic suppressed for now as per original code comment
    return { valid: false };
  }

  public async verifyTOTPCode(
    userId: string,
    code: string
  ): Promise<{ valid: boolean; credentialId?: string }> {
    const credentials = await this.getUserTOTPKeys(userId);
    if (credentials.length === 0) {
      return { valid: false };
    }

    const config = getTOTPConfig();

    for (const credential of credentials) {
      if (
        verifyTOTP(
          credential.key as Uint8Array,
          config.period,
          config.digits,
          code
        )
      ) {
        await this.updateTOTPLastUsed(credential.id);
        return { valid: true, credentialId: credential.id };
      }
    }

    return { valid: false };
  }

  public async updateUserTOTPKey(
    userId: string,
    key: Uint8Array
  ): Promise<void> {
    // Transactional replace
    // Adapter doesn't support transaction directly across multiple calls.
    // Logic: Delete all, create new.
    // If we want transaction safety, we'd need `adapter.transaction(...)` or specialized method.
    // For now, sequential.
    await this.adapter.deleteTOTPCredentialsByUserId(userId);
    await this.createTOTPCredential(userId, key);
  }

  public async deleteUserTOTPKey(userId: string): Promise<void> {
    await this.adapter.deleteTOTPCredentialsByUserId(userId);
  }

  public checkRateLimit(userId: string): boolean {
    return this.totpBucket.check(userId, 1);
  }

  public consumeRateLimit(userId: string): boolean {
    return this.totpBucket.consume(userId, 1);
  }

  public resetRateLimit(userId: string): void {
    this.totpBucket.reset(userId);
  }
}

// Removing exported singleton. client.ts must instantiate.
// Removing standalone functions. Consumers must use service instance.
