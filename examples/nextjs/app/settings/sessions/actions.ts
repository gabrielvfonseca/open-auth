"use server";

import { auth } from "open-auth";

export interface SessionsState {
  error?: string;
  success?: boolean;
  sessions?: Array<{
    id: string;
    createdAt: Date;
    expiresAt: Date;
    isCurrent: boolean;
    userAgent?: string;
    ipAddress?: string;
  }>;
}

export async function getSessionsAction(): Promise<SessionsState> {
  try {
    const { session: currentSession, user } = await auth.getCurrentSession();

    if (!(currentSession && user)) {
      return { error: "You must be signed in" };
    }

    const sessions = await auth.session.getUserSessions(user.id);

    return {
      sessions: sessions.map(
        (s: {
          id: string;
          createdAt: Date;
          expiresAt: Date;
          userAgent: string | null;
          ipAddress: string | null;
        }) => ({
          id: s.id,
          createdAt: s.createdAt,
          expiresAt: s.expiresAt,
          isCurrent: s.id === currentSession.id,
          userAgent: s.userAgent ?? undefined,
          ipAddress: s.ipAddress ?? undefined,
        })
      ),
    };
  } catch (error) {
    console.error("Get sessions error:", error);
    return { error: "Failed to load sessions" };
  }
}

export async function revokeSessionAction(
  sessionId: string
): Promise<SessionsState> {
  try {
    const { session: currentSession, user } = await auth.getCurrentSession();

    if (!(currentSession && user)) {
      return { error: "You must be signed in" };
    }

    if (sessionId === currentSession.id) {
      return { error: "Cannot revoke current session" };
    }

    await auth.session.invalidateSession(sessionId);

    return { success: true };
  } catch (error) {
    console.error("Revoke session error:", error);
    return { error: "Failed to revoke session" };
  }
}

export async function revokeAllSessionsAction(): Promise<SessionsState> {
  try {
    const { session: currentSession, user } = await auth.getCurrentSession();

    if (!(currentSession && user)) {
      return { error: "You must be signed in" };
    }

    await auth.session.invalidateUserSessions(user.id);

    return { success: true };
  } catch (error) {
    console.error("Revoke all sessions error:", error);
    return { error: "Failed to revoke sessions" };
  }
}
