import "server-only";
import type { DatabaseAdapter, User } from "@open-auth/core";
import {
  decryptToString,
  encryptString,
  generateRandomRecoveryCode,
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

    const user = await this.adapter.createUser(email, username);

    // Update user with recovery code
    await this.adapter.updateUser(user.id, {
      recoveryCode: Buffer.from(encryptedRecoveryCode),
    });

    return {
      ...user,
      registeredTOTP: false,
      registeredPasskey: false,
      registeredSecurityKey: false,
      registered2FA: false,
    };
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
    if (user.recoveryCode === null || user.recoveryCode === undefined) {
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
    const user = await this.adapter.getUserFromEmail(email);
    if (user === null) {
      return null;
    }

    // Get 2FA credentials
    const totpCreds = await this.adapter.getTOTPCredentials(user.id);
    const passkeys = await this.adapter.getPasskeyCredentials(user.id);
    const securityKeys = await this.adapter.getSecurityKeyCredentials(user.id);

    const result: User = {
      ...user,
      registeredTOTP: totpCreds.length > 0,
      registeredPasskey: passkeys.length > 0,
      registeredSecurityKey: securityKeys.length > 0,
      registered2FA: false,
    };

    if (
      result.registeredPasskey ||
      result.registeredSecurityKey ||
      result.registeredTOTP
    ) {
      result.registered2FA = true;
    }
    return result;
  }

  public async getUserById(userId: string): Promise<User | null> {
    const user = await this.adapter.getUserById(userId);
    if (user === null) {
      return null;
    }

    // Get 2FA credentials
    const totpCreds = await this.adapter.getTOTPCredentials(user.id);
    const passkeys = await this.adapter.getPasskeyCredentials(user.id);
    const securityKeys = await this.adapter.getSecurityKeyCredentials(user.id);

    const result: User = {
      ...user,
      registeredTOTP: totpCreds.length > 0,
      registeredPasskey: passkeys.length > 0,
      registeredSecurityKey: securityKeys.length > 0,
      registered2FA: false,
    };

    if (
      result.registeredPasskey ||
      result.registeredSecurityKey ||
      result.registeredTOTP
    ) {
      result.registered2FA = true;
    }
    return result;
  }

  public async deleteUser(userId: string): Promise<void> {
    await this.adapter.deleteUser(userId);
  }
}
