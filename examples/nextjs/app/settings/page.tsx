import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "open-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function signOut() {
  "use server";
  const { session } = await auth.getCurrentSession();
  if (session) {
    await auth.session.invalidateSession(session.id);
    auth.session.deleteSessionTokenCookie();
  }
  redirect("/sign-in");
}

export default async function SettingsPage() {
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
              <Link href="/">
                <Button size="sm" variant="ghost">
                  Dashboard
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

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-bold text-3xl text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Manage your account and security settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-medium text-gray-500 text-sm">
                    Username
                  </label>
                  <p className="mt-1 font-medium">{user.username}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-500 text-sm">
                    Email
                  </label>
                  <p className="mt-1 font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
                    user.emailVerified
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                  }`}
                >
                  {user.emailVerified ? "Email Verified" : "Email Not Verified"}
                </span>
                {!user.emailVerified && (
                  <Link href="/verify-email">
                    <Button className="p-0" size="sm" variant="link">
                      Verify now
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password */}
              <div className="flex items-center justify-between border-b py-3 dark:border-gray-700">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-gray-500 text-sm">Change your password</p>
                </div>
                <Link href="/settings/password">
                  <Button size="sm" variant="outline">
                    Change Password
                  </Button>
                </Link>
              </div>

              {/* TOTP 2FA */}
              <div className="flex items-center justify-between border-b py-3 dark:border-gray-700">
                <div>
                  <h3 className="font-medium">Authenticator App (TOTP)</h3>
                  <p className="text-gray-500 text-sm">
                    {user.registeredTOTP
                      ? "Two-factor authentication is enabled"
                      : "Add an extra layer of security"}
                  </p>
                </div>
                <Link href="/settings/2fa/totp">
                  <Button
                    size="sm"
                    variant={user.registeredTOTP ? "outline" : "default"}
                  >
                    {user.registeredTOTP ? "Manage" : "Set Up"}
                  </Button>
                </Link>
              </div>

              {/* Passkey */}
              <div className="flex items-center justify-between border-b py-3 dark:border-gray-700">
                <div>
                  <h3 className="font-medium">Passkeys</h3>
                  <p className="text-gray-500 text-sm">
                    {user.registeredPasskey
                      ? "Passkey authentication is enabled"
                      : "Sign in with biometrics or hardware keys"}
                  </p>
                </div>
                <Link href="/settings/passkeys">
                  <Button
                    size="sm"
                    variant={user.registeredPasskey ? "outline" : "default"}
                  >
                    {user.registeredPasskey ? "Manage" : "Add Passkey"}
                  </Button>
                </Link>
              </div>

              {/* Security Key */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium">Security Keys</h3>
                  <p className="text-gray-500 text-sm">
                    {user.registeredSecurityKey
                      ? "Security key is registered"
                      : "Use hardware security keys for 2FA"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={user.registeredSecurityKey ? "outline" : "default"}
                >
                  {user.registeredSecurityKey ? "Manage" : "Add Key"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions across devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg bg-indigo-50 px-4 py-3 dark:bg-indigo-900/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
                    <svg
                      className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
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
                    <p className="font-medium">Current Session</p>
                    <p className="text-gray-500 text-sm">Active now</p>
                  </div>
                </div>
                <Link href="/settings/sessions">
                  <Button size="sm" variant="outline">
                    Manage Sessions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-900/50">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-gray-500 text-sm">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Link href="/settings/delete-account">
                  <Button size="sm" variant="destructive">
                    Delete Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
