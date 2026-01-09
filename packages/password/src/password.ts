import "server-only";
import { hash, verify } from "@node-rs/argon2";
import { sha1 } from "@oslojs/crypto/sha1";
import { encodeHexLowerCase } from "@oslojs/encoding";

export interface PasswordConfig {
  minLength?: number;
  maxLength?: number;
  requireNumbers?: boolean;
  requireSymbols?: boolean;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  hashCost?: number;
}

export class PasswordService {
  private readonly config: Required<
    Omit<PasswordConfig, "historyCount" | "resetTokenExpiresIn">
  >;

  constructor(config: PasswordConfig = {}) {
    this.config = {
      minLength: config.minLength ?? 8,
      maxLength: config.maxLength ?? 128,
      requireNumbers: config.requireNumbers ?? true,
      requireSymbols: config.requireSymbols ?? false,
      requireUppercase: config.requireUppercase ?? true,
      requireLowercase: config.requireLowercase ?? true,
      hashCost: config.hashCost ?? 19_456, // Default for Argon2 memory cost or similar
    };
  }

  public async hashPassword(password: string): Promise<string> {
    return await hash(password, {
      memoryCost: this.config.hashCost,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
  }

  public async verifyPasswordHash(
    hash: string,
    password: string
  ): Promise<boolean> {
    return await verify(hash, password);
  }

  public async verifyPasswordStrength(password: string): Promise<boolean> {
    if (
      password.length < this.config.minLength ||
      password.length > this.config.maxLength
    ) {
      return false;
    }

    if (this.config.requireNumbers && !/\d/.test(password)) {
      return false;
    }

    if (
      this.config.requireSymbols &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      return false;
    }

    if (this.config.requireUppercase && !/[A-Z]/.test(password)) {
      return false;
    }

    if (this.config.requireLowercase && !/[a-z]/.test(password)) {
      return false;
    }

    const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
    const hashPrefix = hash.slice(0, 5);
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${hashPrefix}`
    );
    const data = await response.text();
    const items = data.split("\n");
    for (const item of items) {
      const hashSuffix = item.slice(0, 35).toLowerCase();
      if (hash === hashPrefix + hashSuffix) {
        return false;
      }
    }
    return true;
  }
}

export const passwordService = new PasswordService();

// Export standalone functions for backward compatibility/refactor support
export async function hashPassword(password: string): Promise<string> {
  return passwordService.hashPassword(password);
}

export async function verifyPasswordHash(
  hash: string,
  password: string
): Promise<boolean> {
  return passwordService.verifyPasswordHash(hash, password);
}

export async function verifyPasswordStrength(
  password: string
): Promise<boolean> {
  return passwordService.verifyPasswordStrength(password);
}
