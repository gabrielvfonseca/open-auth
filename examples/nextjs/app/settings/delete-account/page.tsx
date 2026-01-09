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
import { type DeleteAccountState, deleteAccountAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full"
      isLoading={pending}
      type="submit"
      variant="destructive"
    >
      Delete My Account
    </Button>
  );
}

export default function DeleteAccountPage() {
  const [state, formAction] = useFormState<DeleteAccountState, FormData>(
    deleteAccountAction,
    {}
  );

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
          <h1 className="mt-4 font-bold text-3xl text-red-600 dark:text-red-400">
            Delete Account
          </h1>
        </div>

        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">
              ⚠️ Danger Zone
            </CardTitle>
            <CardDescription>
              This action is irreversible. All your data will be permanently
              deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 text-sm dark:bg-red-900/20 dark:text-red-300">
              <p className="mb-2 font-medium">What will be deleted:</p>
              <ul className="list-inside list-disc space-y-1">
                <li>Your profile and account information</li>
                <li>All active sessions</li>
                <li>All passkeys and 2FA settings</li>
                <li>All recovery codes</li>
              </ul>
            </div>

            <form action={formAction} className="space-y-4">
              {state.error && (
                <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
                  {state.error}
                </div>
              )}

              <Input
                error={state.fieldErrors?.password?.[0]}
                label="Enter your password to confirm"
                name="password"
                placeholder="••••••••"
                required
                type="password"
              />

              <Input
                error={state.fieldErrors?.confirmation?.[0]}
                label="Type DELETE to confirm"
                name="confirmation"
                placeholder="DELETE"
                required
              />

              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
