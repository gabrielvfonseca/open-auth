import type {
  Account,
  Device,
  EmailDomain,
  EmailVerification,
  FailedLoginAttempt,
  MagicLinkToken,
  OAuthApplication,
  OAuthAuthorization,
  OAuthAuthorizationCode,
  OAuthRefreshToken,
  OAuthToken,
  Organization,
  OrganizationMember,
  PasskeyCredential,
  PasswordHistory,
  PasswordResetSession,
  Permission,
  RecoveryCode,
  Role,
  SAMLProvider,
  SecurityKeyCredential,
  Session,
  TOTPCredential,
  User,
  WebAuthnChallenge,
  Webhook,
  WebhookDelivery,
} from "./index";

export interface DatabaseAdapter {
  // User
  getUserById(userId: string): Promise<User | null>;
  getUserFromEmail(email: string): Promise<User | null>;
  getUserFromUsername(username: string): Promise<User | null>;
  createUser(email: string, username: string): Promise<User>;
  updateUser(userId: string, data: Partial<User>): Promise<User>;
  deleteUser(userId: string): Promise<void>;

  // Account
  getAccountById(accountId: string): Promise<Account | null>;
  getAccountByProvider(
    providerId: string,
    provider: string
  ): Promise<Account | null>;
  getAccountsByUserId(userId: string): Promise<Account[]>;
  createAccount(
    data: Partial<Account> & { userId: string; type: string }
  ): Promise<Account>;
  updateAccount(accountId: string, data: Partial<Account>): Promise<Account>;
  deleteAccount(accountId: string): Promise<void>;

  // Session
  createSession(session: Session): Promise<void>;
  getSession(sessionId: string): Promise<Session | null>;
  getSessionsByUserId(userId: string): Promise<Session[]>;
  updateSession(sessionId: string, data: Partial<Session>): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
  deleteSessionsByUserId(userId: string): Promise<void>;

  // Password History
  getPasswordHistory(userId: string): Promise<PasswordHistory[]>;
  createPasswordHistory(data: {
    id: string;
    userId: string;
    passwordHash: string;
  }): Promise<void>;
  deletePasswordHistory(id: string): Promise<void>;
  deletePasswordHistoryByUserId(userId: string): Promise<void>;

  // Password Reset
  createPasswordResetSession(session: PasswordResetSession): Promise<void>;
  getPasswordResetSession(token: string): Promise<PasswordResetSession | null>; // token logic handled by adapter? Original passed 'id'. Assuming token maps to ID/token field. Original schema probably had `id` as token.
  // Actually original used `id` as token in URL probably? or session token column?
  // Original `passwordResetSession.findUnique({ where: { id: sessionId } })`
  // So `getPasswordResetSession` takes ID.
  getPasswordResetSessionById(
    sessionId: string
  ): Promise<PasswordResetSession | null>;
  updatePasswordResetSession(
    sessionId: string,
    data: Partial<PasswordResetSession>
  ): Promise<void>;
  deletePasswordResetSession(sessionId: string): Promise<void>;
  deletePasswordResetSessionsByUserId(userId: string): Promise<void>;

  // Device
  createDevice(data: Omit<Device, "createdAt">): Promise<Device>;
  getDevice(deviceId: string): Promise<Device | null>;
  getDeviceByFingerprint(
    userId: string,
    fingerprint: string
  ): Promise<Device | null>;
  getDevicesByUserId(userId: string): Promise<Device[]>;
  updateDevice(deviceId: string, data: Partial<Device>): Promise<Device>;
  deleteDevice(deviceId: string): Promise<void>;

  // Email Verification
  createEmailVerification(
    data: Omit<EmailVerification, "createdAt">
  ): Promise<EmailVerification>;
  getEmailVerification(
    userId: string,
    code: string
  ): Promise<EmailVerification | null>;
  deleteEmailVerification(id: string): Promise<void>;
  deleteEmailVerificationsByUserId(userId: string): Promise<void>;

  // Recovery Codes
  createRecoveryCode(
    data: Omit<RecoveryCode, "createdAt" | "usedAt">
  ): Promise<RecoveryCode>;
  getRecoveryCodes(userId: string): Promise<RecoveryCode[]>;
  getRecoveryCode(
    userId: string,
    codeHash: string
  ): Promise<RecoveryCode | null>;
  updateRecoveryCode(id: string, data: Partial<RecoveryCode>): Promise<void>;
  deleteRecoveryCodesByUserId(userId: string): Promise<void>;

