import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";

async function signOut() {
  "use server";
  const { session } = await auth.getCurrentSession();
  if (session) {
    await auth.session.invalidateSession(session.id);
    auth.session.deleteSessionTokenCookie();
  }
  redirect("/sign-in");
}

export default async function DashboardPage() {
  const { session, user } = await auth.getCurrentSession();

  if (!(session && user)) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <nav className="border-b bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <Link
                className="flex items-center gap-2 font-bold text-indigo-600 text-xl dark:text-indigo-400"
                href="/"
              >
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                open-auth Auth
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/settings">
                <Button size="sm" variant="ghost">
                  Settings
                </Button>
              </Link>
              <form action={signOut}>
                <Button size="sm" type="submit" variant="outline">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-bold text-3xl text-gray-900 dark:text-white">
            Welcome back, {user.username}!
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Here&apos;s what&apos;s happening with your account
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Profile
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email Verified</span>
                <span
                  className={
                    user.emailVerified ? "text-green-600" : "text-amber-600"
                  }
                >
                  {user.emailVerified ? "Yes" : "No"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Security
              </CardTitle>
              <CardDescription>
                Two-factor authentication status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">2FA Enabled</span>
                <span
                  className={
                    user.registered2FA ? "text-green-600" : "text-gray-400"
                  }
                >
                  {user.registered2FA ? "Active" : "Not set up"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Passkey</span>
                <span
                  className={
                    user.registeredPasskey ? "text-green-600" : "text-gray-400"
                  }
                >
                  {user.registeredPasskey ? "Registered" : "Not set up"}
                </span>
              </div>
              <Link href="/settings">
                <Button className="mt-2 p-0" size="sm" variant="link">
                  Manage Security →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Session
              </CardTitle>
              <CardDescription>Current session information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Session ID</span>
                <span className="font-mono text-xs">
                  {session.id.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Expires</span>
                <span>{new Date(session.expiresAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
