import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { verifyMagicLinkToken } from "./actions";

export default async function MagicLinkVerifyPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    return (
      <AuthCard
        description="This magic link appears to be invalid"
        title="Invalid Link"
      >
        <div className="text-center">
          <Link href="/sign-in/magic-link">
            <Button>Request New Link</Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  const result = await verifyMagicLinkToken(token);

  if (result.success) {
    redirect("/");
  }

  return (
    <AuthCard
      description={
        result.error || "This magic link has expired or already been used"
      }
      title="Link Expired"
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <svg
            className="h-8 w-8 text-red-600 dark:text-red-400"
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
        </div>
        <Link href="/sign-in/magic-link">
          <Button>Request New Link</Button>
        </Link>
      </div>
    </AuthCard>
  );
}
