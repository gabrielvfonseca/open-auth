"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export interface SignUpState {
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
    username?: string[];
  };
}

export async function signUpAction(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    username: formData.get("username") as string,
  };

  const parsed = signUpSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await auth.signUp(
      parsed.data.email,
      parsed.data.username,
      parsed.data.password,
      {} // options
    );

    if (!result.success) {
      return { error: result.message || "Sign up failed" };
    }
  } catch (error) {
    console.error("Sign up error:", error);
    return { error: "An unexpected error occurred" };
  }

  redirect("/verify-email");
}
