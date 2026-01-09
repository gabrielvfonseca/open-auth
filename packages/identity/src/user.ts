import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
import {
  decryptToString,
  encryptString,
  generateRandomRecoveryCode,
  type User,
} from "@open-auth/core";

export class UserService {
  constructor(private readonly adapter: DatabaseAdapter) {}

  public verifyUsernameInput(username: string): boolean {
    return (
      username.length > 3 &&
      username.length < 32 &&
      username.trim() === username
    );
  }

  public async createUser(email: string, username: string): Promise<User> {
    const recoveryCode = generateRandomRecoveryCode();
    const encryptedRecoveryCode = encryptString(recoveryCode);

    // Using adapter.createUser.
    // Note: Adapter definition might only accept partial user.
    // And core User interface might differ slightly from DB schema.
    // Assuming adapter handles the mapping or is consistent.

    // The previous implementation used generateUUID() for ID.
    // Adapter.createUser returns Promise<User>.
    // Core definition of createUser in adapter:
    // createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & Partial<User>): Promise<User>;
    // So I can pass id if I want.

    const user = await this.adapter.createUser(email, username);

    // Update user with recovery code
    await this.adapter.updateUser(user.id, {
      recoveryCode: Buffer.from(encryptedRecoveryCode),
    });

    return user;
  }

  public async getUserPrimaryEmail(userId: string): Promise<string | null> {
    const user = await this.adapter.getUserById(userId);
    return user?.email || null;
  }

  public async updateUserEmailAndSetEmailAsVerified(
    userId: string,
    email: string
  ): Promise<void> {
    await this.adapter.updateUser(userId, { email, emailVerified: true });
  }

  public async setUserAsEmailVerifiedIfEmailMatches(
    userId: string,
    email: string
  ): Promise<boolean> {
    // Adapter doesn't have "updateMany".
    // Need fetch then update.
    const user = await this.adapter.getUserById(userId);
    if (user && user.email === email) {
      await this.adapter.updateUser(userId, { emailVerified: true });
      return true;
    }
    return false;
  }

  public async getUserRecoverCode(userId: string): Promise<string | null> {
    const user = await this.adapter.getUserById(userId);
    if (user === null) {
      throw new Error("Invalid user ID");
    }
    if (!user.recoveryCode) {
      return null;
    }
    return decryptToString(new Uint8Array(user.recoveryCode));
  }

  public async resetUserRecoveryCode(userId: string): Promise<string> {
    const recoveryCode = generateRandomRecoveryCode();
    const encrypted = encryptString(recoveryCode);
    await this.adapter.updateUser(userId, {
      recoveryCode: Buffer.from(encrypted),
    });
    return recoveryCode;
  }

  public async getUserFromEmail(email: string): Promise<User | null> {
    return this.adapter.getUserFromEmail(email);
  }

  public async getUserById(userId: string): Promise<User | null> {
    return this.adapter.getUserById(userId);
  }
}
