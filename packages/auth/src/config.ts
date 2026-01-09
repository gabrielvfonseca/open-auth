import type { DatabaseAdapter, User } from "@open-auth/core";
import type { Session } from "@open-auth/session";

// ====================
// Session Configuration
// ====================
export interface SessionConfig {
  /** Session duration in seconds. Default: 30 days */
  expiresIn?: number;
  /** Time in seconds before session is considered "stale" and requires refresh. Default: 24 hours */
  freshAge?: number;
  /** Cookie name for session token. Default: "session_token" */
  cookieName?: string;
  /** How often to update session's lastActiveAt in seconds. Default: 1 hour */
  updateAge?: number;
  /** Whether to use secure cookies. Default: true in production */
  secure?: boolean;
  /** Cookie domain. Default: auto-detected */
  domain?: string;
  /** Cookie path. Default: "/" */
  path?: string;
  /** SameSite cookie attribute. Default: "lax" */
  sameSite?: "strict" | "lax" | "none";
}

// ====================
// Password Configuration
// ====================
export interface PasswordConfig {
  /** Minimum password length. Default: 8 */
  minLength?: number;
  /** Maximum password length. Default: 128 */
  maxLength?: number;
  /** Require at least one number. Default: true */
  requireNumbers?: boolean;
  /** Require at least one symbol. Default: false */
  requireSymbols?: boolean;
  /** Require at least one uppercase letter. Default: true */
  requireUppercase?: boolean;
  /** Require at least one lowercase letter. Default: true */
  requireLowercase?: boolean;
  /** Number of previous passwords to check against. Default: 5 */
  historyCount?: number;
  /** Password reset token expiry in seconds. Default: 1 hour */
  resetTokenExpiresIn?: number;
  /** Bcrypt cost factor. Default: 10 */
  hashCost?: number;
}

// ====================
// MFA Configuration
// ====================
export interface TotpConfig {
  /** TOTP issuer name shown in authenticator apps */
  issuer?: string;
  /** Algorithm for TOTP. Default: "SHA1" */
  algorithm?: "SHA1" | "SHA256" | "SHA512";
  /** Number of digits in TOTP code. Default: 6 */
  digits?: 6 | 8;
  /** TOTP period in seconds. Default: 30 */
  period?: number;
}

export interface RecoveryCodesConfig {
  /** Number of recovery codes to generate. Default: 10 */
  count?: number;
  /** Length of each recovery code. Default: 8 */
  length?: number;
}

export interface MfaConfig {
  /** Enable MFA features. Default: true */
  enabled?: boolean;
  /** TOTP configuration */
  totp?: TotpConfig;
  /** Recovery codes configuration */
  recoveryCodes?: RecoveryCodesConfig;
  /** Allow users to skip MFA setup. Default: true */
  allowSkip?: boolean;
  /** Require MFA for all users. Default: false */
  required?: boolean;
}

// ====================
// Guardian (Security) Configuration
// ====================
export interface LockoutConfig {
  /** Maximum failed login attempts before lockout. Default: 5 */
  maxAttempts?: number;
  /** Lockout duration in seconds. Default: 15 minutes */
  lockoutDuration?: number;
  /** Time window for counting attempts in seconds. Default: 15 minutes */
  attemptWindow?: number;
  /** Reset attempts after successful login. Default: true */
  resetOnSuccess?: boolean;
}

export interface RiskConfig {
  /** Enable risk-based authentication. Default: false */
  enabled?: boolean;
  /** Block logins from suspicious IPs. Default: false */
  blockSuspiciousIPs?: boolean;
  /** Require additional verification for new devices. Default: true */
  verifyNewDevices?: boolean;
  /** Notify user on new device login. Default: true */
  notifyNewDevice?: boolean;
}

export interface TurnstileConfig {
  /** Enable Cloudflare Turnstile. Default: false */
  enabled?: boolean;
  /** Turnstile site key */
  siteKey?: string;
  /** Turnstile secret key */
  secretKey?: string;
}

export interface EmailFilterConfig {
  /** Allowed email domains (whitelist) */
  allowlist?: string[];
  /** Blocked email domains (blacklist) */
  blocklist?: string[];
  /** Block disposable email domains. Default: true */
  blockDisposable?: boolean;
}

export interface GuardianConfig {
  /** Account lockout settings */
  lockout?: LockoutConfig;
  /** Risk-based authentication settings */
  risk?: RiskConfig;
  /** Cloudflare Turnstile settings */
  turnstile?: TurnstileConfig;
  /** Email domain filtering */
  emailFilter?: EmailFilterConfig;
  /** Enable rate limiting. Default: true */
  rateLimit?: boolean;
}

// ====================
// Email Configuration
// ====================
export interface EmailVerificationConfig {
  /** Enable email verification. Default: true */
  enabled?: boolean;
  /** Verification code/link expiry in seconds. Default: 24 hours */
  expiresIn?: number;
  /** Verification method. Default: "code" */
  method?: "code" | "link";
  /** Code length if using code method. Default: 6 */
  codeLength?: number;
}

export interface EmailConfig {
  /** Default "from" address */
  from?: string;
  /** Reply-to address */
  replyTo?: string;
  /** Email verification settings */
  verification?: EmailVerificationConfig;
  /** Send welcome email on signup. Default: true */
  sendWelcomeEmail?: boolean;
}

// ====================
// OAuth Configuration
// ====================
export interface OAuthProviderConfig {
  /** OAuth client ID */
  clientId: string;
  /** OAuth client secret */
  clientSecret: string;
  /** Additional scopes to request */
  scopes?: string[];
  /** Custom authorization URL */
  authorizationUrl?: string;
  /** Custom token URL */
  tokenUrl?: string;
}

