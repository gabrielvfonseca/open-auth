import "server-only";
import { type User } from "@open-auth/core";
export declare class UserService {
  verifyUsernameInput(username: string): boolean;
  createUser(email: string, username: string): Promise<User>;
  getUserPrimaryEmail(userId: string): Promise<string | null>;
  updateUserEmailAndSetEmailAsVerified(
    userId: string,
    email: string
  ): Promise<void>;
  setUserAsEmailVerifiedIfEmailMatches(
    userId: string,
    email: string
  ): Promise<boolean>;
  getUserRecoverCode(userId: string): Promise<string | null>;
  resetUserRecoveryCode(userId: string): Promise<string>;
  getUserFromEmail(email: string): Promise<User | null>;
  getUserById(userId: string): Promise<User | null>;
}
export declare const userService: UserService;
