import type {
  Account,
  DatabaseAdapter,
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
} from "@open-auth/core";

/**
 * Drizzle ORM Adapter for Open Auth
 */
export interface DrizzleAdapterOptions {
  db: any; // DrizzleClient
  schema: any; // All tables
}

export function createDrizzleAdapter(
  options: DrizzleAdapterOptions
): DatabaseAdapter {
  const { db, schema } = options;

  return {
    // User
    async createUser(_email: string, _username: string): Promise<User> {
      throw new Error("Not implemented");
    },
    async getUserById(_userId: string): Promise<User | null> {
      throw new Error("Not implemented");
    },
    async getUserFromEmail(_email: string): Promise<User | null> {
      throw new Error("Not implemented");
    },
    async getUserFromUsername(_username: string): Promise<User | null> {
      throw new Error("Not implemented");
    },
    async updateUser(_userId: string, _data: Partial<User>): Promise<User> {
      throw new Error("Not implemented");
    },
    async deleteUser(_userId: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // Account
    async createAccount(_data: any): Promise<Account> {
      throw new Error("Not implemented");
    },
    async getAccountById(_accountId: string): Promise<Account | null> {
      throw new Error("Not implemented");
    },
    async getAccountByProvider(
      _providerId: string,
      _provider: string
    ): Promise<Account | null> {
      throw new Error("Not implemented");
    },
    async getAccountsByUserId(_userId: string): Promise<Account[]> {
      throw new Error("Not implemented");
    },
    async updateAccount(
      _accountId: string,
      _data: Partial<Account>
    ): Promise<Account> {
      throw new Error("Not implemented");
    },
    async deleteAccount(_accountId: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // Session
    async createSession(_session: Session): Promise<void> {
      throw new Error("Not implemented");
    },
    async getSession(_sessionId: string): Promise<Session | null> {
      throw new Error("Not implemented");
    },
    async getSessionsByUserId(_userId: string): Promise<Session[]> {
      throw new Error("Not implemented");
    },
    async updateSession(
      _sessionId: string,
      _data: Partial<Session>
    ): Promise<void> {
      throw new Error("Not implemented");
    },
    async deleteSession(_sessionId: string): Promise<void> {
      throw new Error("Not implemented");
    },
    async deleteSessionsByUserId(_userId: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // Password History
    async getPasswordHistory(_userId: string): Promise<PasswordHistory[]> {
      throw new Error("Not implemented");
    },
    async createPasswordHistory(_data: any): Promise<void> {
      throw new Error("Not implemented");
    },
    async deletePasswordHistory(_id: string): Promise<void> {
      throw new Error("Not implemented");
    },
    async deletePasswordHistoryByUserId(_userId: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // Password Reset
    async createPasswordResetSession(
      _session: PasswordResetSession
    ): Promise<void> {
      throw new Error("Not implemented");
    },
    async getPasswordResetSession(
      _token: string
    ): Promise<PasswordResetSession | null> {
      throw new Error("Not implemented");
    },
    async getPasswordResetSessionById(
      _sessionId: string
    ): Promise<PasswordResetSession | null> {
      throw new Error("Not implemented");
    },
    async updatePasswordResetSession(
      _sessionId: string,
      _data: Partial<PasswordResetSession>
    ): Promise<void> {
      throw new Error("Not implemented");
    },
    async deletePasswordResetSession(_sessionId: string): Promise<void> {
      throw new Error("Not implemented");
    },
    async deletePasswordResetSessionsByUserId(_userId: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // Device
    async createDevice(_data: Omit<Device, "createdAt">): Promise<Device> {
      throw new Error("Not implemented");
    },
    async getDevice(_deviceId: string): Promise<Device | null> {
      throw new Error("Not implemented");
    },
    async getDeviceByFingerprint(
      _userId: string,
      _fingerprint: string
    ): Promise<Device | null> {
      throw new Error("Not implemented");
    },
    async getDevicesByUserId(_userId: string): Promise<Device[]> {
      throw new Error("Not implemented");
    },
    async updateDevice(
      _deviceId: string,
      _data: Partial<Device>
    ): Promise<Device> {
      throw new Error("Not implemented");
    },
    async deleteDevice(_deviceId: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // Email Verification
    async createEmailVerification(
      _data: Omit<EmailVerification, "createdAt">
    ): Promise<EmailVerification> {
      throw new Error("Not implemented");
    },
    async getEmailVerification(
      _userId: string,
      _code: string
    ): Promise<EmailVerification | null> {
      throw new Error("Not implemented");
    },
    async deleteEmailVerification(_id: string): Promise<void> {
      throw new Error("Not implemented");
    },
    async deleteEmailVerificationsByUserId(_userId: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // Recovery Codes
    async createRecoveryCode(
      _data: Omit<RecoveryCode, "createdAt" | "usedAt">
    ): Promise<RecoveryCode> {
      throw new Error("Not implemented");
    },
    async getRecoveryCodes(_userId: string): Promise<RecoveryCode[]> {
      throw new Error("Not implemented");
    },
    async getRecoveryCode(
      _userId: string,
      _codeHash: string
    ): Promise<RecoveryCode | null> {
      throw new Error("Not implemented");
    },
    async updateRecoveryCode(
      _id: string,
      _data: Partial<RecoveryCode>
    ): Promise<void> {
      throw new Error("Not implemented");
    },
    async deleteRecoveryCodesByUserId(_userId: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // TOTP
    async createTOTPCredential(
      _data: Omit<TOTPCredential, "createdAt" | "lastUsedAt">
    ): Promise<TOTPCredential> {
      throw new Error("Not implemented");
    },
    async getTOTPCredential(_userId: string): Promise<TOTPCredential | null> {
      throw new Error("Not implemented");
    },
    async getTOTPCredentials(_userId: string): Promise<TOTPCredential[]> {
      throw new Error("Not implemented");
    },
    async updateTOTPCredential(
      _id: string,
      _data: Partial<TOTPCredential>
    ): Promise<void> {
      throw new Error("Not implemented");
    },
    async deleteTOTPCredential(_id: string): Promise<void> {
      throw new Error("Not implemented");
    },
    async deleteTOTPCredentialsByUserId(_userId: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // Passkey
    async createPasskeyCredential(
      _data: Omit<PasskeyCredential, "createdAt" | "lastUsedAt">
    ): Promise<PasskeyCredential> {
      throw new Error("Not implemented");
    },
    async getPasskeyCredential(
      _userId: string,
      _credentialId: Buffer
    ): Promise<PasskeyCredential | null> {
      throw new Error("Not implemented");
    },
    async getPasskeyCredentials(_userId: string): Promise<PasskeyCredential[]> {
      throw new Error("Not implemented");
    },
    async updatePasskeyCredential(
      _id: Buffer,
      _data: Partial<PasskeyCredential>
    ): Promise<void> {
      throw new Error("Not implemented");
    },
    async deletePasskeyCredential(_id: Buffer, _userId: string): Promise<void> {
      throw new Error("Not implemented");
    },
    async deletePasskeyCredentialsByUserId(_userId: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // Security Key
    async createSecurityKeyCredential(
      _data: Omit<SecurityKeyCredential, "createdAt" | "lastUsedAt">
    ): Promise<SecurityKeyCredential> {
      throw new Error("Not implemented");
    },
    async getSecurityKeyCredential(
      _userId: string,
      _credentialId: Buffer
    ): Promise<SecurityKeyCredential | null> {
      throw new Error("Not implemented");
    },
    async getSecurityKeyCredentials(
      _userId: string
    ): Promise<SecurityKeyCredential[]> {
      throw new Error("Not implemented");
    },
    async updateSecurityKeyCredential(
      _id: Buffer,
      _data: Partial<SecurityKeyCredential>
    ): Promise<void> {
      throw new Error("Not implemented");
    },
    async deleteSecurityKeyCredential(
      _id: Buffer,
      _userId: string
    ): Promise<void> {
      throw new Error("Not implemented");
    },
    async deleteSecurityKeyCredentialsByUserId(_userId: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // WebAuthn Challenge
    async createWebAuthnChallenge(_data: WebAuthnChallenge): Promise<void> {
      throw new Error("Not implemented");
    },
    async getWebAuthnChallenge(
      _challengeId: string
    ): Promise<WebAuthnChallenge | null> {
      throw new Error("Not implemented");
    },
    async deleteWebAuthnChallenge(_challengeId: string): Promise<void> {
      throw new Error("Not implemented");
    },
    async deleteExpiredWebAuthnChallenges(): Promise<number> {
      throw new Error("Not implemented");
    },

    // OAuth
    async createOAuthApplication(
      _data: Omit<OAuthApplication, "id" | "createdAt" | "updatedAt">
    ): Promise<OAuthApplication> {
      throw new Error("Not implemented");
    },
    async getOAuthApplication(_id: string): Promise<OAuthApplication | null> {
      throw new Error("Not implemented");
    },
    async getOAuthApplicationByClientId(
      _clientId: string
    ): Promise<OAuthApplication | null> {
      throw new Error("Not implemented");
    },
    async getOAuthApplications(
      _userId: string,
      _organizationId: string
    ): Promise<OAuthApplication[]> {
      throw new Error("Not implemented");
    },
    async updateOAuthApplication(
      _id: string,
      _data: Partial<OAuthApplication>
    ): Promise<OAuthApplication> {
      throw new Error("Not implemented");
    },
    async deleteOAuthApplication(_id: string): Promise<void> {
      throw new Error("Not implemented");
    },

    async getOAuthAuthorization(
      _userId: string,
      _applicationId: string
    ): Promise<OAuthAuthorization | null> {
      throw new Error("Not implemented");
    },
    async createOAuthAuthorization(
      _data: Omit<OAuthAuthorization, "id" | "createdAt" | "updatedAt">
    ): Promise<OAuthAuthorization> {
      throw new Error("Not implemented");
    },
    async updateOAuthAuthorization(
      _id: string,
      _data: Partial<OAuthAuthorization>
    ): Promise<OAuthAuthorization> {
      throw new Error("Not implemented");
    },
    async getOAuthAuthorizations(
      _userId: string
    ): Promise<OAuthAuthorization[]> {
      throw new Error("Not implemented");
    },
    async deleteOAuthAuthorization(_id: string): Promise<void> {
      throw new Error("Not implemented");
    },

    async createOAuthAuthorizationCode(
      _data: Omit<
        OAuthAuthorizationCode,
        "id" | "createdAt" | "used" | "usedAt"
      >
    ): Promise<OAuthAuthorizationCode> {
      throw new Error("Not implemented");
    },
    async getOAuthAuthorizationCode(
      _code: string
    ): Promise<OAuthAuthorizationCode | null> {
      throw new Error("Not implemented");
    },
    async updateOAuthAuthorizationCode(
      _id: string,
      _data: Partial<OAuthAuthorizationCode>
    ): Promise<OAuthAuthorizationCode> {
      throw new Error("Not implemented");
    },

    async createOAuthToken(
      _data: Omit<OAuthToken, "id" | "createdAt" | "lastUsedAt">
    ): Promise<OAuthToken> {
      throw new Error("Not implemented");
    },
    async getOAuthToken(_tokenHash: string): Promise<OAuthToken | null> {
      throw new Error("Not implemented");
    },
    async updateOAuthToken(
      _id: string,
      _data: Partial<OAuthToken>
    ): Promise<OAuthToken> {
      throw new Error("Not implemented");
    },
    async deleteOAuthToken(_id: string): Promise<void> {
      throw new Error("Not implemented");
    },

    async createOAuthRefreshToken(
      _data: Omit<
        OAuthRefreshToken,
        "id" | "createdAt" | "revoked" | "revokedAt"
      >
    ): Promise<OAuthRefreshToken> {
      throw new Error("Not implemented");
    },
    async getOAuthRefreshToken(
      _tokenHash: string
    ): Promise<OAuthRefreshToken | null> {
      throw new Error("Not implemented");
    },
    async updateOAuthRefreshToken(
      _id: string,
      _data: Partial<OAuthRefreshToken>
    ): Promise<OAuthRefreshToken> {
      throw new Error("Not implemented");
    },

    // SAML
    async getSAMLProviders(_enabledOnly?: boolean): Promise<SAMLProvider[]> {
      throw new Error("Not implemented");
    },
    async getSAMLProviderById(_id: string): Promise<SAMLProvider | null> {
      throw new Error("Not implemented");
    },
    async getSAMLProviderByEntityId(
      _entityId: string
    ): Promise<SAMLProvider | null> {
      throw new Error("Not implemented");
    },
    async createSAMLProvider(
      _data: Omit<SAMLProvider, "id" | "createdAt" | "updatedAt">
    ): Promise<SAMLProvider> {
      throw new Error("Not implemented");
    },
    async updateSAMLProvider(
      _id: string,
      _data: Partial<SAMLProvider>
    ): Promise<SAMLProvider> {
      throw new Error("Not implemented");
    },
    async deleteSAMLProvider(_id: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // Magic Link
    async createMagicLinkToken(
      _data: Omit<MagicLinkToken, "createdAt" | "used" | "usedAt">
    ): Promise<MagicLinkToken> {
      throw new Error("Not implemented");
    },
    async getMagicLinkToken(
      _tokenHash: string
    ): Promise<MagicLinkToken | null> {
      throw new Error("Not implemented");
    },
    async updateMagicLinkToken(
      _id: string,
      _data: Partial<MagicLinkToken>
    ): Promise<MagicLinkToken> {
      throw new Error("Not implemented");
    },
    async deleteExpiredMagicLinkTokens(): Promise<number> {
      throw new Error("Not implemented");
    },

    // Failed Login
    async createFailedLoginAttempt(
      _data: Omit<FailedLoginAttempt, "createdAt">
    ): Promise<void> {
      throw new Error("Not implemented");
    },
    async countFailedLoginAttempts(
      _userId: string | null,
      _ipAddress: string | null,
      _since: Date
    ): Promise<number> {
      throw new Error("Not implemented");
    },

    // Email Domain
    async getEmailDomain(_domain: string): Promise<EmailDomain | null> {
      throw new Error("Not implemented");
    },
    async countEmailDomains(_type: "allowlist" | "blocklist"): Promise<number> {
      throw new Error("Not implemented");
    },
    async upsertEmailDomain(
      _domain: string,
      _type: "allowlist" | "blocklist"
    ): Promise<void> {
      throw new Error("Not implemented");
    },
    async deleteEmailDomain(_domain: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // Webhook
    async createWebhook(
      _data: Omit<Webhook, "id" | "createdAt" | "updatedAt" | "enabled">
    ): Promise<Webhook> {
      throw new Error("Not implemented");
    },
    async getWebhook(_id: string): Promise<Webhook | null> {
      throw new Error("Not implemented");
    },
    async getWebhooksByOrganization(
      _organizationId: string
    ): Promise<Webhook[]> {
      throw new Error("Not implemented");
    },
    async getWebhooksByEvent(
      _organizationId: string,
      _event: string
    ): Promise<Webhook[]> {
      throw new Error("Not implemented");
    },
    async updateWebhook(
      _id: string,
      _data: Partial<Webhook>
    ): Promise<Webhook> {
      throw new Error("Not implemented");
    },
    async deleteWebhook(_id: string): Promise<void> {
      throw new Error("Not implemented");
    },

    // Webhook Delivery
    async createWebhookDelivery(
      _data: Omit<WebhookDelivery, "attemptedAt">
    ): Promise<WebhookDelivery> {
      throw new Error("Not implemented");
    },
    async getWebhookDeliveries(
      _webhookId: string,
      _limit?: number
    ): Promise<WebhookDelivery[]> {
      throw new Error("Not implemented");
    },

    // RBAC & Organizations
    async createOrganization(_data: {
      name: string;
      slug: string;
    }): Promise<Organization> {
      throw new Error("Not implemented");
    },
    async getOrganization(_id: string): Promise<Organization | null> {
      throw new Error("Not implemented");
    },
    async getOrganizationBySlug(_slug: string): Promise<Organization | null> {
      throw new Error("Not implemented");
    },
    async updateOrganization(
      _id: string,
      _data: Partial<Organization>
    ): Promise<Organization> {
      throw new Error("Not implemented");
    },
    async deleteOrganization(_id: string): Promise<void> {
      throw new Error("Not implemented");
    },

    async addOrganizationMember(_data: {
      organizationId: string;
      userId: string;
      roleId?: string;
    }): Promise<OrganizationMember> {
      throw new Error("Not implemented");
    },
    async getOrganizationMembers(
      _organizationId: string
    ): Promise<OrganizationMember[]> {
      throw new Error("Not implemented");
    },
    async removeOrganizationMember(
      _organizationId: string,
      _userId: string
    ): Promise<void> {
      throw new Error("Not implemented");
    },

    async createRole(_data: {
      name: string;
      description?: string;
      organizationId?: string;
    }): Promise<Role> {
      throw new Error("Not implemented");
    },
    async getRoles(_organizationId?: string): Promise<Role[]> {
      throw new Error("Not implemented");
    },
    async deleteRole(_id: string): Promise<void> {
      throw new Error("Not implemented");
    },

    async assignRoleToMember(
      _memberId: string,
      _roleId: string
    ): Promise<void> {
      throw new Error("Not implemented");
    },

    async createPermission(_data: {
      name: string;
      description?: string;
    }): Promise<Permission> {
      throw new Error("Not implemented");
    },
    async getPermissions(): Promise<Permission[]> {
      throw new Error("Not implemented");
    },
    async attachPermissionToRole(
      _roleId: string,
      _permissionId: string
    ): Promise<void> {
      throw new Error("Not implemented");
    },
  };
}