export interface OAuthConfig {
  /** Enable OAuth features. Default: false */
  enabled?: boolean;
  /** OAuth providers configuration */
  providers?: {
    google?: OAuthProviderConfig;
    github?: OAuthProviderConfig;
    microsoft?: OAuthProviderConfig;
    apple?: OAuthProviderConfig;
    discord?: OAuthProviderConfig;
    slack?: OAuthProviderConfig;
    [key: string]: OAuthProviderConfig | undefined;
  };
  /** Default redirect URI after OAuth */
  redirectUri?: string;
  /** Allow account linking. Default: true */
  allowLinking?: boolean;
}

// ====================
// SSO Configuration
// ====================
export interface SamlConfig {
  /** Enable SAML SSO. Default: false */
  enabled?: boolean;
  /** Service Provider entity ID */
  entityId?: string;
  /** Assertion Consumer Service URL */
  acsUrl?: string;
  /** Default IdP configurations */
  idps?: {
    [name: string]: {
      entityId: string;
      ssoUrl: string;
      certificate: string;
    };
  };
}

export interface SsoConfig {
  /** SAML configuration */
  saml?: SamlConfig;
}

// ====================
// Passkey Configuration
// ====================
export interface PasskeyConfig {
  /** Enable passkey/WebAuthn. Default: true */
  enabled?: boolean;
  /** Relying Party name */
  rpName?: string;
  /** Relying Party ID (usually your domain) */
  rpId?: string;
  /** Allowed origins for WebAuthn */
  origin?: string | string[];
  /** User verification requirement. Default: "preferred" */
  userVerification?: "required" | "preferred" | "discouraged";
  /** Authenticator attachment. Default: unspecified */
  authenticatorAttachment?: "platform" | "cross-platform";
  /** Attestation conveyance. Default: "none" */
  attestation?: "none" | "indirect" | "direct" | "enterprise";
  /** Challenge timeout in milliseconds. Default: 60000 */
  timeout?: number;
}

// ====================
// Magic Link Configuration
// ====================
export interface MagicLinkConfig {
  /** Enable magic link authentication. Default: false */
  enabled?: boolean;
  /** Magic link expiry in seconds. Default: 15 minutes */
  expiresIn?: number;
  /** Maximum uses per token. Default: 1 */
  maxUses?: number;
}

// ====================
// Webhook Configuration
// ====================
export interface WebhookConfig {
  /** Enable webhooks. Default: false */
  enabled?: boolean;
  /** Signing secret for webhook payloads */
  secret?: string;
  /** Retry failed deliveries. Default: true */
  retryOnFailure?: boolean;
  /** Maximum retry attempts. Default: 3 */
  maxRetries?: number;
}

// ====================
// Device Configuration
// ====================
export interface DeviceConfig {
  /** Enable device tracking. Default: true */
  enabled?: boolean;
  /** Trust devices after verification. Default: true */
  trustAfterVerification?: boolean;
  /** Maximum trusted devices per user. Default: 10 */
  maxTrustedDevices?: number;
}

// ====================
// Audit Configuration
// ====================
export interface AuditConfig {
  /** Enable audit logging. Default: true */
  enabled?: boolean;
  /** Events to log. Default: all */
  events?: (
    | "signin"
    | "signout"
    | "signup"
    | "password_change"
    | "mfa_change"
    | "account_delete"
  )[];
  /** Log IP addresses. Default: true */
  logIpAddress?: boolean;
  /** Log user agents. Default: true */
  logUserAgent?: boolean;
}

// ====================
// Plugin Interface
// ====================
export interface AuthPlugin<TAuth = unknown> {
  /** Unique plugin name */
  name: string;
  /** Initialize plugin with auth instance */
  init?: (auth: TAuth) => void | Promise<void>;
  /** Hook: Called after user signs up */
  onSignUp?: (user: User) => void | Promise<void>;
  /** Hook: Called after user signs in */
  onSignIn?: (session: Session, user: User) => void | Promise<void>;
  /** Hook: Called after user signs out */
  onSignOut?: (session: Session) => void | Promise<void>;
  /** Hook: Called when password is changed */
  onPasswordChange?: (user: User) => void | Promise<void>;
  /** Hook: Called when MFA is enabled/disabled */
  onMfaChange?: (user: User, enabled: boolean) => void | Promise<void>;
  /** Hook: Called before account deletion */
  onAccountDelete?: (user: User) => void | Promise<void>;
}

// ====================
// Main Auth Configuration
// ====================
export interface AuthConfig {
  /** Database adapter (required) */
  database: DatabaseAdapter;

  /** Base URL of your application */
  baseUrl?: string;

  /** Secret key for signing tokens */
  secret?: string;

  /** Session configuration */
  session?: SessionConfig;

  /** Password configuration */
  password?: PasswordConfig;

  /** Multi-factor authentication configuration */
  mfa?: MfaConfig;

  /** Security and protection configuration */
  guardian?: GuardianConfig;

  /** Email configuration */
  email?: EmailConfig;

  /** OAuth providers configuration */
  oauth?: OAuthConfig;

  /** SSO configuration */
  sso?: SsoConfig;

  /** Passkey/WebAuthn configuration */
  passkey?: PasskeyConfig;

  /** Magic link configuration */
  magicLink?: MagicLinkConfig;

  /** Webhook configuration */
  webhook?: WebhookConfig;

  /** Device tracking configuration */
  device?: DeviceConfig;

  /** Audit logging configuration */
  audit?: AuditConfig;

  /** Plugins to extend functionality */
  plugins?: AuthPlugin[];

  /** Enable debug mode. Default: false */
  debug?: boolean;
}
