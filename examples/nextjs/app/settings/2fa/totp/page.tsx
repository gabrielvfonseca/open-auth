"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import {
  getTOTPSetupDataAction,
  type TOTPSetupState,
  verifyTOTPSetupAction,
} from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" isLoading={pending} type="submit">
      Enable 2FA
    </Button>
  );
}

export default function TOTPSetupPage() {
  const [setupData, setSetupData] = useState<TOTPSetupState>({});
  const [state, formAction] = useFormState<TOTPSetupState, FormData>(
    verifyTOTPSetupAction,
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTOTPSetupDataAction().then((data) => {
      setSetupData(data);
      setLoading(false);
    });
  }, []);

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
            <CardTitle>2FA Enabled!</CardTitle>
            <CardDescription>
              Your account is now protected with two-factor authentication.
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-950 dark:to-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set Up Two-Factor Authentication</CardTitle>
          <CardDescription>
            Scan the QR code with your authenticator app (like Google
            Authenticator or Authy)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-indigo-600 border-b-2" />
            </div>
          ) : setupData.error ? (
            <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
              {setupData.error}
            </div>
          ) : (
            <>
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="rounded-lg bg-white p-4">
                  {setupData.qrCode && (
                    <img
                      alt="TOTP QR Code"
                      className="h-48 w-48"
                      src={setupData.qrCode}
                    />
                  )}
                </div>
              </div>

              {/* Manual Entry */}
              <div className="space-y-2">
                <p className="text-center text-gray-500 text-sm dark:text-gray-400">
                  Can&apos;t scan? Enter this code manually:
                </p>
                <code className="block break-all rounded bg-gray-100 p-2 text-center font-mono text-sm dark:bg-gray-800">
                  {setupData.secret}
                </code>
              </div>

              {/* Verification Form */}
              <form action={formAction} className="space-y-4">
                <input
                  name="secret"
                  type="hidden"
                  value={setupData.secret || ""}
                />
                {state.error && (
                  <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
                    {state.error}
                  </div>
                )}

                <Input
                  className="text-center font-mono text-xl tracking-widest"
                  label="Verification Code"
                  maxLength={6}
                  name="code"
                  placeholder="000000"
                  required
                />

                <SubmitButton />
              </form>
            </>
          )}

          <div className="text-center">
            <Link
              className="text-gray-500 text-sm hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              href="/settings"
            >
              ← Back to Settings
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
