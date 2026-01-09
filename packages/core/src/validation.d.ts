import "server-only";
import { z } from "zod";
/**
 * Email validation schema
 * Matches existing verifyEmailInput: /^.+@.+\..+$/ and length < 256
 */
export declare const emailSchema: z.ZodString;
/**
 * Username validation schema
 * Matches existing verifyUsernameInput: length > 3 and < 32, trimmed
 */
export declare const usernameSchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * Password validation schema
 * Basic length validation (strength check done separately)
 */
export declare const passwordSchema: z.ZodString;
/**
 * TOTP code validation schema (6 digits)
 */
export declare const totpCodeSchema: z.ZodString;
/**
 * Recovery code validation schema
 */
export declare const recoveryCodeSchema: z.ZodString;
/**
 * Turnstile token validation schema
 */
export declare const turnstileTokenSchema: z.ZodOptional<z.ZodString>;
/**
 * Risk session ID validation schema
 */
export declare const riskSessionIdSchema: z.ZodOptional<z.ZodString>;
/**
 * Email verification code schema
 */
export declare const emailVerificationCodeSchema: z.ZodString;
/**
 * Password reset token schema
 */
export declare const passwordResetTokenSchema: z.ZodString;
/**
 * TOTP key schema (base64 encoded, 20 bytes = 28 chars base64)
 */
export declare const totpKeySchema: z.ZodString;
/**
 * TOTP device name schema
 */
export declare const totpDeviceNameSchema: z.ZodOptional<z.ZodString>;
/**
 * Credential ID schema (for TOTP device selection)
 */
export declare const credentialIdSchema: z.ZodOptional<z.ZodString>;
/**
 * Helper function to parse FormData with Zod schema
 */
export declare function parseFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
):
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };
/**
 * Sign-in form schema
 */
export declare const signInSchema: z.ZodObject<
  {
    email: z.ZodString;
    password: z.ZodString;
    remember_me: z.ZodOptional<z.ZodString>;
    turnstile_token: z.ZodOptional<z.ZodString>;
    risk_session_id: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    email: string;
    password: string;
    remember_me?: string | undefined;
    turnstile_token?: string | undefined;
    risk_session_id?: string | undefined;
  },
  {
    email: string;
    password: string;
    remember_me?: string | undefined;
    turnstile_token?: string | undefined;
    risk_session_id?: string | undefined;
  }
>;
/**
 * Sign-up form schema
 */
export declare const signUpSchema: z.ZodObject<
  {
    email: z.ZodString;
    username: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    email: string;
    password: string;
    username: string;
  },
  {
    email: string;
    password: string;
    username: string;
  }
>;
/**
 * Forgot password form schema
 */
export declare const forgotPasswordSchema: z.ZodObject<
  {
    email: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    email: string;
  },
  {
    email: string;
  }
>;
/**
 * Reset password form schema
 */
export declare const resetPasswordSchema: z.ZodObject<
  {
    password: z.ZodString;
    token: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    password: string;
    token: string;
  },
  {
    password: string;
    token: string;
  }
>;
/**
 * Verify email form schema
 */
export declare const verifyEmailSchema: z.ZodObject<
  {
    code: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    code: string;
  },
  {
    code: string;
  }
>;
/**
 * Update username form schema
 */
export declare const updateUsernameSchema: z.ZodObject<
  {
    username: z.ZodEffects<z.ZodString, string, string>;
  },
  "strip",
  z.ZodTypeAny,
  {
    username: string;
  },
  {
    username: string;
  }
>;
/**
 * Update password form schema
 */
export declare const updatePasswordSchema: z.ZodObject<
  {
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    currentPassword: string;
    newPassword: string;
  },
  {
    currentPassword: string;
    newPassword: string;
  }
>;
/**
 * TOTP setup form schema
 */
export declare const totpSetupSchema: z.ZodObject<
  {
    key: z.ZodString;
    code: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    code: string;
    key: string;
    name?: string | undefined;
  },
  {
    code: string;
    key: string;
    name?: string | undefined;
  }
>;
/**
 * TOTP verify form schema
 */
export declare const totpVerifySchema: z.ZodObject<
  {
    code: z.ZodString;
    credentialId: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    code: string;
    credentialId?: string | undefined;
  },
  {
    code: string;
    credentialId?: string | undefined;
  }
>;
/**
 * Magic link request form schema
 */
export declare const magicLinkRequestSchema: z.ZodObject<
  {
    email: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    email: string;
  },
  {
    email: string;
  }
>;
/**
 * Recovery code form schema
 */
export declare const recoveryCodeSchemaForm: z.ZodObject<
  {
    code: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    code: string;
  },
  {
    code: string;
  }
>;
/**
 * Organization schema
 */
export declare const organizationSchema: z.ZodObject<
  {
    name: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    name: string;
  },
  {
    name: string;
  }
>;
/**
 * Role schema
 */
export declare const roleSchema: z.ZodObject<
  {
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    permissionIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name: string;
    description?: string | undefined;
    permissionIds?: string[] | undefined;
  },
  {
    name: string;
    description?: string | undefined;
    permissionIds?: string[] | undefined;
  }
