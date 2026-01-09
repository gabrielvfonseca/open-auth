"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  resendCodeAction,
  type VerifyEmailState,
  verifyEmailAction,
} from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" isLoading={pending} type="submit">
      Verify Email
    </Button>
  );
}

export default function VerifyEmailPage() {
  const [state, formAction] = useFormState<VerifyEmailState, FormData>(
    verifyEmailAction,
    {}
  );
  const [resendState, setResendState] = useState<{
    loading: boolean;
    message?: string;
  }>({ loading: false });

  async function handleResend() {
    setResendState({ loading: true });
    const result = await resendCodeAction();
    if (result.success) {
      setResendState({ loading: false, message: "Code sent!" });
    } else {
      setResendState({ loading: false, message: result.error });
    }
  }

  return (
    <AuthCard
      description="We sent a verification code to your email"
      title="Verify your email"
    >
      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
            {state.error}
          </div>
        )}

        <Input
          className="text-center text-2xl tracking-widest"
          label="Verification Code"
          maxLength={6}
          name="code"
          placeholder="123456"
          required
        />

        <SubmitButton />
      </form>

      <div className="mt-4 text-center">
        <button
          className="text-indigo-600 text-sm hover:text-indigo-500 disabled:opacity-50 dark:text-indigo-400"
          disabled={resendState.loading}
          onClick={handleResend}
        >
          {resendState.loading ? "Sending..." : "Resend code"}
        </button>
        {resendState.message && (
          <p className="mt-2 text-gray-500 text-sm">{resendState.message}</p>
        )}
      </div>
    </AuthCard>
  );
}