  // TOTP
  createTOTPCredential(
    data: Omit<TOTPCredential, "createdAt" | "lastUsedAt">
  ): Promise<TOTPCredential>;
  getTOTPCredential(
    userId: string,
    credentialId: string
  ): Promise<TOTPCredential | null>;
  getTOTPCredentials(userId: string): Promise<TOTPCredential[]>;
  updateTOTPCredential(
    id: string,
    data: Partial<TOTPCredential>
  ): Promise<void>;
  deleteTOTPCredential(id: string, userId: string): Promise<void>;
  deleteTOTPCredentialsByUserId(userId: string): Promise<void>;

  // Passkey
  createPasskeyCredential(
    data: Omit<PasskeyCredential, "createdAt" | "lastUsedAt">
  ): Promise<PasskeyCredential>;
  getPasskeyCredential(
    userId: string,
    credentialId: Buffer | Uint8Array
  ): Promise<PasskeyCredential | null>;
  getPasskeyCredentials(userId: string): Promise<PasskeyCredential[]>;
  updatePasskeyCredential(
    id: Buffer | Uint8Array,
    data: Partial<PasskeyCredential>
  ): Promise<void>;
  deletePasskeyCredential(
    id: Buffer | Uint8Array,
    userId: string
  ): Promise<void>; // userId needed for safety?
  deletePasskeyCredentialsByUserId(userId: string): Promise<void>;

  // Security Key
  createSecurityKeyCredential(
    data: Omit<SecurityKeyCredential, "createdAt" | "lastUsedAt">
  ): Promise<SecurityKeyCredential>;
  getSecurityKeyCredential(
    userId: string,
    credentialId: Buffer | Uint8Array
  ): Promise<SecurityKeyCredential | null>;
  getSecurityKeyCredentials(userId: string): Promise<SecurityKeyCredential[]>;
  updateSecurityKeyCredential(
    id: Buffer | Uint8Array,
    data: Partial<SecurityKeyCredential>
  ): Promise<void>;
  deleteSecurityKeyCredential(
    id: Buffer | Uint8Array,
    userId: string
  ): Promise<void>;
  deleteSecurityKeyCredentialsByUserId(userId: string): Promise<void>;

  // WebAuthn Challenge
  createWebAuthnChallenge(data: WebAuthnChallenge): Promise<void>;
  getWebAuthnChallenge(challengeId: string): Promise<WebAuthnChallenge | null>;
  deleteWebAuthnChallenge(challengeId: string): Promise<void>;
  deleteExpiredWebAuthnChallenges(): Promise<number>;

  // OAuth Application
  createOAuthApplication(
    data: Omit<OAuthApplication, "id" | "createdAt" | "updatedAt">
  ): Promise<OAuthApplication>;
  getOAuthApplication(id: string): Promise<OAuthApplication | null>;
  getOAuthApplicationByClientId(
    clientId: string
  ): Promise<OAuthApplication | null>;
  getOAuthApplications(
    userId: string,
    organizationId: string
  ): Promise<OAuthApplication[]>;
  updateOAuthApplication(
    id: string,
    data: Partial<OAuthApplication>
  ): Promise<OAuthApplication>;
  deleteOAuthApplication(id: string): Promise<void>;

  // OAuth Authorization
  getOAuthAuthorization(
    userId: string,
    applicationId: string
  ): Promise<OAuthAuthorization | null>;
  createOAuthAuthorization(
    data: Omit<OAuthAuthorization, "id" | "createdAt" | "updatedAt">
  ): Promise<OAuthAuthorization>;
  updateOAuthAuthorization(
    id: string,
    data: Partial<OAuthAuthorization>
  ): Promise<OAuthAuthorization>;
  getOAuthAuthorizations(userId: string): Promise<OAuthAuthorization[]>;
  deleteOAuthAuthorization(id: string): Promise<void>;

  // OAuth Authorization Code
  createOAuthAuthorizationCode(
    data: Omit<OAuthAuthorizationCode, "id" | "createdAt" | "used" | "usedAt">
  ): Promise<OAuthAuthorizationCode>;
  getOAuthAuthorizationCode(
    code: string
  ): Promise<OAuthAuthorizationCode | null>;
  updateOAuthAuthorizationCode(
    id: string,
    data: Partial<OAuthAuthorizationCode>
  ): Promise<OAuthAuthorizationCode>;

