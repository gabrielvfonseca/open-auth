import "server-only";
import { z } from "zod";

/**
 * Email validation schema
 * Matches existing verifyEmailInput: /^.+@.+\..+$/ and length < 256
 */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .max(255, "Email too long")
  .email("Invalid email");

/**
 * Username validation schema
 * Matches existing verifyUsernameInput: length > 3 and < 32, trimmed
 */
export const usernameSchema = z
  .string()
  .min(4, "Username must be at least 4 characters")
  .max(31, "Username must be less than 32 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  )
  .refine(
    (val) => val.trim() === val,
    "Username cannot have leading or trailing spaces"
  );

/**
 * Password validation schema
 * Basic length validation (strength check done separately)
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(255, "Password too long");

/**
 * TOTP code validation schema (6 digits)
 */
export const totpCodeSchema = z
  .string()
  .length(6, "TOTP code must be 6 digits")
  .regex(/^\d{6}$/, "TOTP code must contain only digits");

/**
 * Recovery code validation schema
 */
export const recoveryCodeSchema = z
  .string()
  .min(1, "Recovery code is required");

/**
 * Turnstile token validation schema
 */
export const turnstileTokenSchema = z
  .string()
  .min(1, "Turnstile token is required")
  .optional();

/**
 * Risk session ID validation schema
 */
export const riskSessionIdSchema = z
  .string()
  .min(1, "Risk session ID is required")
  .optional();

/**
 * Email verification code schema
 */
export const emailVerificationCodeSchema = z
  .string()
  .min(1, "Verification code is required");

/**
 * Password reset token schema
 */
export const passwordResetTokenSchema = z
  .string()
  .min(1, "Reset token is required");

/**
 * TOTP key schema (base64 encoded, 20 bytes = 28 chars base64)
 */
export const totpKeySchema = z.string().length(28, "Invalid TOTP key format");

/**
 * TOTP device name schema
 */
export const totpDeviceNameSchema = z
  .string()
  .min(1, "Device name is required")
  .max(100, "Device name too long")
  .optional();

/**
 * Credential ID schema (for TOTP device selection)
 */
export const credentialIdSchema = z
  .string()
  .min(1, "Credential ID is required")
  .optional();

/**
 * Helper function to parse FormData with Zod schema
 */
export function parseFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): { success: true; data: T } | { success: false; error: string } {
  const data = Object.fromEntries(formData.entries());
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  // Return first error message
  const firstError = result.error.errors[0];
  return {
    success: false,
    error: firstError?.message || "Invalid input",
  };
}

/**
 * Sign-in form schema
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  remember_me: z.string().optional(),
  turnstile_token: turnstileTokenSchema,
  risk_session_id: riskSessionIdSchema,
});

/**
 * Sign-up form schema
 */
export const signUpSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});

/**
 * Forgot password form schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset password form schema
 */
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  token: passwordResetTokenSchema,
});

/**
 * Verify email form schema
 */
export const verifyEmailSchema = z.object({
  code: emailVerificationCodeSchema,
});

/**
 * Update username form schema
 */
export const updateUsernameSchema = z.object({
  username: usernameSchema,
});

/**
 * Update password form schema
 */
export const updatePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

/**
 * TOTP setup form schema
 */
export const totpSetupSchema = z.object({
  key: totpKeySchema,
  code: totpCodeSchema,
  name: totpDeviceNameSchema,
});

/**
 * TOTP verify form schema
 */
export const totpVerifySchema = z.object({
  code: totpCodeSchema,
  credentialId: credentialIdSchema,
});

/**
 * Magic link request form schema
 */
export const magicLinkRequestSchema = z.object({
  email: emailSchema,
});

/**
 * Recovery code form schema
 */
export const recoveryCodeSchemaForm = z.object({
  code: recoveryCodeSchema,
});

/**
 * Organization schema
 */
export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .max(255, "Organization name too long"),
});

/**
 * Role schema
 */
export const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(255, "Role name too long"),
  description: z.string().max(1000, "Description too long").optional(),
  permissionIds: z.array(z.string().uuid()).optional(),
});

/**
 * Permission schema
 */
export const permissionSchema = z.object({
  action: z.string().min(1, "Action is required").max(100, "Action too long"),
  resourceId: z.string().uuid(),
});

/**
 * Resource schema
 */
export const resourceSchema = z.object({
  name: z
    .string()
    .min(1, "Resource name is required")
    .max(255, "Resource name too long"),
  type: z
    .string()
    .min(1, "Resource type is required")
    .max(100, "Resource type too long"),
  attributes: z.record(z.unknown()).optional(),
});

/**
 * Team schema
 */
export const teamSchema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .max(255, "Team name too long"),
});

/**
 * Group schema
 */
export const groupSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .max(255, "Group name too long"),
});

/**
 * Policy schema
 */
export const policySchema = z.object({
  name: z
    .string()
    .min(1, "Policy name is required")
    .max(255, "Policy name too long"),
  description: z.string().max(1000, "Description too long").optional(),
  effect: z.enum(["allow", "deny"]),
  conditions: z.record(z.unknown()),
  resourceId: z.string().uuid(),
  roleIds: z.array(z.string().uuid()).optional(),
  userIds: z.array(z.string().uuid()).optional(),
});

/**
 * User attributes schema (ABAC)
 */
export const userAttributesSchema = z.record(z.unknown());

/**
 * OAuth application schema
 */
export const oauthApplicationSchema = z.object({
  name: z
    .string()
    .min(1, "Application name is required")
    .max(255, "Application name too long"),
  description: z
    .string()
    .max(1000, "Description too long")
    .optional()
    .nullable(),
  redirectUris: z
    .array(z.string().url("Invalid redirect URI"))
    .min(1, "At least one redirect URI is required"),
  scopes: z.array(z.string().min(1)).min(1, "At least one scope is required"),
});

/**
 * OAuth authorize request schema
 */
export const oauthAuthorizeSchema = z.object({
  client_id: z.string().min(1, "Client ID is required"),
  redirect_uri: z.string().url("Invalid redirect URI"),
  response_type: z.literal("code"),
  scope: z.string().optional(),
  state: z.string().optional(),
  code_challenge: z.string().optional(),
  code_challenge_method: z.enum(["plain", "S256"]).optional(),
});

/**
 * OAuth token request schema
 */
export const oauthTokenSchema = z.object({
  grant_type: z.enum([
    "authorization_code",
    "refresh_token",
    "client_credentials",
  ]),
  code: z.string().optional(),
  refresh_token: z.string().optional(),
  client_id: z.string().min(1, "Client ID is required"),
  client_secret: z.string().min(1, "Client secret is required"),
  redirect_uri: z.string().url("Invalid redirect URI").optional(),
  code_verifier: z.string().optional(),
});

/**
 * OAuth revoke token schema
 */
export const oauthRevokeSchema = z.object({
  token: z.string().min(1, "Token is required"),
  token_type_hint: z.enum(["access_token", "refresh_token"]).optional(),
});

/**
 * Webhook schema
 */
export const webhookSchema = z.object({
  url: z.string().url("Invalid webhook URL"),
  events: z.array(z.string().min(1)).min(1, "At least one event is required"),
  applicationId: z.string().optional().nullable(),
});
