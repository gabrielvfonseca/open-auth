import "server-only";
import type {
  Account,
  AccountType,
  DatabaseAdapter,
  User,
} from "@open-auth/core";
import { generateUUID } from "@open-auth/core";
import { hashPassword } from "@open-auth/password";

export class AccountService {
  constructor(
    private readonly adapter: DatabaseAdapter,
    private readonly getUserById: (userId: string) => Promise<User | null>,
    private readonly createUserFn: (
      email: string,
      username: string
    ) => Promise<User>
  ) {}

  /**
   * Check if user has any OAuth accounts (GitHub, Google, etc.)
   */
  public async userHasOAuthAccount(userId: string): Promise<boolean> {
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
    return this.adapter.getAccountsByUserId(userId);
  }

  /**
   * Get account by ID
   */
  public async getAccountById(accountId: string): Promise<Account | null> {
    return this.adapter.getAccountById(accountId);
  }

  /**
   * Find OAuth account by provider type and ID
   */
  public async getAccountByProvider(
    type: AccountType,
    providerId: string
  ): Promise<Account | null> {
    return this.adapter.getAccountByProvider(providerId, type);
  }

  /**
   * Find email-based account by type and email
   * Note: This requires an adapter method or we filter client-side
   */
  public async getAccountByEmail(
    type: AccountType,
    email: string
  ): Promise<Account | null> {
    // Fetch user by email first
    const user = await this.adapter.getUserFromEmail(email);
    if (!user) {
      return null;
    }

    // Get accounts and filter by type
    const accounts = await this.adapter.getAccountsByUserId(user.id);
    return accounts.find((a) => a.type === type && a.email === email) || null;
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
    return this.adapter.createAccount({
      id: generateUUID(),
      userId,
      type: "email_password",
      email,
      passwordHash,
      emailVerified: false,
    });
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
    return this.adapter.createAccount({
      id: generateUUID(),
      userId,
      type,
      providerId,
      email: email || null,
      emailVerified: !!email,
    });
  }

  /**
   * Link existing account to user
   */
  public async linkAccountToUser(
    accountId: string,
    userId: string
  ): Promise<boolean> {
    try {
      await this.adapter.updateAccount(accountId, { userId });
      return true;
    } catch {
      return false;
    }
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

    // Check if account exists
    let account = await this.getAccountByProvider(type, providerId);
    if (account !== null) {
      const user = await this.getUserById(account.userId);
      if (user === null) {
        throw new Error("User not found for account");
      }
      await this.updateAccountLastUsed(account.id);
      return { user, account };
    }

    // Check if user exists with same email
    const existingUser = await this.adapter.getUserFromEmail(email);
    if (existingUser !== null) {
      account = await this.createOAuthAccount(
        existingUser.id,
        type,
        providerId,
        email
      );
      await this.updateAccountLastUsed(account.id);
      const enrichedUser = await this.getUserById(existingUser.id);
      return { user: enrichedUser!, account };
    }

    // Create new user and account
    const user = await this.createUserFn(email, username);
    account = await this.createOAuthAccount(user.id, type, providerId, email);
    await this.updateAccountLastUsed(account.id);
    const enrichedUser = await this.getUserById(user.id);
    return { user: enrichedUser!, account };
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
    let account = await this.getAccountByProvider(type, providerId);
    if (account !== null) {
      const user = await this.getUserById(account.userId);
      if (user === null) {
        throw new Error("User not found for account");
      }
      await this.updateAccountLastUsed(account.id);
      return { user, account };
    }

    const existingUser = await this.adapter.getUserFromEmail(email);
    if (existingUser !== null) {
      account = await this.createOAuthAccount(
        existingUser.id,
        type,
        providerId,
        email
      );
      await this.updateAccountLastUsed(account.id);
      const enrichedUser = await this.getUserById(existingUser.id);
      return { user: enrichedUser!, account };
    }

    const user = await this.createUserFn(email, username);
    account = await this.createOAuthAccount(user.id, type, providerId, email);
    await this.updateAccountLastUsed(account.id);
    const enrichedUser = await this.getUserById(user.id);
    return { user: enrichedUser!, account };
  }

  /**
   * Find or create account for magic link login
   */
  public async findOrCreateAccountForMagicLink(
    email: string
  ): Promise<{ user: User; account: Account }> {
    const type: AccountType = "magic_link";
    const providerId = email;

    let account = await this.getAccountByEmail(type, email);
    if (account !== null) {
      const user = await this.getUserById(account.userId);
      if (user === null) {
        throw new Error("User not found for account");
      }
      await this.updateAccountLastUsed(account.id);
      return { user, account };
    }

    const existingUser = await this.adapter.getUserFromEmail(email);
    if (existingUser !== null) {
      account = await this.createOAuthAccount(
        existingUser.id,
        type,
        providerId,
        email
      );
      await this.updateAccountLastUsed(account.id);
      const enrichedUser = await this.getUserById(existingUser.id);
      return { user: enrichedUser!, account };
    }

    const username = email.split("@")[0] || `user_${Date.now()}`;
    const user = await this.createUserFn(email, username);
    account = await this.createOAuthAccount(user.id, type, providerId, email);
    await this.updateAccountLastUsed(account.id);
    const enrichedUser = await this.getUserById(user.id);
    return { user: enrichedUser!, account };
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
    const accounts = await this.adapter.getAccountsByUserId(userId);
    const emailPasswordAccount = accounts.find(
      (a) => a.type === "email_password"
    );
    return emailPasswordAccount?.passwordHash || null;
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

    if (account === undefined) {
      const user = await this.adapter.getUserById(userId);
      if (user === null) {
        throw new Error("User not found");
      }
      await this.createEmailPasswordAccount(userId, user.email, password);
    } else {
      await this.updateAccountPassword(account.id, password);
    }
  }
}
