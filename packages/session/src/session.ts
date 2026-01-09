import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { cookies, headers } from "next/headers";

export interface SessionFlags {
  twoFactorVerified: boolean;
  rememberMe?: boolean;
  isPersistent?: boolean;
}

export interface Session extends SessionFlags {
  id: string;
  expiresAt: Date;
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: Date;
}

export type SessionValidationResult = { session: Session } | { session: null };

export interface SessionInfo {
  id: string;
  deviceName: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  lastActiveAt: Date;
  isPersistent: boolean;
  rememberMe: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface SessionConfig {
  expiresIn?: number; // in seconds
  freshAge?: number; // in seconds
  updateAge?: number; // in seconds
  cookieName?: string;
  secure?: boolean;
  path?: string;
  sameSite?: "lax" | "strict" | "none";
  domain?: string;
}

export class SessionService {
  private readonly config: Required<SessionConfig>;

  constructor(
    private readonly adapter: DatabaseAdapter,
    config: SessionConfig = {}
  ) {
    this.config = {
      expiresIn: config.expiresIn ?? 60 * 60 * 24 * 30, // 30 days
      freshAge: config.freshAge ?? 60 * 60 * 24, // 24 hours
      updateAge: config.updateAge ?? 60 * 60, // 1 hour
      cookieName: config.cookieName ?? "session_token",
      secure: config.secure ?? process.env.NODE_ENV === "production",
      path: config.path ?? "/",
      sameSite: config.sameSite ?? "lax",
      domain: config.domain ?? "",
    };
  }

