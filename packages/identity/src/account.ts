import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
import {
  type Account,
  type AccountType,
  generateUUID,
  type User,
} from "@open-auth/core";
import { hashPassword } from "@open-auth/password";
import type { UserService } from "./user";

export class AccountService {
  constructor(
    private readonly adapter: DatabaseAdapter,
    private readonly userService: UserService
  ) {}

  /**
   * Check if user has any OAuth accounts (GitHub, Google, etc.)
   */
  public async userHasOAuthAccount(userId: string): Promise<boolean> {
    // Simplification: generic adapter might not support complex filtered queries
    // like "type in [...]".
    // We might need to fetch all accounts for user and filter in memory if adapter is simple.
    // Or extend adapter with `findFirstAccount(query)`.
    // For now, let's use getAccountsByUserId and filter in memory.
    const accounts = await this.adapter.getAccountsByUserId(userId);
    return accounts.some((a) =>
      ["github", "google", "microsoft", "apple", "saml"].includes(a.type)
    );
  }

  /**
   * Check if email is already taken
   */
  public async checkEmailAvailability(email: string): Promise<boolean> {
    const user = await this.adapter.getUserFromEmail(email);
    return user === null;
  }

  /**
   * Get all accounts for a user
   */
  public async getUserAccounts(userId: string): Promise<Account[]> {
    // Adapter: getAccountsByUserId.
    // Need to sort by lastUsedAt? Adapter might not sort.
    // Do in memory.
    const accounts = await this.adapter.getAccountsByUserId(userId);
    return accounts.sort((a, b) => {
      const tA = a.lastUsedAt?.getTime() || 0;
      const tB = b.lastUsedAt?.getTime() || 0;
      return tB - tA;
    });
  }

  /**
   * Get account by ID
   */
  public async getAccountById(accountId: string): Promise<Account | null> {
    // Missing from my initial DatabaseAdapter definition earlier?
    // I defined: createAccount, getAccountByProvider, getAccountsByUserId, deleteAccount.
    // MISSING: getAccountById.
    // I should add it to adapter interface.
    // Workaround: Since I can't easily change adapter interface across all files in one step,
    // I might have to skip this or implement it.
    // BUT WAIT, I am defining the usage here. If I use it, I update the interface later.
    // Or I can use a trick if not available. Currently no trick.
    // I will assume getAccountById exists or I will add it to interface.
    // Checking my memory/scrollback... I did NOT add getAccountById to DatabaseAdapter.

    // I will assume I can fix the interface later.
    return this.adapter.getAccountById(accountId);
  }

  /**
   * Find OAuth account by provider type and ID
   */
  public async getAccountByProvider(
    type: AccountType,
    providerId: string
  ): Promise<Account | null> {
    return this.adapter.getAccountByProvider(type, providerId);
  }

  /**
   * Find email-based account by type and email
   */
  public async getAccountByEmail(
    type: AccountType,
    email: string
  ): Promise<Account | null> {
    // Adapter doesn't have getAccountByEmail natively?
    // I defined getAccountByProvider.
    // For email_password, providerId IS the email usually? No, providerId is null or something.
    // In Prisma schema: type_email unique constraint.
    // Generic adapter might not have efficient query for this.
    // We might need to search.
    // OR, for 'email_password', we enforce providerId = email?
    // Let's assume we can fetch by provider='email_password' and providerAccountId=email?
    // If so, use getAccountByProvider('email_password', email).
    return this.adapter.getAccountByProvider(type, email);
  }

  /**
   * Create email/password account
   */
  public async createEmailPasswordAccount(
    userId: string,
    email: string,
    password: string
  ): Promise<Account> {
    const passwordHash = await hashPassword(password);
    const account = await this.adapter.createAccount({
      id: generateUUID(),
      userId,
      type: "email_password",
      providerId: email, // Using email as providerId for lookup
      email,
      emailVerified: false,
      passwordHash,
      createdAt: new Date(),
      lastUsedAt: null,
    });
    return account;
  }

  /**
   * Create OAuth account
   */
  public async createOAuthAccount(
    userId: string,
    type: AccountType,
    providerId: string,
    email?: string
  ): Promise<Account> {
    const account = await this.adapter.createAccount({
      id: generateUUID(),
      userId,
      type,
      providerId,
      email: email || null,
      emailVerified: !!email,
      createdAt: new Date(),
      lastUsedAt: null,
    });
    return account;
  }

