"use server";

import { auth } from "open-auth";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export interface ChangePasswordState {
  error?: string;
  fieldErrors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
  success?: boolean;
}

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const rawData = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = changePasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    // Verify current password
    const passwordHash = await auth.account.getUserPasswordHash(user.id);

    if (!passwordHash) {
      return { error: "No password set for this account" };
    }

    const validPassword = await auth.password.verifyPasswordHash(
      passwordHash,
      parsed.data.currentPassword
    );
    if (!validPassword) {
      return { error: "Current password is incorrect" };
    }

    // Check password history (returns true if password is NEW/SAFE)
    const isSafe = await auth.passwordHistory.checkPasswordHistory(
      user.id,
      parsed.data.newPassword
    );
    if (!isSafe) {
      return {
        error:
          "This password has been used recently. Please choose a different one.",
      };
    }

    // Update password
    await auth.account.updateUserPassword(user.id, parsed.data.newPassword);

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { error: "Failed to change password" };
  }
}
