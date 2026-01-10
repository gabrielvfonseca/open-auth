"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export interface ResetPasswordState {
  error?: string;
  fieldErrors?: {
    password?: string[];
    confirmPassword?: string[];
  };
}

export async function resetPasswordAction(
  token: string,
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const rawData = {
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = resetPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    // Validate magic link token
    const result = await auth.magic.validateMagicLinkToken(token);

    if (!(result.valid && result.userId)) {
      return { error: "Invalid or expired reset link" };
    }

    // Update user password (helper handles hashing)
    await auth.account.updateUserPassword(result.userId, parsed.data.password);

    // Optionally: Invalidate sessions
    await auth.session.invalidateUserSessions(result.userId);
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "An unexpected error occurred" };
  }

  redirect("/sign-in?passwordReset=true");
}
