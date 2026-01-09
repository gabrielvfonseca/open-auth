"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type MagicLinkState, sendMagicLinkAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" isLoading={pending} type="submit">
      Send Magic Link
    </Button>
  );
}

export default function MagicLinkPage() {
  const [state, formAction] = useFormState<MagicLinkState, FormData>(
    sendMagicLinkAction,
    {}
  );

  if (state.success) {
    return (
      <AuthCard
        description="We sent you a magic link to sign in"
        title="Check your email"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Click the link in your email to sign in. The link expires in 15
            minutes.
          </p>
          <Link href="/sign-in">
            <Button className="mt-4" variant="outline">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      description="We'll email you a link to sign in"
      footer={
        <>
          Remember your password?{" "}
          <Link
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            href="/sign-in"
          >
            Sign in
          </Link>
        </>
      }
      title="Sign in with Magic Link"
    >
      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
            {state.error}
          </div>
        )}

        <Input
          label="Email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />

        <SubmitButton />
      </form>
    </AuthCard>
  );
}
