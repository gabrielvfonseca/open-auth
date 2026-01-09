import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
import { ExpiringTokenBucket, logger } from "@open-auth/core";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";

const _MAGIC_LINK_EXPIRY_MINUTES = 15;
// Rate limiting bucket
const magicLinkRequestBucket = new ExpiringTokenBucket(3, 60 * 10); // 3 requests per 10 minutes

export interface MagicLinkConfig {
  enabled?: boolean;
  expiresIn?: number; // seconds
}

export class MagicLinkService {
  private readonly config: Required<MagicLinkConfig>;

  constructor(
    private readonly adapter: DatabaseAdapter,
    config: MagicLinkConfig = {}
  ) {
    this.config = {
      enabled: config.enabled ?? true,
      expiresIn: config.expiresIn ?? 60 * 15, // 15 minutes
    };
  }

  public async createMagicLinkToken(
    email: string,
    userId?: string
  ): Promise<string> {
    if (!this.config.enabled) {
      throw new Error("Magic link service is disabled");
    }

    // Check rate limit
    if (!magicLinkRequestBucket.check(email, 1)) {
      throw new Error("Too many magic link requests");
    }

    if (!magicLinkRequestBucket.consume(email, 1)) {
      throw new Error("Too many magic link requests");
    }

    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes);
    const tokenHash = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token))
    );

    const id = encodeBase32LowerCaseNoPadding(
      crypto.getRandomValues(new Uint8Array(20))
    );
    const expiresAt = new Date(Date.now() + this.config.expiresIn * 1000);

    await this.adapter.createMagicLinkToken({
      id,
      userId: userId ?? null,
      email,
      tokenHash,
      expiresAt,
    });

    logger.info("Magic link token created", { email, userId, expiresAt });

    return token;
  }

  public async validateMagicLinkToken(token: string): Promise<{
    valid: boolean;
    userId: string | null;
    email: string | null;
  }> {
    const tokenHash = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token))
    );

    const magicLink = await this.adapter.getMagicLinkToken(tokenHash);

    if (!magicLink || magicLink.used || magicLink.expiresAt < new Date()) {
      return { valid: false, userId: null, email: null };
    }

    // Mark as used
    await this.adapter.updateMagicLinkToken(magicLink.id, {
      used: true,
      usedAt: new Date(),
    });

    logger.info("Magic link token used", {
      email: magicLink.email,
      userId: magicLink.userId,
    });

    return {
      valid: true,
      userId: magicLink.userId,
      email: magicLink.email,
    };
  }

  public async cleanupExpiredMagicLinks(): Promise<number> {
    return this.adapter.deleteExpiredMagicLinkTokens();
  }
}
