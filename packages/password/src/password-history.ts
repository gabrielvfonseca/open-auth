import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
import { generateUUID, logger } from "@open-auth/core";
import type { PasswordService } from "./password";

const PASSWORD_HISTORY_COUNT = Number.parseInt(
  process.env.PASSWORD_HISTORY_COUNT || "5",
  10
);

export class PasswordHistoryService {
  constructor(
    private readonly adapter: DatabaseAdapter,
    private readonly passwordService: PasswordService
  ) {}

  public async checkPasswordHistory(
    userId: string,
    newPassword: string
  ): Promise<boolean> {
    // Get the last N password hashes
    const history = await this.adapter.getPasswordHistory(userId);
    // Sort logic handled in memory if adapter doesn't guarantee order:
    history.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    // Take top N
    const recentHistory = history.slice(0, PASSWORD_HISTORY_COUNT);

    // Check if the new password matches any previous password
    for (const entry of recentHistory) {
      const matches = await this.passwordService.verifyPasswordHash(
        entry.passwordHash,
        newPassword
      );
      if (matches) {
        return false; // Password was previously used
      }
    }

    return true; // Password is new
  }

  public async addPasswordToHistory(
    userId: string,
    passwordHash: string
  ): Promise<void> {
    // Add new password to history
    await this.adapter.createPasswordHistory({
      id: generateUUID(),
      userId,
      passwordHash,
    });

    // Get all password history entries for this user
    // Assuming adapter implementation might handle limit, but we need ALL if we want to prune?
    // Actually we can validly ask for N+1 from top sorted by date desc, and delete the rest?
    // Or just ask for "all" (limit high)?
    // Let's assume getPasswordHistory accounts for limit or we need a new method?
    // My interface says `getPasswordHistory(userId: string, limit: number)`.
    // So if I want to delete old ones, I should probably ask for limit + 10 or something?
    // The original code fetch ALL (findMany with no take?) NO, original code:
    // `const allHistory = await database.passwordHistory.findMany...` NO TAKE.
    // So my interface is limiting me.
    // I should create a separate method `cleanupPasswordHistory(userId: string)`.
    // Or just fetch enough.
    // Let's fetch 20. If count > PASSWORD_HISTORY_COUNT, delete.
    const allHistory = await this.adapter.getPasswordHistory(userId);
    // Sort by createdAt desc
    allHistory.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Keep only the last N entries
    if (allHistory.length > PASSWORD_HISTORY_COUNT) {
      const toDelete = allHistory.slice(PASSWORD_HISTORY_COUNT);
      await Promise.all(
        toDelete.map((h) => this.adapter.deletePasswordHistory(h.id))
      );
    }

    logger.info("Password added to history", { userId });
  }
}
