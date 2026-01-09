import { redirect } from "next/navigation";
import { auth } from "open-auth";
import type { ReactNode } from "react";

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
