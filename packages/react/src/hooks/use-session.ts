"use client";

import { useAuth } from "../context";
import type { Session } from "../types";

export function useSession(): { session: Session | null; isLoading: boolean } {
  const { session, isLoading } = useAuth();
  return { session, isLoading };
}
