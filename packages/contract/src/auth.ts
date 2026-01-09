import { z } from "zod";
import {
  emailSchema,
  passwordSchema,
  tokenSchema,
  usernameSchema,
} from "./schemas";

// Login
export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export const loginResponseSchema = z.object({
  sessionToken: tokenSchema,
  requiresTwoFactor: z.boolean(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
  }),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

// Register
export const registerRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
});

export const registerResponseSchema = z.object({
  userId: z.string(),
  requiresEmailVerification: z.boolean(),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

// Password Reset
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export const passwordResetConfirmSchema = z.object({
  token: tokenSchema,
  newPassword: passwordSchema,
});

export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirm = z.infer<typeof passwordResetConfirmSchema>;

// Two-Factor
export const twoFactorVerifySchema = z.object({
  code: z.string().length(6),
});

export type TwoFactorVerify = z.infer<typeof twoFactorVerifySchema>;
