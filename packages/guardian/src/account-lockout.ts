import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
import { generateUUID, logger } from "@open-auth/core";

const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_LOCKOUT_DURATION = 30; // minutes

export interface LockoutConfig {
  maxAttempts?: number;
  lockoutDuration?: number; // minutes
}

export class AccountLockoutService {
  private readonly config: Required<LockoutConfig>;

  constructor(
    private readonly adapter: DatabaseAdapter,
    config: LockoutConfig = {}
  ) {
    this.config = {
      maxAttempts: config.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
      lockoutDuration: config.lockoutDuration ?? DEFAULT_LOCKOUT_DURATION,
    };
  }

  public async recordFailedLoginAttempt(
    userId: string | null,
    ipAddress: string | null
  ): Promise<void> {
    // Record the attempt
    await this.adapter.createFailedLoginAttempt({
      id: generateUUID(),
      userId,
      ipAddress,
      userAgent: null, // Can be passed through if needed
    });

    // If we have a userId, update the user's failed attempt count
    if (userId !== null) {
      const user = await this.adapter.getUserById(userId);

      if (user) {
        // Check if account is already locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          return; // Already locked, don't update
        }

        const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;

        if (newFailedAttempts >= this.config.maxAttempts) {
          // Lock the account
          const lockedUntil = new Date(
            Date.now() + this.config.lockoutDuration * 60 * 1000
          );
          await this.adapter.updateUser(userId, {
            failedLoginAttempts: newFailedAttempts,
            lockedUntil,
          });

          logger.warn("Account locked due to failed login attempts", {
            userId,
            failedAttempts: newFailedAttempts,
            lockedUntil,
          });
        } else {
          await this.adapter.updateUser(userId, {
            failedLoginAttempts: newFailedAttempts,
          });
        }
      }
    }
  }

  public async resetFailedLoginAttempts(userId: string): Promise<void> {
    await this.adapter.updateUser(userId, {
      failedLoginAttempts: 0,
      lockedUntil: null,
    });
  }

  public async isAccountLocked(userId: string): Promise<boolean> {
    const user = await this.adapter.getUserById(userId);

    if (!user?.lockedUntil) {
      return false;
    }

    // Check if lockout has expired
    if (user.lockedUntil <= new Date()) {
      // Unlock the account
      await this.adapter.updateUser(userId, {
        lockedUntil: null,
        failedLoginAttempts: 0,
      });
      return false;
    }

    return true;
  }

  public async unlockAccount(
    userId: string,
    adminUserId?: string
  ): Promise<void> {
    await this.adapter.updateUser(userId, {
      lockedUntil: null,
      failedLoginAttempts: 0,
    });

    logger.info("Account unlocked", { userId, unlockedBy: adminUserId });
  }

  public async getLockoutRemainingTime(userId: string): Promise<number | null> {
    const user = await this.adapter.getUserById(userId);

    if (!user?.lockedUntil) {
      return null;
    }

    const remaining = user.lockedUntil.getTime() - Date.now();
    return remaining > 0 ? remaining : null;
  }
}
