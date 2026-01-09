"use client";

import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ResetPasswordState, resetPasswordAction } from "./actions";

export const dynamic = "force-dynamic";

import { Suspense } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" isLoading={pending} type="submit">
      Reset Password
    </Button>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const boundAction = resetPasswordAction.bind(null, token);
  const [state, formAction] = useFormState<ResetPasswordState, FormData>(
    boundAction,
    {}
  );

  if (!token) {
    return (
      <AuthCard
        description="This password reset link is invalid or has expired"
        title="Invalid Link"
      >
        <div className="text-center">
          <Button
            onClick={() => (window.location.href = "/forgot-password")}
            variant="outline"
          >
            Request New Link
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      description="Enter your new password below"
      title="Set new password"
    >
      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
            {state.error}
          </div>
        )}

        <Input
          error={state.fieldErrors?.password?.[0]}
          label="New Password"
          name="password"
          placeholder="••••••••"
          required
          type="password"
        />

        <Input
          error={state.fieldErrors?.confirmPassword?.[0]}
          label="Confirm Password"
          name="confirmPassword"
          placeholder="••••••••"
          required
          type="password"
        />

        <SubmitButton />
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthCard description="Please wait..." title="Loading">
          <div className="h-40 animate-pulse rounded-md bg-gray-100" />
        </AuthCard>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
