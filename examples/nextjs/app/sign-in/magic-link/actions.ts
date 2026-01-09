"use server";

import { auth } from "open-auth";

export interface MagicLinkState {
  error?: string;
  success?: boolean;
}

export async function sendMagicLinkAction(
  _prevState: MagicLinkState,
  formData: FormData
): Promise<MagicLinkState> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const token = await auth.magic.createMagicLinkToken(email);
    // Note: In a real app, you would send this token via email
    console.log(`Magic Link Token for ${email}: ${token}`);

    return { success: true };
  } catch (error) {
    console.error("Magic link error:", error);
    return { error: "An unexpected error occurred" };
  }
}
