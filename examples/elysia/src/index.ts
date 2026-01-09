import { Elysia } from "elysia";
import { auth } from "open-auth";

const app = new Elysia()
  .derive(async ({ cookie: { session_id } }) => {
    if (!session_id?.value) {
      return { user: null, session: null };
    }
    const { user, session } = await auth.validateSessionToken(session_id.value);
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
