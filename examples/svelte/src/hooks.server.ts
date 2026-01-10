import type { Handle } from "@sveltejs/kit";
import { auth } from "$lib/auth";

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(auth.session.cookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await auth.validateSessionToken(sessionId);
  if (session) {
    event.cookies.set(auth.session.cookieName, session.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: import.meta.env.PROD,
      expires: session.expiresAt,
    });
    event.locals.session = session;
    event.locals.user = user;
  } else {
    event.cookies.delete(auth.session.cookieName, { path: "/" });
    event.locals.session = null;
    event.locals.user = null;
  }
  return resolve(event);
};
