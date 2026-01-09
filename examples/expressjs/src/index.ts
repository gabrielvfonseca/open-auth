import cookieParser from "cookie-parser";
import express from "express";
import { auth } from "open-auth";

const app = express();
const port = 3000;

app.use(cookieParser());

// Middleware to extend Request type locally
declare global {
  namespace Express {
    interface Request {
      user: any;
      session: any;
    }
  }
}

app.use(async (req, res, next) => {
  const sessionId = req.cookies[auth.session.cookieName];
  if (!sessionId) {
    req.user = null;
    req.session = null;
    return next();
  }

  const { session, user } = await auth.validateSessionToken(sessionId);
  if (session) {
    res.cookie(auth.session.cookieName, session.id, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expiresAt,
    });
    req.user = user;
    req.session = session;
  } else {
    res.clearCookie(auth.session.cookieName);
    req.user = null;
    req.session = null;
  }
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Open Auth Express Example",
    user: req.user || "Guest",
  });
});

app.get("/me", (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ user: req.user });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
