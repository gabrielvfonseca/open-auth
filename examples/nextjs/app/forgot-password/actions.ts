"use server";

import { auth } from "@/lib/auth";

export interface ForgotPasswordState {
  error?: string;
  success?: boolean;
}

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const user = await auth.user.getUserFromEmail(email);

    if (user) {
      const token = await auth.magic.createMagicLinkToken(email, user.id);
      // In a real app, send email with link:
      // ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}
      console.log(
        `[DEV] Password Reset Link: http://localhost:3000/reset-password?token=${token}`
      );
    } else {
      console.log(
        `[DEV] Password Reset requested for non-existent email: ${email}`
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { success: true };
  }
}
