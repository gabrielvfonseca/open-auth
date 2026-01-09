"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Verify2FAState, verify2FAAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" isLoading={pending} type="submit">
      Verify
    </Button>
  );
}

export default function Verify2FAPage() {
  const [state, formAction] = useFormState<Verify2FAState, FormData>(
    verify2FAAction,
    {}
  );

  return (
    <AuthCard
      description="Enter the code from your authenticator app"
      title="Two-Factor Authentication"
    >
      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
            {state.error}
          </div>
        )}

        <Input
          autoComplete="one-time-code"
          className="text-center font-mono text-2xl tracking-widest"
          label="Verification Code"
          maxLength={6}
          name="code"
          placeholder="000000"
          required
        />

        <SubmitButton />
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm dark:text-gray-400">
          Having trouble? Try using a{" "}
          <button className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            recovery code
          </button>
        </p>
      </div>
    </AuthCard>
  );
}
