import type {
  DatabaseAdapter,
  PasswordResetSession,
  User,
} from "@open-auth/core";
import { generateRandomOTP } from "@open-auth/core";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

import { cookies } from "next/headers";

export class PasswordResetService {
  constructor(private readonly adapter: DatabaseAdapter) {}

  public async createPasswordResetSession(
    token: string,
    userId: string,
    email: string
  ): Promise<PasswordResetSession> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token))
    );
    const session: PasswordResetSession = {
      id: sessionId,
      userId,
      email,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      code: generateRandomOTP(),
      emailVerified: false,
      twoFactorVerified: false,
    };
    await this.adapter.createPasswordResetSession(session);
    return session;
  }

  public async validatePasswordResetSessionToken(
    token: string
  ): Promise<{ session: PasswordResetSession | null; user: User | null }> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token))
    );
    const sessionData =
      await this.adapter.getPasswordResetSessionById(sessionId);

    if (sessionData === null) {
      return { session: null, user: null };
    }

    // Need to fetch user to return it. Adapter.getPasswordResetSessionById might not include user.
    // My interface says it returns PasswordResetSession (data only).
    // Original code `db.findUnique({include: {user: ...}})`.
    // So I must fetch user separately.
    const user = await this.adapter.getUserById(sessionData.userId);
    if (!user) {
      return { session: null, user: null };
    }

    // Check expiry
    if (Date.now() >= sessionData.expiresAt.getTime()) {
      await this.adapter.deletePasswordResetSession(sessionData.id);
      return { session: null, user: null };
    }
    return { session: sessionData, user };
  }

  public async setPasswordResetSessionAsEmailVerified(
    sessionId: string
  ): Promise<void> {
    await this.adapter.updatePasswordResetSession(sessionId, {
      emailVerified: true,
    });
  }

  public async setPasswordResetSessionAs2FAVerified(
    sessionId: string
  ): Promise<void> {
    await this.adapter.updatePasswordResetSession(sessionId, {
      twoFactorVerified: true,
    });
  }

  public async invalidateUserPasswordResetSessions(
    userId: string
  ): Promise<void> {
    await this.adapter.deletePasswordResetSessionsByUserId(userId);
  }

  // Next.js specific helpers can remain as static or separate utils?
  // They depend on cookies().
  // Using `cache` on class method? `cache` wraps a function.
  // I will export these as instance methods but `getCurrentPasswordResetSession` relies on `this`.
  // Actually, for simplicity, I will keep cookie logic here.
  // BUT the `cache` wrapper might be tricky with class instance methods if instance is created per request?
  // Usually service is created once.
  // I will remove `cache` for now or apply it?
  // The original used `cache` on a standalone function.
  // I will make `getCurrentSession` a regular method. Usage in client component might be an issue?
  // No, these are server actions/utils.

  public async getCurrentPasswordResetSession(): Promise<{
    session: PasswordResetSession | null;
    user: User | null;
  }> {
    const token = cookies().get("password_reset_session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = await this.validatePasswordResetSessionToken(token);
    if (result.session === null) {
      this.deletePasswordResetSessionTokenCookie();
    }
    return result;
  }

  public setPasswordResetSessionTokenCookie(
    token: string,
    expiresAt: Date
  ): void {
    cookies().set("password_reset_session", token, {
      expires: expiresAt,
      sameSite: "lax",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
  }

  public deletePasswordResetSessionTokenCookie(): void {
    cookies().set("password_reset_session", "", {
      maxAge: 0,
      sameSite: "lax",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
  }

  public async sendPasswordResetEmail(
    email: string,
    code: string
  ): Promise<void> {
    const { sendEmail } = await import("@open-auth/core");
    const { getPasswordResetEmailTemplate } = await import("@open-auth/core");

    const template = getPasswordResetEmailTemplate(code);
    await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }
}
