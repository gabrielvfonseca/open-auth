import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
import { logger } from "@open-auth/core";
import { verifyPasswordHash } from "@open-auth/password";
import type { SessionService } from "@open-auth/session";
import type { AccountService } from "./services/account-service";

const _SOFT_DELETE_RETENTION_DAYS = Number.parseInt(
  process.env.SOFT_DELETE_RETENTION_DAYS || "7",
  10
);

export class AccountDeletionService {
  constructor(
    private readonly adapter: DatabaseAdapter,
    private readonly sessionService: SessionService,
    private readonly accountService: AccountService
  ) {}

  public async softDeleteUser(userId: string): Promise<void> {
    const deletedAt = new Date();
    // Adapter might not support soft delete fields directly if not in User interface?
    // User interface in core:
    // export interface User { id, email, username, emailVerified, failedLoginAttempts, lockedUntil, createdAt, updatedAt }
    // It does NOT have 'deleted' or 'deletedAt'.
    // This implies Schema drift or I need to add these to User interface.
    // Assuming for now I can pass them, but adapter interface `updateUser(id, data: Partial<User>)`.
    // If User doesn't have deleted, TS will error.
    // I should probably cast or update Interface.
    // Let's assume cast for now to unblock: (data as any)

    await this.adapter.updateUser(userId, {
      deleted: true,
      deletedAt,
    });

    const accounts = await this.adapter.getAccountsByUserId(userId);
    const _hasEmailAccount = accounts.some((a) => a.type === "email_password");

    // Invalidate all sessions
    await this.sessionService.invalidateUserSessions(userId);

    logger.info("User account soft deleted", { userId, deletedAt });
  }

  public async permanentlyDeleteUser(userId: string): Promise<void> {
    // Cascade delete will handle related records (handled by DB mostly, or Adapter logic)
    await this.adapter.deleteUser(userId);

    logger.info("User account permanently deleted", { userId });
  }

  public async cleanupDeletedAccounts(): Promise<number> {
    // This query is complex: find users where deleted=true and deletedAt <= cutoff.
    // DatabaseAdapter has no `findUsers` with filters.
    // This logic MUST belong to the Adapter or we need a new method `getDeletedUsers(cutoff)`.
    // For now, I will comment this out or throw "Not implemented" as it requires Adapter extension.
    logger.warn(
      "cleanupDeletedAccounts is not implemented in Generic Adapter refactor"
    );
    return 0;
  }

  public async verifyUserForDeletion(
    userId: string,
    password: string
  ): Promise<{ valid: boolean; requires2FA: boolean }> {
    const user = await this.adapter.getUserById(userId);

    // We need credentials to check 2FA. Adapter `getUserById` returns User.
    // Does User interface have credentials?
    // In `core/src/index.ts`: User does NOT have credentials arrays.
    // We need `getTOTPCredential(userId)`, `getPasskeyCredentials(userId)`, etc.

    if (!user) {
      return { valid: false, requires2FA: false };
    }

    // Check if user has password
    const passwordHash = await this.accountService.getUserPasswordHash(userId);
    if (passwordHash) {
      const validPassword = await verifyPasswordHash(passwordHash, password);
      if (!validPassword) {
        return { valid: false, requires2FA: false };
      }
    }

    // Check if 2FA is required
    const totpCreds = await this.adapter.getTOTPCredentials(userId);
    const hasTOTP = totpCreds.length > 0;
    const passkeys = await this.adapter.getPasskeyCredentials(userId);
    const securityKeys = await this.adapter.getSecurityKeyCredentials(userId);

    const has2FA = hasTOTP || passkeys.length > 0 || securityKeys.length > 0;

    return { valid: true, requires2FA: has2FA };
  }
}
