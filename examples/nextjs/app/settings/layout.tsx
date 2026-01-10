import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { session, user } = await auth.getCurrentSession();

  if (!(session && user)) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
