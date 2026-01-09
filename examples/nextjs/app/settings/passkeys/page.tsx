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
  deletePasskeyAction,
  getPasskeysAction,
  getRegistrationOptionsAction,
  type PasskeyState,
  registerPasskeyAction,
} from "./actions";

export default function PasskeysPage() {
  const [state, setState] = useState<PasskeyState>({ passkeys: [] });
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    loadPasskeys();
  }, [loadPasskeys]);

  async function loadPasskeys() {
    setLoading(true);
    const data = await getPasskeysAction();
    setState(data);
    setLoading(false);
  }

  async function handleRegister() {
    setRegistering(true);
    try {
      const optionsResult = await getRegistrationOptionsAction();
      if (optionsResult.error || !optionsResult.registrationOptions) {
        setState({
          ...state,
          error: optionsResult.error || "Failed to get options",
        });
        return;
      }

      // @ts-expect-error - WebAuthn API
      const credential = await navigator.credentials.create({
        publicKey: optionsResult.registrationOptions,
      });

      const result = await registerPasskeyAction(credential);
      if (result.success) {
        await loadPasskeys();
      } else {
        setState({ ...state, error: result.error });
      }
    } catch (error: any) {
      setState({ ...state, error: error.message || "Registration cancelled" });
    } finally {
      setRegistering(false);
    }
  }

  async function handleDelete(passkeyId: string) {
    if (!confirm("Are you sure you want to delete this passkey?")) {
      return;
    }

    const result = await deletePasskeyAction(passkeyId);
    if (result.success) {
      await loadPasskeys();
    } else {
      setState({ ...state, error: result.error });
    }
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
            Passkeys
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Passkeys let you sign in securely using your fingerprint, face, or
            screen lock.
          </p>
        </div>

        {state.error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400">
            {state.error}
          </div>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Passkeys</CardTitle>
              <CardDescription>Manage your registered passkeys</CardDescription>
            </div>
            <Button isLoading={registering} onClick={handleRegister}>
              Add Passkey
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-indigo-600 border-b-2" />
              </div>
            ) : state.passkeys?.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
                <p className="mt-4">No passkeys registered yet</p>
                <p className="text-sm">
                  Add a passkey to sign in faster and more securely
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.passkeys?.map((passkey) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-4 dark:border-gray-700"
                    key={passkey.id}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
                        <svg
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{passkey.name}</p>
                        <p className="text-gray-500 text-sm">
                          Added{" "}
                          {new Date(passkey.createdAt).toLocaleDateString()}
                          {passkey.lastUsed &&
                            ` • Last used ${new Date(passkey.lastUsed).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(passkey.id)}
                      size="sm"
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
