import { z } from "zod";

export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  deviceName: z.string().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  lastActiveAt: z.date(),
  expiresAt: z.date(),
  isCurrent: z.boolean().optional(),
});

export const listSessionsResponseSchema = z.object({
  sessions: z.array(sessionSchema),
});

export const revokeSessionRequestSchema = z.object({
  sessionId: z.string(),
});

export type Session = z.infer<typeof sessionSchema>;
export type ListSessionsResponse = z.infer<typeof listSessionsResponseSchema>;
export type RevokeSessionRequest = z.infer<typeof revokeSessionRequestSchema>;
