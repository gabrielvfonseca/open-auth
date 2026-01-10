"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export interface SignInState {
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
  requires2FA?: boolean;
}

export async function signInAction(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signInSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await auth.signInWithEmailPassword(
      parsed.data.email,
      parsed.data.password
    );

    if (!result.success) {
      return { error: result.message || "Invalid email or password" };
    }

    if (result.session) {
      const user = await auth.user.getUserById(result.session.userId);
      if (user?.registered2FA) {
        redirect("/2fa/verify");
      }
    }
  } catch (error) {
    console.error("Sign in error:", error);
    return { error: "An unexpected error occurred" };
  }

  redirect("/");
}