  // OAuth Token
  createOAuthToken(
    data: Omit<OAuthToken, "id" | "createdAt" | "lastUsedAt">
  ): Promise<OAuthToken>;
  getOAuthToken(tokenHash: string): Promise<OAuthToken | null>;
  updateOAuthToken(id: string, data: Partial<OAuthToken>): Promise<OAuthToken>;
  deleteOAuthToken(id: string): Promise<void>; // Revoke = expire or delete?

  // OAuth Refresh Token
  createOAuthRefreshToken(
    data: Omit<OAuthRefreshToken, "id" | "createdAt" | "revoked" | "revokedAt">
  ): Promise<OAuthRefreshToken>;
  getOAuthRefreshToken(tokenHash: string): Promise<OAuthRefreshToken | null>;
  updateOAuthRefreshToken(
    id: string,
    data: Partial<OAuthRefreshToken>
  ): Promise<OAuthRefreshToken>;

  // SAML Provider
  getSAMLProviders(enabledOnly?: boolean): Promise<SAMLProvider[]>;
  getSAMLProviderById(id: string): Promise<SAMLProvider | null>;
  getSAMLProviderByEntityId(entityId: string): Promise<SAMLProvider | null>;
  createSAMLProvider(
    data: Omit<SAMLProvider, "id" | "createdAt" | "updatedAt">
  ): Promise<SAMLProvider>;
  updateSAMLProvider(
    id: string,
    data: Partial<SAMLProvider>
  ): Promise<SAMLProvider>;
  deleteSAMLProvider(id: string): Promise<void>;

  // Magic Link
  createMagicLinkToken(
    data: Omit<MagicLinkToken, "createdAt" | "used" | "usedAt">
  ): Promise<MagicLinkToken>;
  getMagicLinkToken(tokenHash: string): Promise<MagicLinkToken | null>; // by hash
  updateMagicLinkToken(
    id: string,
    data: Partial<MagicLinkToken>
  ): Promise<MagicLinkToken>;
  deleteExpiredMagicLinkTokens(): Promise<number>;

  // Failed Login Attempt
  createFailedLoginAttempt(
    data: Omit<FailedLoginAttempt, "createdAt">
  ): Promise<void>;
  countFailedLoginAttempts(
    userId: string | null,
    ipAddress: string | null,
    since: Date
  ): Promise<number>;

  // Email Domain
  getEmailDomain(domain: string): Promise<EmailDomain | null>;
  countEmailDomains(type: "allowlist" | "blocklist"): Promise<number>;
  upsertEmailDomain(
    domain: string,
    type: "allowlist" | "blocklist"
  ): Promise<void>;
  deleteEmailDomain(domain: string): Promise<void>;

  // Webhook
  createWebhook(
    data: Omit<Webhook, "id" | "createdAt" | "updatedAt" | "enabled">
  ): Promise<Webhook>;
  getWebhook(id: string): Promise<Webhook | null>;
  getWebhooksByOrganization(organizationId: string): Promise<Webhook[]>;
  getWebhooksByEvent(organizationId: string, event: string): Promise<Webhook[]>;
  updateWebhook(id: string, data: Partial<Webhook>): Promise<Webhook>;
  deleteWebhook(id: string): Promise<void>;

  // Webhook Delivery
  createWebhookDelivery(
    data: Omit<WebhookDelivery, "attemptedAt">
  ): Promise<WebhookDelivery>;
  getWebhookDeliveries(
    webhookId: string,
    limit?: number
  ): Promise<WebhookDelivery[]>;

  // RBAC & Organizations
  createOrganization(data: {
    name: string;
    slug: string;
  }): Promise<Organization>;
  getOrganization(id: string): Promise<Organization | null>;
  getOrganizationBySlug(slug: string): Promise<Organization | null>;
  updateOrganization(
    id: string,
    data: Partial<Organization>
  ): Promise<Organization>;
  deleteOrganization(id: string): Promise<void>;

  addOrganizationMember(data: {
    organizationId: string;
    userId: string;
    roleId?: string;
  }): Promise<OrganizationMember>;
  getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]>;
  removeOrganizationMember(
    organizationId: string,
    userId: string
  ): Promise<void>;

  createRole(data: {
    name: string;
    description?: string;
    organizationId?: string;
  }): Promise<Role>;
  getRoles(organizationId?: string): Promise<Role[]>;
  deleteRole(id: string): Promise<void>;

  assignRoleToMember(memberId: string, roleId: string): Promise<void>;

  createPermission(data: {
    name: string;
    description?: string;
  }): Promise<Permission>;
  getPermissions(): Promise<Permission[]>;
  attachPermissionToRole(roleId: string, permissionId: string): Promise<void>;
}
