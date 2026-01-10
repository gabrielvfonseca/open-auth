import { defineMiddleware } from "astro/middleware";
import { auth } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const sessionId = context.cookies.get(auth.session.cookieName)?.value;
  if (!sessionId) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const { session, user } = await auth.validateSessionToken(sessionId);
  if (session) {
    context.cookies.set(auth.session.cookieName, session.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: import.meta.env.PROD,
      expires: session.expiresAt,
    });
    context.locals.session = session;
    context.locals.user = user;
  } else {
    context.locals.session = null;
    context.locals.user = null;
  }
  return next();
});
