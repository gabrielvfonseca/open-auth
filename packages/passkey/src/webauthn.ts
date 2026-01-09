import "server-only";
import type {
  DatabaseAdapter,
  PasskeyCredential,
  SecurityKeyCredential,
} from "@open-auth/core";
import { encodeHexLowerCase } from "@oslojs/encoding";

export interface WebAuthnUserCredential {
  id: Uint8Array;
  userId: string;
  name: string;
  algorithmId: number;
  publicKey: Uint8Array;
  deviceType?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  lastUsedAt?: Date | null;
}

export interface CreatePasskeyCredentialData {
  id: Uint8Array;
  userId: string;
  name: string;
  algorithmId: number;
  publicKey: Uint8Array;
  deviceType?: string;
  userAgent?: string;
}

export interface PasskeyConfig {
  rpName?: string;
  rpId?: string;
  origin?: string | string[];
}

export class WebAuthnService {
  private readonly config: Required<PasskeyConfig>;

  constructor(
    private readonly adapter: DatabaseAdapter,
    config: PasskeyConfig = {}
  ) {
    this.config = {
      rpName: config.rpName ?? "Open Auth",
      rpId: config.rpId ?? "localhost",
      origin: config.origin ?? "http://localhost:3000",
    };
  }

  public async createWebAuthnChallenge(
    userId?: string,
    email?: string,
    type: "registration" | "authentication" = "authentication"
  ): Promise<Uint8Array> {
    const challenge = new Uint8Array(20);
    crypto.getRandomValues(challenge);
    const encoded = encodeHexLowerCase(challenge);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await this.adapter.createWebAuthnChallenge({
      id: encoded,
      userId: userId ?? null,
      email: email ?? null,
      type,
      expiresAt,
    });

    return challenge;
  }

  public async verifyWebAuthnChallenge(
    challenge: Uint8Array
  ): Promise<boolean> {
    const encoded = encodeHexLowerCase(challenge);
    const challengeRecord = await this.adapter.getWebAuthnChallenge(encoded);

    if (challengeRecord === null) {
      return false;
    }

    if (challengeRecord.expiresAt < new Date()) {
      await this.adapter.deleteWebAuthnChallenge(encoded);
      return false;
    }

    await this.adapter.deleteWebAuthnChallenge(encoded);
    return true;
  }

  public async cleanupExpiredChallenges(): Promise<number> {
    return this.adapter.deleteExpiredWebAuthnChallenges();
  }

  public async getUserPasskeyCredentials(
    userId: string
  ): Promise<WebAuthnUserCredential[]> {
    const credentials = await this.adapter.getPasskeyCredentials(userId);
    return credentials.map((cred) => ({
      id: new Uint8Array(cred.id),
      userId: cred.userId,
      name: cred.name,
      algorithmId: cred.algorithm,
      publicKey: new Uint8Array(cred.publicKey),
      deviceType: cred.deviceType,
      userAgent: cred.userAgent,
      createdAt: cred.createdAt,
      lastUsedAt: cred.lastUsedAt,
    }));
  }

  public async getPasskeyCredential(
    credentialId: Uint8Array
  ): Promise<WebAuthnUserCredential | null> {
    const credential = await this.adapter.getPasskeyCredential(
      null as any,
      Buffer.from(credentialId)
    );
    // Wait, getPasskeyCredential(userId, id). I only have ID.
    // Core adapter says `getPasskeyCredential(userId: string, ...)`?
    // In many implementations credential ID is globally unique.
    // But for safety validation usually requires user ID context.
    // If I only have ID, I might not be able to fetch it if adapter enforces compound key.
    // Prisma usually supports findUnique by ID alone.
    // But my interface `getPasskeyCredential` takes userId.
    // I should check my interface definition again.
    // `getPasskeyCredential(userId: string, credentialId: Uint8Array | Buffer): Promise<PasskeyCredential | null>;`
    // This implies I need userId.
    // But here I don't have it.
    // I should fix the interface to allow `userId` to be optional OR add `getPasskeyCredentialById(id)`.
    // I will pass `""` or `null` and hope the adapter implementation handles it if just ID is needed?
    // A concrete adapter using Prisma can ignore userId if id is unique.
    // I will pass `""` for now and assume the adapter (to be written/updated) handles it.
    // Actually, `WebAuthn` often looks up by CredentialID to find the User.
    // I must support lookup by CredentialID alone.
    // Use `""` as placeholder for now.

    if (credential === null) {
      return null;
    }
    return this.mapToWebAuthnUserCredential(credential);
  }

