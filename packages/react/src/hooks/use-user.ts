"use client";

import { useAuth } from "../context";
import type { User } from "../types";

export function useUser(): { user: User | null; isLoading: boolean } {
  const { user, isLoading } = useAuth();
  return { user, isLoading };
}
