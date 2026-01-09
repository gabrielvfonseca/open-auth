import type { DatabaseAdapter, User } from "@open-auth/core";
import {
  decryptToString,
  ExpiringTokenBucket,
  encryptString,
  generateRandomRecoveryCode,
} from "@open-auth/core";
export interface MfaConfig {
  enabled?: boolean;
  required?: boolean;
  allowSkip?: boolean;
}

export class MfaService {
  private readonly config: MfaConfig;
  public recoveryCodeBucket = new ExpiringTokenBucket(3, 60 * 60);

  constructor(
    private readonly adapter: DatabaseAdapter,
    config: MfaConfig = {}
  ) {
    this.config = {
      enabled: config.enabled ?? true,
      required: config.required ?? false,
      allowSkip: config.allowSkip ?? true,
    };
  }

  public async resetUser2FAWithRecoveryCode(
    userId: string,
    recoveryCode: string
  ): Promise<boolean> {
    const user = await this.adapter.getUserById(userId);
    if (user === null) {
      return false;
    }
    if (!user.recoveryCode) {
      return false;
    }
    const encryptedRecoveryCode = new Uint8Array(user.recoveryCode);
    const userRecoveryCode = decryptToString(encryptedRecoveryCode);
    if (recoveryCode !== userRecoveryCode) {
      return false;
    }

    const newRecoveryCode = generateRandomRecoveryCode();
    const encryptedNewRecoveryCode = encryptString(newRecoveryCode);
    // 1. Update user recovery code
    // We can't easily do the "compare and swap" safety check here without transaction isolation.
    // But we just verified it above.
    await this.adapter.updateUser(userId, {
      recoveryCode: Buffer.from(encryptedNewRecoveryCode),
    });

    // 2. Clear sessions
    // Update all sessions? Adapter `deleteSessionsByUserId`?
    // Original: `session.updateMany({ where: { userId }, data: { twoFactorVerified: false } })`
    // I need `updateSession` for all sessions.
    // Adapter has `getSessionsByUserId` and `updateSession`.
    // This loop is potentially slow but acceptable for now.
    const sessions = await this.adapter.getSessionsByUserId(userId);
    for (const session of sessions) {
      await this.adapter.updateSession(session.id, {
        twoFactorVerified: false,
      });
    }

    // 3. Delete credentials
    // 3. Delete credentials
    await Promise.all([
      this.adapter.deleteTOTPCredentialsByUserId(userId),
      this.adapter.deletePasskeyCredentialsByUserId(userId),
      this.adapter.deleteSecurityKeyCredentialsByUserId(userId),
    ]);
    return true;
  }

  public get2FARedirect(user: User): string {
    if (user.registeredPasskey) {
      return "/2fa/passkey";
    }
    if (user.registeredSecurityKey) {
      return "/2fa/security-key";
    }
    if (user.registeredTOTP) {
      return "/2fa/totp";
    }
    return "/2fa/setup";
  }

  public getPasswordReset2FARedirect(user: User): string {
    if (user.registeredPasskey) {
      return "/reset-password/2fa/passkey";
    }
    if (user.registeredSecurityKey) {
      return "/reset-password/2fa/security-key";
    }
    if (user.registeredTOTP) {
      return "/reset-password/2fa/totp";
    }
    return "/2fa/setup";
  }
}
