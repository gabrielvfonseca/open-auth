import "server-only";
import { type Account, type AccountType, type User } from "@open-auth/core";
export declare class AccountService {
  /**
   * Check if user has any OAuth accounts (GitHub, Google, etc.)
   */
  userHasOAuthAccount(userId: string): Promise<boolean>;
  /**
   * Check if email is already taken
   */
  checkEmailAvailability(email: string): Promise<boolean>;
  /**
   * Get all accounts for a user
   */
  getUserAccounts(userId: string): Promise<Account[]>;
  /**
   * Get account by ID
   */
  getAccountById(accountId: string): Promise<Account | null>;
  /**
   * Find OAuth account by provider type and ID
   */
  getAccountByProvider(
    type: AccountType,
    providerId: string
  ): Promise<Account | null>;
  /**
   * Find email-based account by type and email
   */
  getAccountByEmail(type: AccountType, email: string): Promise<Account | null>;
  /**
   * Create email/password account
   */
  createEmailPasswordAccount(
    userId: string,
    email: string,
    password: string
  ): Promise<Account>;
  /**
   * Create OAuth account
   */
  createOAuthAccount(
    userId: string,
    type: AccountType,
    providerId: string,
    email?: string
  ): Promise<Account>;
  /**
   * Link existing account to user
   */
  linkAccountToUser(accountId: string, userId: string): Promise<boolean>;
  /**
   * Find or create account for SAML login with automatic account linking
   */
  findOrCreateAccountForSAML(
    entityId: string,
    nameId: string,
    email: string,
    username: string
  ): Promise<{
    user: User;
    account: Account;
  }>;
  /**
   * Find or create account for OAuth login with automatic account linking
   */
  findOrCreateAccountForOAuth(
    type: AccountType,
    providerId: string,
    email: string,
    username: string
  ): Promise<{
    user: User;
    account: Account;
  }>;
  /**
   * Find or create account for magic link login with automatic account linking
   */
  findOrCreateAccountForMagicLink(email: string): Promise<{
    user: User;
    account: Account;
  }>;
  /**
   * Update account last used timestamp
   */
  updateAccountLastUsed(accountId: string): Promise<void>;
  /**
   * Update account email verification status
   */
  updateAccountEmailVerified(
    accountId: string,
    verified: boolean
  ): Promise<void>;
  /**
   * Get password hash for email/password account
   */
  getAccountPasswordHash(accountId: string): Promise<string | null>;
  /**
   * Update password for email/password account
   */
  updateAccountPassword(accountId: string, password: string): Promise<void>;
  /**
   * Get password hash for user's email/password account
   */
  getUserPasswordHash(userId: string): Promise<string | null>;
  /**
   * Update password for user's email/password account
   */
  updateUserPassword(userId: string, password: string): Promise<void>;
}
export declare const accountService: AccountService;
