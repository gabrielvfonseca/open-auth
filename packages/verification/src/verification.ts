import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
import { generateUUID, logger } from "@open-auth/core";
import type { TotpService } from "@open-auth/mfa";
import type {
  WebAuthnUserCredential,
  WebAuthnVerificationService,
} from "@open-auth/passkey";
import { generateNumericCode } from "@open-auth/token";
import type { SendVerificationResult, VerificationResult } from "./types";

export type MFAMethod = "totp" | "webauthn" | "passkey";

export interface EmailVerificationConfig {
  enabled?: boolean;
  expiresIn?: number; // seconds
}

export class VerificationService {
  private readonly config: Required<EmailVerificationConfig>;

  constructor(
    private readonly adapter: DatabaseAdapter,
    private readonly totpService: TotpService,
    private readonly webAuthnVerificationService: WebAuthnVerificationService,
    config: EmailVerificationConfig = {}
  ) {
    this.config = {
      enabled: config.enabled ?? true,
      expiresIn: config.expiresIn ?? 24 * 60 * 60, // 24 hours
    };
  }

  /**
   * Unified MFA Verification
   */
  public async verifyMFA(
    userId: string,
    method: MFAMethod,
    payload: {
      code?: string;
      webAuthnData?: unknown;
    }
  ): Promise<{ success: boolean; message?: string }> {
    if (method === "totp") {
      if (!payload.code) {
        return { success: false, message: "Missing code" };
      }

      // Rate limit check
      if (!this.totpService.checkRateLimit(userId)) {
        return { success: false, message: "Rate limit exceeded" };
      }
      if (!this.totpService.consumeRateLimit(userId)) {
        return { success: false, message: "Rate limit exceeded" };
      }

      const result = await this.totpService.verifyTOTPCode(
        userId,
        payload.code
      );
      if (!result.valid) {
        return { success: false, message: "Invalid code" };
      }
      this.totpService.resetRateLimit(userId);
      return { success: true };
    }
    if (method === "webauthn" || method === "passkey") {
      if (!payload.webAuthnData) {
        return { success: false, message: "Missing WebAuthn data" };
      }

      const result =
        await this.webAuthnVerificationService.verifyWebAuthnAssertion(
          payload.webAuthnData,
          {
            userId,
            getCredential: async (
              credentialId: Uint8Array,
              uid?: string
            ): Promise<WebAuthnUserCredential | null> => {
              const cred = await this.adapter.getPasskeyCredential(
                uid || userId,
                Buffer.from(credentialId)
              );
              if (!cred) {
                return null;
              }
              return {
                id: new Uint8Array(cred.id),
                userId: cred.userId,
                name: cred.name,
                algorithmId: cred.algorithm,
                publicKey: new Uint8Array(cred.publicKey),
                deviceType: cred.deviceType,
                userAgent: cred.userAgent,
                createdAt: cred.createdAt,
                lastUsedAt: cred.lastUsedAt || new Date(),
              };
            },
          }
        );
      return { success: result.success, message: result.error || undefined };
    }

    return { success: false, message: "Unsupported method" };
  }

  /**
   * Create a verification code (Caller handles delivery)
   */
  public async createVerificationCode(
    userId: string,
    email: string
  ): Promise<SendVerificationResult & { code: string }> {
    const code = generateNumericCode(8);
    const expiresAt = new Date(Date.now() + this.config.expiresIn * 1000);

    // Delete any existing verification for this user
    await this.adapter.deleteEmailVerificationsByUserId(userId);

    // Create new verification record
    await this.adapter.createEmailVerification({
      id: generateUUID(),
      userId,
      email,
      code,
      expiresAt,
    });

    logger.info("Verification code created", { userId, email, expiresAt });

    return { success: true, expiresAt, code };
  }

  /**
   * Verify an email verification code
   */
  public async verifyCode(
    userId: string,
    code: string
  ): Promise<VerificationResult> {
    const verification = await this.adapter.getEmailVerification(userId, code);

    if (!verification || verification.expiresAt <= new Date()) {
      logger.warn("Invalid verification attempt or expired", { userId });
      return {
        success: false,
        status: "failed",
      };
    }

    // Mark user's email as verified
    await this.adapter.updateUser(userId, { emailVerified: true });

    // Delete the verification record
    await this.adapter.deleteEmailVerification(verification.id);

    logger.info("Email verified", { userId, email: verification.email });

    return {
      success: true,
      status: "verified",
      userId,
      email: verification.email,
    };
  }

  /**
   * Re-create verification code
   */
  public async recreateVerificationCode(
    userId: string
  ): Promise<SendVerificationResult & { code?: string }> {
    const user = await this.adapter.getUserById(userId);

    if (!user) {
      return { success: false, expiresAt: new Date() };
    }

    if (user.emailVerified) {
      return { success: false, expiresAt: new Date() };
    }

    return this.createVerificationCode(userId, user.email);
  }

  /**
   * Check if email is verified
   */
  public async isEmailVerified(userId: string): Promise<boolean> {
    const user = await this.adapter.getUserById(userId);
    return user?.emailVerified ?? false;
  }
}
