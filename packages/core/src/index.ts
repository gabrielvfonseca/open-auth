export * from "./encryption";
export * from "./errors";
export * from "./logger";
export * from "./utils";
export * from "./validation";
export type AccountType =
  | "email_password"
  | "github"
  | "google"
  | "microsoft"
  | "apple"
  | "magic_link"
  | "saml";

export interface Account {
  id: string;
  userId: string;
  type: AccountType;
  providerId: string | null;
  email: string | null;
  emailVerified: boolean;
  createdAt: Date;
  lastUsedAt: Date | null;
  passwordHash?: string | null;
}

export interface User {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  registeredTOTP: boolean;
  registeredSecurityKey: boolean;
  registeredPasskey: boolean;
  registered2FA: boolean;
  recoveryCode?: Buffer | null;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  deleted?: boolean;
  deletedAt?: Date | null;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  twoFactorVerified: boolean;
  createdAt: Date;
  accountId?: string | null;
}

export interface PasswordHistory {
  id: string;
  userId: string;
  passwordHash: string;
  createdAt: Date;
}

export interface PasswordResetSession {
  id: string;
  userId: string;
  email: string;
  code: string;
  expiresAt: Date;
  emailVerified: boolean;
  twoFactorVerified: boolean;
}

export interface Device {
  id: string;
  userId: string;
  name: string;
  fingerprint: string;
  userAgent: string | null;
  ipAddress: string | null;
  trusted: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface EmailVerification {
  id: string;
  userId: string;
  email: string;
  code: string;
  expiresAt: Date;
}

export interface RecoveryCode {
  id: string;
  userId: string;
  codeHash: string;
  used: boolean;
  usedAt?: Date | null;
  createdAt?: Date;
}

export interface TOTPCredential {
  id: string;
  userId: string;
  key: Uint8Array | Buffer; // Encrypted
  name: string | null;
  issuer: string | null;
  createdAt: Date;
  lastUsedAt: Date | null;
}

export interface PasskeyCredential {
  id: Uint8Array | Buffer;
  userId: string;
  name: string;
  algorithm: number;
  publicKey: Uint8Array | Buffer;
  deviceType: string | null;
  userAgent: string | null;
  createdAt: Date;
  lastUsedAt: Date | null;
}

export interface SecurityKeyCredential {
  id: Uint8Array | Buffer;
  userId: string;
  name: string;
  algorithm: number;
  publicKey: Uint8Array | Buffer;
  createdAt: Date;
  lastUsedAt: Date | null;
}

export interface WebAuthnChallenge {
  id: string;
  userId?: string | null;
  email?: string | null;
  type: string; // 'registration' | 'authentication'
  expiresAt: Date;
}

export interface OAuthApplication {
  id: string;
  userId: string;
  organizationId: string;
  name: string;
  description: string | null;
  clientId: string;
  clientSecret: string; // Hashed
  redirectUris: string[];
  scopes: string[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OAuthAuthorization {
  id: string;
  userId: string;
  applicationId: string;
  scopes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OAuthAuthorizationCode {
  id: string;
  code: string;
  userId: string;
  applicationId: string;
  authorizationId: string;
  redirectUri: string;
  scopes: string[];
  codeChallenge: string | null;
  codeChallengeMethod: string | null;
  expiresAt: Date;
  used: boolean;
  usedAt: Date | null;
  createdAt: Date;
}

export interface OAuthToken {
  id: string;
  token: string;
  tokenHash: string;
  userId: string;
  applicationId: string;
  authorizationId: string;
  scopes: string[];
  expiresAt: Date;
  lastUsedAt: Date | null;
  createdAt: Date;
}

export interface OAuthRefreshToken {
  id: string;
  token: string;
  tokenHash: string;
  accessTokenId: string;
  userId: string;
  applicationId: string;
  expiresAt: Date | null;
  revoked: boolean;
  revokedAt: Date | null;
  createdAt: Date;
}

export interface SAMLProvider {
  id: string;
  name: string;
  entityId: string;
  ssoUrl: string;
  certificate: string;
  enabled: boolean;
  emailAttribute: string;
  firstNameAttribute: string;
  lastNameAttribute: string;
  usernameAttribute: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MagicLinkToken {
  id: string;
  userId: string | null;
  email: string;
  tokenHash: string;
  expiresAt: Date;
  used: boolean;
  usedAt: Date | null;
  createdAt: Date;
}

export interface FailedLoginAttempt {
  id: string;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface Webhook {
  id: string;
  userId: string;
  organizationId: string;
  applicationId: string | null;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: unknown;
  statusCode: number | null;
  success: boolean;
  error: string | null;
  attemptedAt: Date;
}

export interface EmailDomain {
  id: string;
  domain: string;
  type: "allowlist" | "blocklist";
  createdAt: Date;
  updatedAt: Date;
}

// RBAC & Organization Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  roleId: string | null;
  joinedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  organizationId: string | null;
  createdAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
}

export * from "./adapters";
export * from "./email";
export * from "./rate-limit";
