"use server";

import { redirect } from "next/navigation";
import { auth } from "open-auth";
import { z } from "zod";

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required to confirm deletion"),
  confirmation: z.literal("DELETE", {
    errorMap: () => ({ message: "Please type DELETE to confirm" }),
  }),
});

export interface DeleteAccountState {
  error?: string;
  fieldErrors?: {
    password?: string[];
    confirmation?: string[];
  };
}

export async function deleteAccountAction(
  _prevState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  const rawData = {
    password: formData.get("password") as string,
    confirmation: formData.get("confirmation") as string,
  };

  const parsed = deleteAccountSchema.safeParse(rawData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as any };
  }

  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    // Verify password using signIn
    const signInResult = await auth.signInWithEmailPassword(
      user.email,
      parsed.data.password
    );

    if (!signInResult.success) {
      return { error: "Incorrect password" };
    }

    // Delete the user and all associated data
    await auth.user.deleteUser(user.id);

    // Clear session cookie
    auth.session.deleteSessionTokenCookie();

    redirect("/sign-in?accountDeleted=true");
  } catch (error) {
    console.error("Delete account error:", error);
    return { error: "Failed to delete account" };
  }
}