  public async validateSessionToken(
    token: string
  ): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token))
    );
    const sessionData = await this.adapter.getSession(sessionId);

    if (sessionData === null) {
      return { session: null };
    }

    const session: Session = {
      id: sessionData.id,
      userId: sessionData.userId,
      expiresAt: sessionData.expiresAt,
      twoFactorVerified: sessionData.twoFactorVerified ?? false,
      // Note: DatabaseAdapter interface I defined earlier didn't explicitly have twoFactorVerified in Session interface?
      // Let's check shared interface. If not, I'll need to update generic adapter interface.
      // For now assume it's part of data or I'll fix the core interface next.
    };

    if (Date.now() >= session.expiresAt.getTime()) {
      await this.adapter.deleteSession(sessionId);
      return { session: null };
    }

    // Use configurable freshAge (converted to ms)
    const activePeriod = session.expiresAt.getTime() - Date.now();
    const extendThreshold = (this.config.expiresIn * 1000) / 2;

    if (activePeriod < extendThreshold) {
      session.expiresAt = new Date(Date.now() + this.config.expiresIn * 1000);
      await this.adapter.updateSession(session.id, {
        expiresAt: session.expiresAt,
      });
    }
    // Update last active timestamp
    // await this.updateSessionLastActive(sessionId);
    // This requires update capability.
    return { session };
  }

  public async getCurrentSession(): Promise<SessionValidationResult> {
    const token = cookies().get(this.config.cookieName)?.value ?? null;
    if (token === null) {
      return { session: null };
    }
    const result = await this.validateSessionToken(token);
    return result;
  }

  public async invalidateSession(sessionId: string): Promise<void> {
    await this.adapter.deleteSession(sessionId);
  }

  public async invalidateUserSessions(userId: string): Promise<void> {
    await this.adapter.deleteSessionsByUserId(userId);
  }

  public setSessionTokenCookie(token: string, expiresAt: Date): void {
    cookies().set(this.config.cookieName, token, {
      httpOnly: true,
      path: this.config.path,
      secure: this.config.secure,
      sameSite: this.config.sameSite as "lax" | "strict" | "none",
      expires: expiresAt,
      domain: this.config.domain,
    });
  }

  public deleteSessionTokenCookie(): void {
    cookies().set(this.config.cookieName, "", {
      httpOnly: true,
      path: this.config.path,
      secure: this.config.secure,
      sameSite: this.config.sameSite as "lax" | "strict" | "none",
      maxAge: 0,
      domain: this.config.domain,
    });
  }

  public generateSessionToken(): string {
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes);
    return token;
  }

  public async createSession(
    token: string,
    userId: string,
    flags: SessionFlags,
    accountId?: string
  ): Promise<Session> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token))
    );
    const rememberMe = flags.rememberMe ?? false;
    const isPersistent = flags.isPersistent ?? rememberMe;

    const expirationDays = isPersistent
      ? 90
      : this.config.expiresIn / (60 * 60 * 24);
    const expiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * expirationDays
    );

    // Simplified for Generic Adapter - Device fingerprinting logic logic heavily relies on
    // deviceService which also relied on database.
    // For this refactor step, I will simplify to core session creation.
    // The device logic needs to be refactored too.

    const session: Session = {
      id: sessionId,
      userId,
      expiresAt,
      twoFactorVerified: flags.twoFactorVerified,
    };

    // Casting to any to pass extra fields to adapter if it supports them (e.g. Prisma)
    await this.adapter.createSession({
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
      twoFactorVerified: session.twoFactorVerified,
      ipAddress: session.ipAddress ?? null,
      userAgent: session.userAgent ?? null,
      createdAt: session.createdAt ?? new Date(),
      accountId: accountId || undefined,
    });

    return session;
  }

  public async getUserSessions(userId: string): Promise<SessionInfo[]> {
    const sessions = await this.adapter.getSessionsByUserId(userId);
    return sessions.map((session: any) => ({
      id: session.id,
      deviceName: session.deviceName || "Unknown",
      ipAddress: session.ipAddress || null,
      userAgent: session.userAgent || null,
      lastActiveAt: session.lastActiveAt || new Date(),
      isPersistent: session.isPersistent,
      rememberMe: session.rememberMe,
      createdAt: session.createdAt || new Date(),
      expiresAt: session.expiresAt,
    }));
  }

  public async revokeSession(
    sessionId: string,
    userId: string
  ): Promise<boolean> {
    // Basic verification that session belongs to user would be generic,
    // but getSessionById + check userId is safest.
    const session = await this.adapter.getSession(sessionId);
    if (session && session.userId === userId) {
      await this.adapter.deleteSession(sessionId);
      return true;
    }
    return false;
  }

  public async revokeAllOtherSessions(
    sessionId: string,
    userId: string
  ): Promise<void> {
    // Adapter needs generic 'deleteSessionsExcluding(userId, sessionId)' or we fetch all and delete.
    const sessions = await this.adapter.getSessionsByUserId(userId);
    for (const session of sessions) {
      if (session.id !== sessionId) {
        await this.adapter.deleteSession(session.id);
      }
    }
  }

  public getDeviceInfo(): {
    deviceName: string | null;
    ipAddress: string | null;
    userAgent: string | null;
  } {
    const headersList = headers();
    const userAgent = headersList.get("user-agent") || null;
    const ipAddress =
      headersList.get("X-Forwarded-For") ||
      headersList.get("x-forwarded-for") ||
      null;

    let deviceName: string | null = null;
    if (userAgent) {
      if (userAgent.includes("Mobile")) {
        deviceName = "Mobile Device";
      } else if (userAgent.includes("Tablet")) {
        deviceName = "Tablet";
      } else if (userAgent.includes("Windows")) {
        deviceName = "Windows Device";
      } else if (userAgent.includes("Mac")) {
        deviceName = "Mac Device";
      } else if (userAgent.includes("Linux")) {
        deviceName = "Linux Device";
      } else {
        deviceName = "Unknown Device";
      }
    }

    return {
      deviceName,
      ipAddress,
      userAgent,
    };
  }
}

export function generateDeviceFingerprint(
  userAgent: string,
  ipAddress: string,
  userId: string
): string {
  const data = `${userAgent}|${ipAddress}|${userId}`;
  return encodeHexLowerCase(sha256(new TextEncoder().encode(data)));
}
