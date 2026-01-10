"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AuthContextValue, Session, User } from "./types";

const AuthContext = createContext<AuthContextValue | null>(null);

/** @public */
export interface AuthProviderProps {
  children: ReactNode;
  /** Optional: URL to fetch session from. Defaults to /api/auth/session */
  sessionUrl?: string;
}

export function AuthProvider({
  children,
  sessionUrl = "/api/auth/session",
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch(sessionUrl, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
        setSession(data.session || null);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch {
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [sessionUrl]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Sign in failed");
      }
      await refreshSession();
    },
    [refreshSession]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Sign up failed");
      }
      await refreshSession();
    },
    [refreshSession]
  );

  const signOut = useCallback(async () => {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setSession(null);
  }, []);

  const value: AuthContextValue = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
