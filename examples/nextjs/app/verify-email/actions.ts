"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export interface VerifyEmailState {
  error?: string;
  success?: boolean;
}

export async function verifyEmailAction(
  _prevState: VerifyEmailState,
  formData: FormData
): Promise<VerifyEmailState> {
  const code = formData.get("code") as string;

  if (!code || code.length !== 6) {
    return { error: "Please enter a valid 6-digit code" };
  }

  try {
    const request =
      await auth.emailVerification.getCurrentUserEmailVerification();

    if (!request) {
      return {
        error: "Verification request not found. Try resending the code.",
      };
    }

    if (Date.now() > new Date(request.expiresAt).getTime()) {
      return { error: "Code expired" };
    }

    if (request.code !== code) {
      return { error: "Invalid verification code" };
    }

    // Verify email
    await auth.user.updateUserEmailAndSetEmailAsVerified(
      request.userId,
      request.email
    );

    // Cleanup
    auth.emailVerification.deleteEmailVerificationCookie();
    await auth.emailVerification.deleteUserEmailVerification(request.userId);

    return { success: true };
  } catch (error) {
    console.error("Verify email error:", error);
    return { error: "An unexpected error occurred" };
  }

  redirect("/");
}

export async function resendCodeAction(): Promise<VerifyEmailState> {
  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    if (!auth.emailVerification.sendVerificationEmailBucket.check(user.id, 1)) {
      return { error: "Too many requests. Please wait." };
    }

    if (
      !auth.emailVerification.sendVerificationEmailBucket.consume(user.id, 1)
    ) {
      return { error: "Too many requests. Please wait." };
    }

    const verification = await auth.emailVerification.createEmailVerification(
      user.id,
      user.email
    );
    auth.emailVerification.setEmailVerificationCookie(verification);

    console.log(
      `[DEV] Verification Code for ${user.email}: ${verification.code}`
    );

    return { success: true };
  } catch (error) {
    console.error("Resend code error:", error);
    return { error: "Failed to resend code" };
  }
}
