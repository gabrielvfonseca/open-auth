"use server";

import { auth } from "open-auth";

export async function verifyMagicLinkToken(
  token: string
): Promise<{ success: boolean; error?: string }> {
  if (!token) {
    return { success: false, error: "Invalid token" };
  }

  try {
    const result = await auth.magic.validateMagicLinkToken(token);

    if (!(result.valid && result.email)) {
      return { success: false, error: "Invalid or expired link" };
    }

    const { user, account } =
      await auth.account.findOrCreateAccountForMagicLink(result.email);

    const sessionToken = auth.session.generateSessionToken();
    const session = await auth.session.createSession(
      sessionToken,
      user.id,
      { twoFactorVerified: false },
      account.id
    );
    auth.session.setSessionTokenCookie(sessionToken, session.expiresAt);

    return { success: true };
  } catch (error) {
    console.error("Magic link verification error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
