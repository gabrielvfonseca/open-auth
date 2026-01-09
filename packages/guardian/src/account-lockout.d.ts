import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
export interface LockoutConfig {
  maxAttempts?: number;
  lockoutDuration?: number;
}
export declare class AccountLockoutService {
  private readonly adapter;
  private readonly config;
  constructor(adapter: DatabaseAdapter, config?: LockoutConfig);
  recordFailedLoginAttempt(
    userId: string | null,
    ipAddress: string | null
  ): Promise<void>;
  resetFailedLoginAttempts(userId: string): Promise<void>;
  isAccountLocked(userId: string): Promise<boolean>;
  unlockAccount(userId: string, adminUserId?: string): Promise<void>;
  getLockoutRemainingTime(userId: string): Promise<number | null>;
}
