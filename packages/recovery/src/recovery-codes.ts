import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
import { generateUUID, logger } from "@open-auth/core";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import type { RecoveryCodesResult } from "./recovery-types";

const RECOVERY_CODE_COUNT = 10;

export class RecoveryService {
  constructor(private readonly adapter: DatabaseAdapter) {}

  /**
   * Generate new recovery codes for a user
   * This will invalidate any existing codes
   */
  public async generateRecoveryCodes(
    userId: string
    // Note: DatabaseAdapter.createRecoveryCode creates ONE code.
    // Loop here.
  ): Promise<RecoveryCodesResult> {
    // Delete existing codes
    await this.adapter.deleteRecoveryCodesByUserId(userId);

    const codes: string[] = [];

    // Generate new codes
    for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
      const codeBytes = new Uint8Array(10);
      crypto.getRandomValues(codeBytes);
      const code = encodeBase32LowerCaseNoPadding(codeBytes);
      const codeHash = encodeHexLowerCase(
        sha256(new TextEncoder().encode(code))
      );

      await this.adapter.createRecoveryCode({
        id: generateUUID(),
        userId,
        codeHash,
        used: false,
      });

      // Format as XXX-XXX-XXX for readability
      const formattedCode = code.match(/.{1,4}/g)?.join("-") ?? code;
      codes.push(formattedCode);
    }

    logger.info("Recovery codes generated", {
      userId,
      count: RECOVERY_CODE_COUNT,
    });

    return { codes, userId };
  }

  /**
   * Verify and consume a recovery code
   */
  public async verifyRecoveryCode(
    userId: string,
    code: string
  ): Promise<boolean> {
    // Remove formatting
    const cleanCode = code.replace(/-/g, "").toLowerCase();
    const codeHash = encodeHexLowerCase(
      sha256(new TextEncoder().encode(cleanCode))
    );

    const recoveryCode = await this.adapter.getRecoveryCode(userId, codeHash);

    if (!recoveryCode || recoveryCode.used) {
      logger.warn("Invalid recovery code attempt", { userId });
      return false;
    }

    // Mark as used
    await this.adapter.updateRecoveryCode(recoveryCode.id, {
      used: true,
      usedAt: new Date(),
    });

    logger.info("Recovery code used", { userId, codeId: recoveryCode.id });

    return true;
  }

  /**
   * Get remaining unused recovery codes count
   */
  public async getRemainingCodesCount(userId: string): Promise<number> {
    const codes = await this.adapter.getRecoveryCodes(userId);
    return codes.filter((c) => !c.used).length;
  }

  /**
   * Check if user has recovery codes set up
   */
  public async hasRecoveryCodes(userId: string): Promise<boolean> {
    const codes = await this.adapter.getRecoveryCodes(userId);
    return codes.length > 0;
  }
}
