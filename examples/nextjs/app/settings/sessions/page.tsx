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
  getSessionsAction,
  revokeAllSessionsAction,
  revokeSessionAction,
  type SessionsState,
} from "./actions";

export default function SessionsPage() {
  const [state, setState] = useState<SessionsState>({ sessions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  async function loadSessions() {
    setLoading(true);
    const data = await getSessionsAction();
    setState(data);
    setLoading(false);
  }

  async function handleRevoke(sessionId: string) {
    const result = await revokeSessionAction(sessionId);
    if (result.success) {
      await loadSessions();
    } else {
      setState({ ...state, error: result.error });
    }
  }

  async function handleRevokeAll() {
    if (!confirm("This will sign you out from all other devices. Continue?")) {
      return;
    }

    const result = await revokeAllSessionsAction();
    if (result.success) {
      await loadSessions();
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
            Active Sessions
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Manage your active sessions across all devices.
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
              <CardTitle>Your Sessions</CardTitle>
              <CardDescription>
                {state.sessions?.length || 0} active session(s)
              </CardDescription>
            </div>
            {(state.sessions?.length || 0) > 1 && (
              <Button onClick={handleRevokeAll} variant="outline">
                Sign Out All Others
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-indigo-600 border-b-2" />
              </div>
            ) : (
              <div className="space-y-4">
                {state.sessions?.map((session) => (
                  <div
                    className={`flex items-center justify-between rounded-lg border p-4 dark:border-gray-700 ${
                      session.isCurrent
                        ? "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20"
                        : ""
                    }`}
                    key={session.id}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <svg
                          className="h-5 w-5 text-gray-600 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">
                          {session.isCurrent ? "Current Session" : "Session"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Created{" "}
                          {new Date(session.createdAt).toLocaleDateString()}
                          {session.ipAddress && ` • ${session.ipAddress}`}
                        </p>
                      </div>
                    </div>
                    {session.isCurrent ? (
                      <span className="rounded bg-green-100 px-2 py-1 font-medium text-green-600 text-xs dark:bg-green-900/20 dark:text-green-400">
                        This device
                      </span>
                    ) : (
                      <Button
                        onClick={() => handleRevoke(session.id)}
                        size="sm"
                        variant="outline"
                      >
                        Revoke
                      </Button>
                    )}
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
