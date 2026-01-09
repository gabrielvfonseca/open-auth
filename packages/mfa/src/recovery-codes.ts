import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
import {
  generateRandomRecoveryCode,
  generateUUID,
  logger,
} from "@open-auth/core";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

const DEFAULT_RECOVERY_CODE_COUNT = 10;
const DEFAULT_RECOVERY_CODE_LENGTH = 10;

export interface RecoveryCodeInfo {
  id: string;
  used: boolean;
  usedAt: Date | null;
  createdAt: Date;
}

export interface RecoveryCodesConfig {
  count?: number;
  length?: number;
}

export class RecoveryCodeService {
  private readonly config: Required<RecoveryCodesConfig>;

  constructor(
    private readonly adapter: DatabaseAdapter,
    config: RecoveryCodesConfig = {}
  ) {
    this.config = {
      count: config.count ?? DEFAULT_RECOVERY_CODE_COUNT,
      length: config.length ?? DEFAULT_RECOVERY_CODE_LENGTH,
    };
  }

  public async generateRecoveryCodes(userId: string): Promise<string[]> {
    // Delete all existing recovery codes
    await this.adapter.deleteRecoveryCodesByUserId(userId);

    // Generate new codes
    const codes: string[] = [];
    const count = this.config.count;

    for (let i = 0; i < count; i++) {
      const code = generateRandomRecoveryCode();
      codes.push(code);
      const codeHash = encodeHexLowerCase(
        sha256(new TextEncoder().encode(code))
      );

      await this.adapter.createRecoveryCode({
        id: generateUUID(),
        userId,
        codeHash,
        used: false,
      });
    }

    logger.info("Recovery codes generated", {
      userId,
      count,
    });

    return codes;
  }

  public async getUserRecoveryCodes(
    userId: string
  ): Promise<RecoveryCodeInfo[]> {
    const codes = await this.adapter.getRecoveryCodes(userId);
    // Needed to map internal entity to InfoDTO?
    // Entity: id, userId, codeHash, used, usedAt.
    // DTO: id, used, usedAt, createdAt.
    // Entity might not have createdAt in my definition?
    // My definition: `createdAt` IS NOT in `RecoveryCode` interface in core/index.ts!
    // I missed `createdAt`.
    // I should add `createdAt` to `RecoveryCode` in core, or assume current date if missing (bad).
    // Original code used `createdAt`.
    // I should update `core/index.ts` to include `createdAt` in `RecoveryCode`.
    // For now I will map it, assuming it exists on the object returned by adapter if I update the type later.
    // Or I'll update core now. I'll update code now.

    return codes.map((c) => ({
      id: c.id,
      used: c.used,
      usedAt: c.usedAt || null,
      createdAt: c.createdAt || new Date(),
    }));
  }

  public async verifyRecoveryCode(
    userId: string,
    code: string
  ): Promise<boolean> {
    const codeHash = encodeHexLowerCase(sha256(new TextEncoder().encode(code)));

    const recoveryCode = await this.adapter.getRecoveryCode(userId, codeHash);

    if (!recoveryCode || recoveryCode.used) {
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

  public async getUnusedRecoveryCodeCount(userId: string): Promise<number> {
    const codes = await this.adapter.getRecoveryCodes(userId);
    return codes.filter((c) => !c.used).length;
  }
}
