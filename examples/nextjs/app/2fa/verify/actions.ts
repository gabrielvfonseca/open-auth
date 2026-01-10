"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export interface Verify2FAState {
  error?: string;
}

export async function verify2FAAction(
  _prevState: Verify2FAState,
  formData: FormData
): Promise<Verify2FAState> {
  const code = formData.get("code") as string;

  if (!code || code.length !== 6) {
    return { error: "Please enter a valid 6-digit code" };
  }

  try {
    const { session } = await auth.getCurrentSession();

    if (!session) {
      return { error: "Session not found" };
    }

    const result = await auth.mfa.totp.verifyTOTPCode(session.userId, code);

    if (!result.valid) {
      return { error: "Invalid verification code" };
    }

    // Mark session as 2FA verified
    await auth.session.setSessionAs2FAVerified(session.id);
  } catch (error) {
    console.error("2FA verification error:", error);
    return { error: "An unexpected error occurred" };
  }

  redirect("/");
}