>;
/**
 * Permission schema
 */
export declare const permissionSchema: z.ZodObject<
  {
    action: z.ZodString;
    resourceId: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    action: string;
    resourceId: string;
  },
  {
    action: string;
    resourceId: string;
  }
>;
/**
 * Resource schema
 */
export declare const resourceSchema: z.ZodObject<
  {
    name: z.ZodString;
    type: z.ZodString;
    attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    type: string;
    name: string;
    attributes?: Record<string, unknown> | undefined;
  },
  {
    type: string;
    name: string;
    attributes?: Record<string, unknown> | undefined;
  }
>;
/**
 * Team schema
 */
export declare const teamSchema: z.ZodObject<
  {
    name: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    name: string;
  },
  {
    name: string;
  }
>;
/**
 * Group schema
 */
export declare const groupSchema: z.ZodObject<
  {
    name: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    name: string;
  },
  {
    name: string;
  }
>;
/**
 * Policy schema
 */
export declare const policySchema: z.ZodObject<
  {
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    effect: z.ZodEnum<["allow", "deny"]>;
    conditions: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    resourceId: z.ZodString;
    roleIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    userIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name: string;
    resourceId: string;
    effect: "allow" | "deny";
    conditions: Record<string, unknown>;
    description?: string | undefined;
    roleIds?: string[] | undefined;
    userIds?: string[] | undefined;
  },
  {
    name: string;
    resourceId: string;
    effect: "allow" | "deny";
    conditions: Record<string, unknown>;
    description?: string | undefined;
    roleIds?: string[] | undefined;
    userIds?: string[] | undefined;
  }
>;
/**
 * User attributes schema (ABAC)
 */
export declare const userAttributesSchema: z.ZodRecord<
  z.ZodString,
  z.ZodUnknown
>;
/**
 * OAuth application schema
 */
export declare const oauthApplicationSchema: z.ZodObject<
  {
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    redirectUris: z.ZodArray<z.ZodString, "many">;
    scopes: z.ZodArray<z.ZodString, "many">;
  },
  "strip",
  z.ZodTypeAny,
  {
    name: string;
    redirectUris: string[];
    scopes: string[];
    description?: string | null | undefined;
  },
  {
    name: string;
    redirectUris: string[];
    scopes: string[];
    description?: string | null | undefined;
  }
>;
/**
 * OAuth authorize request schema
 */
export declare const oauthAuthorizeSchema: z.ZodObject<
  {
    client_id: z.ZodString;
    redirect_uri: z.ZodString;
    response_type: z.ZodLiteral<"code">;
    scope: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    code_challenge: z.ZodOptional<z.ZodString>;
    code_challenge_method: z.ZodOptional<z.ZodEnum<["plain", "S256"]>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    client_id: string;
    redirect_uri: string;
    response_type: "code";
    scope?: string | undefined;
    state?: string | undefined;
    code_challenge?: string | undefined;
    code_challenge_method?: "plain" | "S256" | undefined;
  },
  {
    client_id: string;
    redirect_uri: string;
    response_type: "code";
    scope?: string | undefined;
    state?: string | undefined;
    code_challenge?: string | undefined;
    code_challenge_method?: "plain" | "S256" | undefined;
  }
>;
/**
 * OAuth token request schema
 */
export declare const oauthTokenSchema: z.ZodObject<
  {
    grant_type: z.ZodEnum<
      ["authorization_code", "refresh_token", "client_credentials"]
    >;
    code: z.ZodOptional<z.ZodString>;
    refresh_token: z.ZodOptional<z.ZodString>;
    client_id: z.ZodString;
    client_secret: z.ZodString;
    redirect_uri: z.ZodOptional<z.ZodString>;
    code_verifier: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    client_id: string;
    grant_type: "authorization_code" | "refresh_token" | "client_credentials";
    client_secret: string;
    code?: string | undefined;
    redirect_uri?: string | undefined;
    refresh_token?: string | undefined;
    code_verifier?: string | undefined;
  },
  {
    client_id: string;
    grant_type: "authorization_code" | "refresh_token" | "client_credentials";
    client_secret: string;
    code?: string | undefined;
    redirect_uri?: string | undefined;
    refresh_token?: string | undefined;
    code_verifier?: string | undefined;
  }
>;
/**
 * OAuth revoke token schema
 */
export declare const oauthRevokeSchema: z.ZodObject<
  {
    token: z.ZodString;
    token_type_hint: z.ZodOptional<
      z.ZodEnum<["access_token", "refresh_token"]>
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    token: string;
    token_type_hint?: "refresh_token" | "access_token" | undefined;
  },
  {
    token: string;
    token_type_hint?: "refresh_token" | "access_token" | undefined;
  }
>;
/**
 * Webhook schema
 */
export declare const webhookSchema: z.ZodObject<
  {
    url: z.ZodString;
    events: z.ZodArray<z.ZodString, "many">;
    applicationId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    url: string;
    events: string[];
    applicationId?: string | null | undefined;
  },
  {
    url: string;
    events: string[];
    applicationId?: string | null | undefined;
  }
>;
