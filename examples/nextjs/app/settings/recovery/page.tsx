"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  generateRecoveryCodesAction,
  getRecoveryCodesStatusAction,
  type RecoveryCodesState,
  regenerateRecoveryCodesAction,
} from "./actions";

export default function RecoveryCodesPage() {
  const [state, setState] = useState<RecoveryCodesState>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showCodes, setShowCodes] = useState(false);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  async function checkStatus() {
    setLoading(true);
    const data = await getRecoveryCodesStatusAction();
    setState(data);
    setLoading(false);
  }

  async function handleGenerate() {
    setGenerating(true);
    const result = state.hasRecoveryCodes
      ? await regenerateRecoveryCodesAction()
      : await generateRecoveryCodesAction();
    setState(result);
    setShowCodes(true);
    setGenerating(false);
  }

  function downloadCodes() {
    if (!state.codes) {
      return;
    }
    const content = state.codes.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <Link
            className="text-indigo-600 text-sm hover:text-indigo-500 dark:text-indigo-400"
            href="/settings"
          >
            ← Back to Settings
          </Link>
          <h1 className="mt-4 font-bold text-3xl text-gray-900 dark:text-white">
            Recovery Codes
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Use these codes to access your account if you lose your 2FA device.
          </p>
        </div>

        {state.error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
            {state.error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Backup Recovery Codes</CardTitle>
            <CardDescription>
              Each code can only be used once. Keep them in a safe place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-indigo-600 border-b-2" />
              </div>
            ) : showCodes && state.codes ? (
              <div className="space-y-6">
                <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-400">
                        Save these codes now!
                      </h4>
                      <p className="text-amber-700 text-sm dark:text-amber-300">
                        You won&apos;t be able to see them again after leaving
                        this page.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-4 font-mono text-sm dark:bg-gray-800">
                  {state.codes.map((code, index) => (
                    <div
                      className="rounded bg-white p-2 dark:bg-gray-900"
                      key={index}
                    >
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={downloadCodes}
                    variant="outline"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    Download
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() =>
                      navigator.clipboard.writeText(state.codes?.join("\n"))
                    }
                    variant="outline"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    Copy All
                  </Button>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setShowCodes(false)}
                  variant="ghost"
                >
                  I&apos;ve saved my codes
                </Button>
              </div>
            ) : (
              <div className="space-y-4 py-8 text-center">
                {state.hasRecoveryCodes ? (
                  <>
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                      <svg
                        className="h-5 w-5"
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
                      Recovery codes are set up
                    </div>
                    <p className="text-gray-500 text-sm">
                      You can generate new codes, but this will invalidate your
                      existing ones.
                    </p>
                    <Button
                      isLoading={generating}
                      onClick={handleGenerate}
                      variant="outline"
                    >
                      Regenerate Codes
                    </Button>
                  </>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                      />
                    </svg>
                    <p className="text-gray-500">
                      No recovery codes generated yet
                    </p>
                    <Button isLoading={generating} onClick={handleGenerate}>
                      Generate Recovery Codes
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
