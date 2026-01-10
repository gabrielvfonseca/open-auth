"use server";

import { auth } from "@/lib/auth";

export interface RecoveryCodesState {
  error?: string;
  success?: boolean;
  codes?: string[];
  hasRecoveryCodes?: boolean;
}

export async function getRecoveryCodesStatusAction(): Promise<RecoveryCodesState> {
  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    const hasRecoveryCodes = await auth.recovery.hasRecoveryCodes(user.id);

    return { hasRecoveryCodes };
  } catch (error) {
    console.error("Get recovery codes status error:", error);
    return { error: "Failed to check recovery codes status" };
  }
}

export async function generateRecoveryCodesAction(): Promise<RecoveryCodesState> {
  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    const result = await auth.recovery.generateRecoveryCodes(user.id);

    return { codes: result.codes, success: true };
  } catch (error) {
    console.error("Generate recovery codes error:", error);
    return { error: "Failed to generate recovery codes" };
  }
}

export async function regenerateRecoveryCodesAction(): Promise<RecoveryCodesState> {
  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    // Generate new codes (this automatically deletes old ones)
    const result = await auth.recovery.generateRecoveryCodes(user.id);

    return { codes: result.codes, success: true };
  } catch (error) {
    console.error("Regenerate recovery codes error:", error);
    return { error: "Failed to regenerate recovery codes" };
  }
}
