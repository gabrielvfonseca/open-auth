import { z } from "zod";
import { emailSchema, usernameSchema } from "./schemas";

export const userSchema = z.object({
  id: z.string(),
  email: emailSchema,
  username: usernameSchema,
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export const updateUserRequestSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
});

export const changePasswordRequestSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export type User = z.infer<typeof userSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;
