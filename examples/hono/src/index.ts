import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { Session, User } from "open-auth";
import { auth } from "./lib/auth";

const app = new Hono<{
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>();

// Middleware to validate session
app.use("*", async (c, next) => {
  const sessionId = getCookie(c, auth.session.cookieName);
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await auth.validateSessionToken(sessionId);
  if (session) {
    setCookie(c, auth.session.cookieName, session.id, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expiresAt,
    });
    c.set("user", user);
    c.set("session", session);
  } else {
    c.set("user", null);
    c.set("session", null);
  }
  await next();
});

app.get("/", (c) => {
  const user = c.get("user");
  return c.json({
    message: "Welcome to Open Auth Hono Example",
    user: user || "Guest",
  });
});

app.get("/me", (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return c.json({ user });
});

export default app;
