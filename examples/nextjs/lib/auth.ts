import { createPrismaAdapter } from "@open-auth/adapter-prisma";
import { createAuthClient } from "open-auth";
import { prisma } from "./prisma";

export const auth = createAuthClient({
  database: createPrismaAdapter(prisma),
  session: {
    cookieName: "open_auth_session",
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
});
