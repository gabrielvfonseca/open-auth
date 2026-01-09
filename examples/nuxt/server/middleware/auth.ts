import { auth } from "open-auth";

declare module "h3" {
  interface H3EventContext {
    user: import("open-auth").User | null;
    session: import("open-auth").Session | null;
  }
}

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, auth.session.cookieName);
  if (!sessionId) {
    event.context.user = null;
    event.context.session = null;
    return;
  }

  const { session, user } = await auth.validateSessionToken(sessionId);
  if (session) {
    setCookie(event, auth.session.cookieName, session.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: session.expiresAt,
    });
    event.context.session = session;
    event.context.user = user;
  } else {
    deleteCookie(event, auth.session.cookieName);
    event.context.session = null;
    event.context.user = null;
  }
});