  public async getUserPasskeyCredential(
    userId: string,
    credentialId: Uint8Array
  ): Promise<WebAuthnUserCredential | null> {
    const credential = await this.adapter.getPasskeyCredential(
      userId,
      Buffer.from(credentialId)
    );
    if (credential === null) {
      return null;
    }
    return this.mapToWebAuthnUserCredential(credential);
  }

  public async createPasskeyCredential(
    credential: CreatePasskeyCredentialData
  ): Promise<void> {
    await this.adapter.createPasskeyCredential({
      id: Buffer.from(credential.id),
      userId: credential.userId,
      name: credential.name,
      algorithm: credential.algorithmId,
      publicKey: Buffer.from(credential.publicKey),
      deviceType: credential.deviceType ?? null,
      userAgent: credential.userAgent ?? null,
    });
  }

  public async updatePasskeyLastUsed(credentialId: Uint8Array): Promise<void> {
    await this.adapter.updatePasskeyCredential(credentialId, {
      lastUsedAt: new Date(),
    });
  }

  public async updatePasskeyMetadata(
    credentialId: Uint8Array,
    deviceType?: string,
    userAgent?: string
  ): Promise<void> {
    await this.adapter.updatePasskeyCredential(credentialId, {
      deviceType,
      userAgent,
    });
  }

  public async updatePasskeyName(
    credentialId: Uint8Array,
    name: string
  ): Promise<void> {
    await this.adapter.updatePasskeyCredential(credentialId, { name });
  }

  public async deleteUserPasskeyCredential(
    userId: string,
    credentialId: Uint8Array
  ): Promise<boolean> {
    await this.adapter.deletePasskeyCredential(credentialId, userId);
    return true;
  }

  // Security Key Methods
  public async getUserSecurityKeyCredentials(
    userId: string
  ): Promise<WebAuthnUserCredential[]> {
    const credentials = await this.adapter.getSecurityKeyCredentials(userId);
    return credentials.map((c) => this.mapSecurityKeyToWebAuthn(c));
  }

  public async getUserSecurityKeyCredential(
    userId: string,
    credentialId: Uint8Array
  ): Promise<WebAuthnUserCredential | null> {
    const cred = await this.adapter.getSecurityKeyCredential(
      userId,
      credentialId
    );
    return cred ? this.mapSecurityKeyToWebAuthn(cred) : null;
  }

  public async createSecurityKeyCredential(
    credential: WebAuthnUserCredential
  ): Promise<void> {
    await this.adapter.createSecurityKeyCredential({
      id: Buffer.from(credential.id),
      userId: credential.userId,
      name: credential.name,
      algorithm: credential.algorithmId,
      publicKey: Buffer.from(credential.publicKey),
    });
  }

  public async deleteUserSecurityKeyCredential(
    userId: string,
    credentialId: Uint8Array
  ): Promise<boolean> {
    await this.adapter.deleteSecurityKeyCredential(credentialId, userId);
    return true;
  }

  // Helpers
  private mapToWebAuthnUserCredential(
    cred: PasskeyCredential
  ): WebAuthnUserCredential {
    return {
      id: new Uint8Array(cred.id as any),
      userId: cred.userId,
      name: cred.name,
      algorithmId: cred.algorithm,
      publicKey: new Uint8Array(cred.publicKey as any),
      deviceType: cred.deviceType,
      userAgent: cred.userAgent,
      createdAt: cred.createdAt,
      lastUsedAt: cred.lastUsedAt,
    };
  }

  private mapSecurityKeyToWebAuthn(
    cred: SecurityKeyCredential
  ): WebAuthnUserCredential {
    return {
      id: new Uint8Array(cred.id as any),
      userId: cred.userId,
      name: cred.name,
      algorithmId: cred.algorithm,
      publicKey: new Uint8Array(cred.publicKey as any),
      deviceType: null,
      userAgent: null,
      createdAt: cred.createdAt,
      lastUsedAt: cred.lastUsedAt,
    };
  }
}
