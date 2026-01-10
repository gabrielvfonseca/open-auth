import { Elysia } from "elysia";
import { auth } from "./lib/auth";

const app = new Elysia()
  .derive(async ({ cookie: { session_id } }) => {
    const token = session_id.value;
    if (!token || typeof token !== "string") {
      return { user: null, session: null };
    }
    const { user, session } = await auth.validateSessionToken(token);
    if (!session) {
      return { user: null, session: null };
    }
    return { user, session };
  })
  .get("/", ({ user }) => ({
    message: "Welcome to Open Auth Elysia Example",
    user: user || "Guest",
  }))
  .get("/profile", ({ user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    return { user };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