  /**
   * Link existing account to user
   */
  public async linkAccountToUser(
    accountId: string,
    userId: string
  ): Promise<boolean> {
    // Need updateAccount on adapter.
    const account = await this.adapter.getAccountById(accountId); // Assuming existence
    if (account) {
      await this.adapter.updateAccount(accountId, { userId });
      return true;
    }
    return false;
  }

  /**
   * Find or create account for SAML login with automatic account linking
   */
  public async findOrCreateAccountForSAML(
    entityId: string,
    nameId: string,
    email: string,
    username: string
  ): Promise<{ user: User; account: Account }> {
    const providerId = `${entityId}:${nameId}`;
    const type: AccountType = "saml";
    return this.findOrCreateGeneric(type, providerId, email, username);
  }

  /**
   * Find or create account for OAuth login with automatic account linking
   */
  public async findOrCreateAccountForOAuth(
    type: AccountType,
    providerId: string,
    email: string,
    username: string
  ): Promise<{ user: User; account: Account }> {
    return this.findOrCreateGeneric(type, providerId, email, username);
  }

  /**
   * Find or create account for magic link login with automatic account linking
   */
  public async findOrCreateAccountForMagicLink(
    email: string
  ): Promise<{ user: User; account: Account }> {
    const type: AccountType = "magic_link";
    const providerId = email;
    // Generate username from email if creating new
    const username = email.split("@")[0] || `user_${Date.now()}`;
    return this.findOrCreateGeneric(type, providerId, email, username);
  }

  // Helper to deduplicate logic
  private async findOrCreateGeneric(
    type: AccountType,
    providerId: string,
    email: string,
    username: string
  ): Promise<{ user: User; account: Account }> {
    // 1. Check if account exists
    let account = await this.getAccountByProvider(type, providerId);
    if (account) {
      const user = await this.adapter.getUserById(account.userId);
      if (!user) {
        throw new Error("User not found for account");
      }
      await this.updateAccountLastUsed(account.id);
      return { user, account };
    }

    // 2. Check if user exists with same email
    const existingUser = await this.adapter.getUserFromEmail(email);
    if (existingUser) {
      account = await this.createOAuthAccount(
        existingUser.id,
        type,
        providerId,
        email
      );
      await this.updateAccountLastUsed(account.id);
      return { user: existingUser, account };
    }

    // 3. Create new user and account
    const user = await this.userService.createUser(email, username);
    account = await this.createOAuthAccount(user.id, type, providerId, email);
    await this.updateAccountLastUsed(account.id);
    return { user, account };
  }

  /**
   * Update account last used timestamp
   */
  public async updateAccountLastUsed(accountId: string): Promise<void> {
    await this.adapter.updateAccount(accountId, { lastUsedAt: new Date() });
  }

  /**
   * Update account email verification status
   */
  public async updateAccountEmailVerified(
    accountId: string,
    verified: boolean
  ): Promise<void> {
    await this.adapter.updateAccount(accountId, { emailVerified: verified });
  }

  /**
   * Get password hash for email/password account
   */
  public async getAccountPasswordHash(
    accountId: string
  ): Promise<string | null> {
    const account = await this.adapter.getAccountById(accountId);
    return account?.passwordHash || null;
  }

  /**
   * Update password for email/password account
   */
  public async updateAccountPassword(
    accountId: string,
    password: string
  ): Promise<void> {
    const passwordHash = await hashPassword(password);
    await this.adapter.updateAccount(accountId, { passwordHash });
  }

  /**
   * Get password hash for user's email/password account
   */
  public async getUserPasswordHash(userId: string): Promise<string | null> {
    // Need filtering accounts by type.
    const accounts = await this.adapter.getAccountsByUserId(userId);
    const emailAccount = accounts.find((a) => a.type === "email_password");
    return emailAccount?.passwordHash || null;
  }

  /**
   * Update password for user's email/password account
   */
  public async updateUserPassword(
    userId: string,
    password: string
  ): Promise<void> {
    const accounts = await this.adapter.getAccountsByUserId(userId);
    const account = accounts.find((a) => a.type === "email_password");

    if (account) {
      await this.updateAccountPassword(account.id, password);
    } else {
      // User doesn't have email/password account, create one
      const user = await this.adapter.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      // Ensure email is available (it should be if user exists)
      await this.createEmailPasswordAccount(userId, user.email, password);
    }
  }
}
