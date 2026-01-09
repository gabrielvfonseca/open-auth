"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type ChangePasswordState, changePasswordAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" isLoading={pending} type="submit">
      Change Password
    </Button>
  );
}

export default function ChangePasswordPage() {
  const [state, formAction] = useFormState<ChangePasswordState, FormData>(
    changePasswordAction,
    {}
  );

  if (state.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-950 dark:to-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <CardTitle>Password Changed!</CardTitle>
            <CardDescription>
              Your password has been updated successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/settings">
              <Button className="w-full">Back to Settings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="mb-8">
          <Link
            className="text-indigo-600 text-sm hover:text-indigo-500 dark:text-indigo-400"
            href="/settings"
          >
            ← Back to Settings
          </Link>
          <h1 className="mt-4 font-bold text-3xl text-gray-900 dark:text-white">
            Change Password
          </h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form action={formAction} className="space-y-4">
              {state.error && (
                <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
                  {state.error}
                </div>
              )}

              <Input
                error={state.fieldErrors?.currentPassword?.[0]}
                label="Current Password"
                name="currentPassword"
                placeholder="••••••••"
                required
                type="password"
              />

              <Input
                error={state.fieldErrors?.newPassword?.[0]}
                label="New Password"
                name="newPassword"
                placeholder="••••••••"
                required
                type="password"
              />

              <Input
                error={state.fieldErrors?.confirmPassword?.[0]}
                label="Confirm New Password"
                name="confirmPassword"
                placeholder="••••••••"
                required
                type="password"
              />

              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
