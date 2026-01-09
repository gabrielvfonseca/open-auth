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
 * In-memory database adapter for testing and development
 */
export function createMemoryAdapter(): DatabaseAdapter {
  // Storage maps
  const users = new Map<string, User>();
  const sessions = new Map<string, Session>();
  const accounts = new Map<string, Account>();
  const devices = new Map<string, Device>();
  const passwordHistoryMap = new Map<string, PasswordHistory>();
  const passwordResetSessions = new Map<string, PasswordResetSession>();
  const emailVerificationsMap = new Map<string, EmailVerification>();
  const recoveryCodesMap = new Map<string, RecoveryCode>();
  const totpCredentialsMap = new Map<string, TOTPCredential>();
  const passkeyCredentialsMap = new Map<string, PasskeyCredential>();
  const securityKeyCredentialsMap = new Map<string, SecurityKeyCredential>();
  const webAuthnChallenges = new Map<string, WebAuthnChallenge>();
  const oauthApplicationsMap = new Map<string, OAuthApplication>();
  const oauthAuthorizationsMap = new Map<string, OAuthAuthorization>();
  const oauthAuthorizationCodesMap = new Map<string, OAuthAuthorizationCode>();
  const oauthTokensMap = new Map<string, OAuthToken>();
  const oauthRefreshTokensMap = new Map<string, OAuthRefreshToken>();
  const samlProvidersMap = new Map<string, SAMLProvider>();
  const magicLinkTokensMap = new Map<string, MagicLinkToken>();
  const failedLoginAttempts: FailedLoginAttempt[] = [];
  const emailDomainsMap = new Map<string, EmailDomain>();
  const webhooksMap = new Map<string, Webhook>();
  const deliveriesMap = new Map<string, WebhookDelivery>();
  const organizations = new Map<string, Organization>();
  const members = new Map<string, OrganizationMember>();
  const roles = new Map<string, Role>();
  const permissions = new Map<string, Permission>();
  const rolePermissions = new Map<string, Set<string>>();

  const generateId = () => Math.random().toString(36).substring(2, 15);

  return {
    // User
    async getUserById(userId: string) {
      return users.get(userId) || null;
    },
    async getUserFromEmail(email: string) {
      return Array.from(users.values()).find((u) => u.email === email) || null;
    },
    async getUserFromUsername(username: string) {
      return (
        Array.from(users.values()).find((u) => u.username === username) || null
      );
    },
    async createUser(email: string, username: string) {
      const id = generateId();
      const user: User = {
        id,
        email,
        username,
        emailVerified: false,
        registeredTOTP: false,
        registeredSecurityKey: false,
        registeredPasskey: false,
        registered2FA: false,
        failedLoginAttempts: 0,
        lockedUntil: null,
      };
      users.set(id, user);
      return user;
    },
    async updateUser(userId: string, data: Partial<User>) {
      const user = users.get(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const updated = { ...user, ...data };
      users.set(userId, updated);
      return updated;
    },
    async deleteUser(userId: string) {
      users.delete(userId);
    },

    // Account
    async getAccountById(accountId: string) {
      return accounts.get(accountId) || null;
    },
    async getAccountByProvider(providerId: string, provider: string) {
      return (
        Array.from(accounts.values()).find(
          (a) => a.providerId === providerId && a.type === provider
        ) || null
      );
    },
    async getAccountsByUserId(userId: string) {
      return Array.from(accounts.values()).filter((a) => a.userId === userId);
    },
    async createAccount(
      data: Partial<Account> & { userId: string; type: string }
    ) {
      const id = generateId();
      const account: Account = {
        id,
        userId: data.userId,
        type: data.type as Account["type"],
        providerId: data.providerId || null,
        email: data.email || null,
        emailVerified: data.emailVerified ?? false,
        createdAt: new Date(),
        lastUsedAt: null,
        passwordHash: data.passwordHash,
      };
      accounts.set(id, account);
      return account;
    },
    async updateAccount(accountId: string, data: Partial<Account>) {
      const account = accounts.get(accountId);
      if (!account) {
        throw new Error("Account not found");
      }
      const updated = { ...account, ...data };
      accounts.set(accountId, updated);
      return updated;
    },
    async deleteAccount(accountId: string) {
      accounts.delete(accountId);
    },

    // Session
    async createSession(session: Session) {
      sessions.set(session.id, session);
    },
    async getSession(sessionId: string) {
      return sessions.get(sessionId) || null;
    },
    async getSessionsByUserId(userId: string) {
      return Array.from(sessions.values()).filter((s) => s.userId === userId);
    },
    async updateSession(sessionId: string, data: Partial<Session>) {
      const session = sessions.get(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }
      sessions.set(sessionId, { ...session, ...data });
    },
    async deleteSession(sessionId: string) {
      sessions.delete(sessionId);
    },
    async deleteSessionsByUserId(userId: string) {
      for (const [id, session] of sessions) {
        if (session.userId === userId) {
          sessions.delete(id);
        }
      }
    },

    // Password History
    async getPasswordHistory(userId: string) {
      return Array.from(passwordHistoryMap.values()).filter(
        (p) => p.userId === userId
      );
    },
    async createPasswordHistory(data: {
      id: string;
      userId: string;
      passwordHash: string;
    }) {
      passwordHistoryMap.set(data.id, { ...data, createdAt: new Date() });
    },
    async deletePasswordHistory(id: string) {
      passwordHistoryMap.delete(id);
    },
    async deletePasswordHistoryByUserId(userId: string) {
      for (const [id, p] of passwordHistoryMap) {
        if (p.userId === userId) {
          passwordHistoryMap.delete(id);
        }
      }
    },

    // Password Reset Session
    async createPasswordResetSession(session: PasswordResetSession) {
      passwordResetSessions.set(session.id, session);
    },
    async getPasswordResetSession(token: string) {
      return (
        Array.from(passwordResetSessions.values()).find(
          (s) => s.id === token
        ) || null
      );
    },
    async getPasswordResetSessionById(sessionId: string) {
      return passwordResetSessions.get(sessionId) || null;
    },
    async updatePasswordResetSession(
      sessionId: string,
      data: Partial<PasswordResetSession>
    ) {
      const session = passwordResetSessions.get(sessionId);
      if (!session) {
        throw new Error("Password reset session not found");
      }
      passwordResetSessions.set(sessionId, { ...session, ...data });
    },
    async deletePasswordResetSession(sessionId: string) {
      passwordResetSessions.delete(sessionId);
    },
    async deletePasswordResetSessionsByUserId(userId: string) {
      for (const [id, s] of passwordResetSessions) {
        if (s.userId === userId) {
          passwordResetSessions.delete(id);
        }
      }
    },

    // Device
    async createDevice(data: Omit<Device, "createdAt">) {
      const device: Device = {
        ...data,
        createdAt: new Date(),
      };
      devices.set(device.id, device);
      return device;
    },
    async getDevice(deviceId: string) {
      return devices.get(deviceId) || null;
    },
    async getDeviceByFingerprint(userId: string, fingerprint: string) {
      return (
        Array.from(devices.values()).find(
          (d) => d.userId === userId && d.fingerprint === fingerprint
        ) || null
      );
    },
    async getDevicesByUserId(userId: string) {
      return Array.from(devices.values()).filter((d) => d.userId === userId);
    },
    async updateDevice(deviceId: string, data: Partial<Device>) {
      const device = devices.get(deviceId);
      if (!device) {
        throw new Error("Device not found");
      }
      const updated = { ...device, ...data };
      devices.set(deviceId, updated);
      return updated;
    },
    async deleteDevice(deviceId: string) {
      devices.delete(deviceId);
    },

    // Email Verification
    async createEmailVerification(data: Omit<EmailVerification, "createdAt">) {
      const verification: EmailVerification = { ...data };
      emailVerificationsMap.set(data.id, verification);
      return verification;
    },
    async getEmailVerification(userId: string, code: string) {
      return (
        Array.from(emailVerificationsMap.values()).find(
          (v) => v.userId === userId && v.code === code
        ) || null
      );
    },
    async deleteEmailVerification(id: string) {
      emailVerificationsMap.delete(id);
    },
    async deleteEmailVerificationsByUserId(userId: string) {
      for (const [id, v] of emailVerificationsMap) {
        if (v.userId === userId) {
          emailVerificationsMap.delete(id);
        }
      }
    },

    // Recovery Codes
    async createRecoveryCode(data: Omit<RecoveryCode, "createdAt" | "usedAt">) {
      const code: RecoveryCode = { ...data, createdAt: new Date() };
      recoveryCodesMap.set(data.id, code);
      return code;
    },
    async getRecoveryCodes(userId: string) {
      return Array.from(recoveryCodesMap.values()).filter(
        (c) => c.userId === userId
      );
    },
    async getRecoveryCode(userId: string, codeHash: string) {
      return (
        Array.from(recoveryCodesMap.values()).find(
          (c) => c.userId === userId && c.codeHash === codeHash
        ) || null
      );
    },
    async updateRecoveryCode(id: string, data: Partial<RecoveryCode>) {
      const code = recoveryCodesMap.get(id);
      if (!code) {
        throw new Error("Recovery code not found");
      }
      recoveryCodesMap.set(id, { ...code, ...data });
    },
    async deleteRecoveryCodesByUserId(userId: string) {
      for (const [id, c] of recoveryCodesMap) {
        if (c.userId === userId) {
          recoveryCodesMap.delete(id);
        }
      }
    },

    // TOTP
    async createTOTPCredential(
      data: Omit<TOTPCredential, "createdAt" | "lastUsedAt">
    ) {
      const cred: TOTPCredential = {
        ...data,
        createdAt: new Date(),
        lastUsedAt: null,
      };
      totpCredentialsMap.set(data.id, cred);
      return cred;
    },
    async getTOTPCredential(userId: string, credentialId: string) {
      const cred = totpCredentialsMap.get(credentialId);
      if (cred && cred.userId === userId) {
        return cred;
      }
      return null;
    },
    async getTOTPCredentials(userId: string) {
      return Array.from(totpCredentialsMap.values()).filter(
        (c) => c.userId === userId
      );
    },
    async updateTOTPCredential(id: string, data: Partial<TOTPCredential>) {
      const cred = totpCredentialsMap.get(id);
      if (!cred) {
        throw new Error("TOTP credential not found");
      }
      totpCredentialsMap.set(id, { ...cred, ...data });
    },
    async deleteTOTPCredential(id: string, userId: string) {
      const cred = totpCredentialsMap.get(id);
      if (cred && cred.userId === userId) {
        totpCredentialsMap.delete(id);
      }
    },
    async deleteTOTPCredentialsByUserId(userId: string) {
      for (const [id, c] of totpCredentialsMap) {
        if (c.userId === userId) {
          totpCredentialsMap.delete(id);
        }
      }
    },

    // Passkey
    async createPasskeyCredential(
      data: Omit<PasskeyCredential, "createdAt" | "lastUsedAt">
    ) {
      const cred: PasskeyCredential = {
        ...data,
        createdAt: new Date(),
        lastUsedAt: null,
      };
      passkeyCredentialsMap.set(
        Buffer.from(data.id as Buffer).toString("hex"),
        cred
      );
      return cred;
    },
    async getPasskeyCredential(
      userId: string,
      credentialId: Buffer | Uint8Array
    ) {
      const key = Buffer.from(credentialId).toString("hex");
      const cred = passkeyCredentialsMap.get(key);
      if (cred && cred.userId === userId) {
        return cred;
      }
      return null;
    },
    async getPasskeyCredentials(userId: string) {
      return Array.from(passkeyCredentialsMap.values()).filter(
        (c) => c.userId === userId
      );
    },
    async updatePasskeyCredential(
      id: Buffer | Uint8Array,
      data: Partial<PasskeyCredential>
    ) {
      const key = Buffer.from(id).toString("hex");
      const cred = passkeyCredentialsMap.get(key);
      if (!cred) {
        throw new Error("Passkey credential not found");
      }
      passkeyCredentialsMap.set(key, { ...cred, ...data });
    },
    async deletePasskeyCredential(id: Buffer | Uint8Array, userId: string) {
      const key = Buffer.from(id).toString("hex");
      const cred = passkeyCredentialsMap.get(key);
      if (cred && cred.userId === userId) {
        passkeyCredentialsMap.delete(key);
      }
    },
    async deletePasskeyCredentialsByUserId(userId: string) {
      for (const [id, c] of passkeyCredentialsMap) {
        if (c.userId === userId) {
          passkeyCredentialsMap.delete(id);
        }
      }
    },

    // Security Key
    async createSecurityKeyCredential(
      data: Omit<SecurityKeyCredential, "createdAt" | "lastUsedAt">
    ) {
      const cred: SecurityKeyCredential = {
        ...data,
        createdAt: new Date(),
        lastUsedAt: null,
      };
      securityKeyCredentialsMap.set(
        Buffer.from(data.id as Buffer).toString("hex"),
        cred
      );
      return cred;
    },
    async getSecurityKeyCredential(
      userId: string,
      credentialId: Buffer | Uint8Array
    ) {
      const key = Buffer.from(credentialId).toString("hex");
      const cred = securityKeyCredentialsMap.get(key);
      if (cred && cred.userId === userId) {
        return cred;
      }
      return null;
    },
    async getSecurityKeyCredentials(userId: string) {
      return Array.from(securityKeyCredentialsMap.values()).filter(
        (c) => c.userId === userId
      );
    },
    async updateSecurityKeyCredential(
      id: Buffer | Uint8Array,
      data: Partial<SecurityKeyCredential>
    ) {
      const key = Buffer.from(id).toString("hex");
      const cred = securityKeyCredentialsMap.get(key);
      if (!cred) {
        throw new Error("Security key credential not found");
      }
      securityKeyCredentialsMap.set(key, { ...cred, ...data });
    },
    async deleteSecurityKeyCredential(id: Buffer | Uint8Array, userId: string) {
      const key = Buffer.from(id).toString("hex");
      const cred = securityKeyCredentialsMap.get(key);
      if (cred && cred.userId === userId) {
        securityKeyCredentialsMap.delete(key);
      }
    },
    async deleteSecurityKeyCredentialsByUserId(userId: string) {
      for (const [id, c] of securityKeyCredentialsMap) {
        if (c.userId === userId) {
          securityKeyCredentialsMap.delete(id);
        }
      }
    },

    // WebAuthn Challenge
    async createWebAuthnChallenge(data: WebAuthnChallenge) {
      webAuthnChallenges.set(data.id, data);
    },
    async getWebAuthnChallenge(challengeId: string) {
      return webAuthnChallenges.get(challengeId) || null;
    },
    async deleteWebAuthnChallenge(challengeId: string) {
      webAuthnChallenges.delete(challengeId);
    },
    async deleteExpiredWebAuthnChallenges() {
      const now = new Date();
      let count = 0;
      for (const [id, c] of webAuthnChallenges) {
        if (c.expiresAt < now) {
          webAuthnChallenges.delete(id);
          count++;
        }
      }
      return count;
    },

    // OAuth Application
    async createOAuthApplication(
      data: Omit<OAuthApplication, "id" | "createdAt" | "updatedAt">
    ) {
      const id = generateId();
      const app: OAuthApplication = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      oauthApplicationsMap.set(id, app);
      return app;
    },
    async getOAuthApplication(id: string) {
      return oauthApplicationsMap.get(id) || null;
    },
    async getOAuthApplicationByClientId(clientId: string) {
      return (
        Array.from(oauthApplicationsMap.values()).find(
          (a) => a.clientId === clientId
        ) || null
      );
    },
    async getOAuthApplications(userId: string, organizationId: string) {
      return Array.from(oauthApplicationsMap.values()).filter(
        (a) => a.userId === userId && a.organizationId === organizationId
      );
    },
    async updateOAuthApplication(id: string, data: Partial<OAuthApplication>) {
      const app = oauthApplicationsMap.get(id);
      if (!app) {
        throw new Error("OAuth application not found");
      }
      const updated = { ...app, ...data, updatedAt: new Date() };
      oauthApplicationsMap.set(id, updated);
      return updated;
    },
    async deleteOAuthApplication(id: string) {
      oauthApplicationsMap.delete(id);
    },

    // OAuth Authorization
    async getOAuthAuthorization(userId: string, applicationId: string) {
      return (
        Array.from(oauthAuthorizationsMap.values()).find(
          (a) => a.userId === userId && a.applicationId === applicationId
        ) || null
      );
    },
    async createOAuthAuthorization(
      data: Omit<OAuthAuthorization, "id" | "createdAt" | "updatedAt">
    ) {
      const id = generateId();
      const auth: OAuthAuthorization = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      oauthAuthorizationsMap.set(id, auth);
      return auth;
    },
    async updateOAuthAuthorization(
      id: string,
      data: Partial<OAuthAuthorization>
    ) {
      const auth = oauthAuthorizationsMap.get(id);
      if (!auth) {
        throw new Error("OAuth authorization not found");
      }
      const updated = { ...auth, ...data, updatedAt: new Date() };
      oauthAuthorizationsMap.set(id, updated);
      return updated;
    },
    async getOAuthAuthorizations(userId: string) {
      return Array.from(oauthAuthorizationsMap.values()).filter(
        (a) => a.userId === userId
      );
    },
    async deleteOAuthAuthorization(id: string) {
      oauthAuthorizationsMap.delete(id);
    },

    // OAuth Authorization Code
    async createOAuthAuthorizationCode(
      data: Omit<OAuthAuthorizationCode, "id" | "createdAt" | "used" | "usedAt">
    ) {
      const id = generateId();
      const code: OAuthAuthorizationCode = {
        id,
        ...data,
        createdAt: new Date(),
        used: false,
        usedAt: null,
      };
      oauthAuthorizationCodesMap.set(id, code);
      return code;
    },
    async getOAuthAuthorizationCode(code: string) {
      return (
        Array.from(oauthAuthorizationCodesMap.values()).find(
          (c) => c.code === code
        ) || null
      );
    },
    async updateOAuthAuthorizationCode(
      id: string,
      data: Partial<OAuthAuthorizationCode>
    ) {
      const code = oauthAuthorizationCodesMap.get(id);
      if (!code) {
        throw new Error("OAuth authorization code not found");
      }
      const updated = { ...code, ...data };
      oauthAuthorizationCodesMap.set(id, updated);
      return updated;
    },

    // OAuth Token
    async createOAuthToken(
      data: Omit<OAuthToken, "id" | "createdAt" | "lastUsedAt">
    ) {
      const id = generateId();
      const token: OAuthToken = {
        id,
        ...data,
        createdAt: new Date(),
        lastUsedAt: null,
      };
      oauthTokensMap.set(id, token);
      return token;
    },
    async getOAuthToken(tokenHash: string) {
      return (
        Array.from(oauthTokensMap.values()).find(
          (t) => t.tokenHash === tokenHash
        ) || null
      );
    },
    async updateOAuthToken(id: string, data: Partial<OAuthToken>) {
      const token = oauthTokensMap.get(id);
      if (!token) {
        throw new Error("OAuth token not found");
      }
      const updated = { ...token, ...data };
      oauthTokensMap.set(id, updated);
      return updated;
    },
    async deleteOAuthToken(id: string) {
      oauthTokensMap.delete(id);
    },

    // OAuth Refresh Token
    async createOAuthRefreshToken(
      data: Omit<
        OAuthRefreshToken,
        "id" | "createdAt" | "revoked" | "revokedAt"
      >
    ) {
      const id = generateId();
      const token: OAuthRefreshToken = {
        id,
        ...data,
        createdAt: new Date(),
        revoked: false,
        revokedAt: null,
      };
      oauthRefreshTokensMap.set(id, token);
      return token;
    },
    async getOAuthRefreshToken(tokenHash: string) {
      return (
        Array.from(oauthRefreshTokensMap.values()).find(
          (t) => t.tokenHash === tokenHash
        ) || null
      );
    },
    async updateOAuthRefreshToken(
      id: string,
      data: Partial<OAuthRefreshToken>
    ) {
      const token = oauthRefreshTokensMap.get(id);
      if (!token) {
        throw new Error("OAuth refresh token not found");
      }
      const updated = { ...token, ...data };
      oauthRefreshTokensMap.set(id, updated);
      return updated;
    },

    // SAML Provider
    async getSAMLProviders(enabledOnly?: boolean) {
      const all = Array.from(samlProvidersMap.values());
      return enabledOnly ? all.filter((p) => p.enabled) : all;
    },
    async getSAMLProviderById(id: string) {
      return samlProvidersMap.get(id) || null;
    },
    async getSAMLProviderByEntityId(entityId: string) {
      return (
        Array.from(samlProvidersMap.values()).find(
          (p) => p.entityId === entityId
        ) || null
      );
    },
    async createSAMLProvider(
      data: Omit<SAMLProvider, "id" | "createdAt" | "updatedAt">
    ) {
      const id = generateId();
      const provider: SAMLProvider = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      samlProvidersMap.set(id, provider);
      return provider;
    },
    async updateSAMLProvider(id: string, data: Partial<SAMLProvider>) {
      const provider = samlProvidersMap.get(id);
      if (!provider) {
        throw new Error("SAML provider not found");
      }
      const updated = { ...provider, ...data, updatedAt: new Date() };
      samlProvidersMap.set(id, updated);
      return updated;
    },
    async deleteSAMLProvider(id: string) {
      samlProvidersMap.delete(id);
    },

    // Magic Link
    async createMagicLinkToken(
      data: Omit<MagicLinkToken, "createdAt" | "used" | "usedAt">
    ) {
      const token: MagicLinkToken = {
        ...data,
        createdAt: new Date(),
        used: false,
        usedAt: null,
      };
      magicLinkTokensMap.set(data.id, token);
      return token;
    },
    async getMagicLinkToken(tokenHash: string) {
      return (
        Array.from(magicLinkTokensMap.values()).find(
          (t) => t.tokenHash === tokenHash
        ) || null
      );
    },
    async updateMagicLinkToken(id: string, data: Partial<MagicLinkToken>) {
      const token = magicLinkTokensMap.get(id);
      if (!token) {
        throw new Error("Magic link token not found");
      }
      const updated = { ...token, ...data };
      magicLinkTokensMap.set(id, updated);
      return updated;
    },
    async deleteExpiredMagicLinkTokens() {
      const now = new Date();
      let count = 0;
      for (const [id, token] of magicLinkTokensMap) {
        if (token.expiresAt < now) {
          magicLinkTokensMap.delete(id);
          count++;
        }
      }
      return count;
    },

    // Failed Login Attempt
    async createFailedLoginAttempt(
      data: Omit<FailedLoginAttempt, "createdAt">
    ) {
      failedLoginAttempts.push({ ...data, createdAt: new Date() });
      return;
    },
    async countFailedLoginAttempts(
      userId: string | null,
      ipAddress: string | null,
      since: Date
    ) {
      return failedLoginAttempts.filter(
        (a) =>
          a.createdAt >= since &&
          (userId
            ? a.userId === userId
            : ipAddress
              ? a.ipAddress === ipAddress
              : false)
      ).length;
    },

    // Email Domain
    async getEmailDomain(domain: string) {
      return emailDomainsMap.get(domain) || null;
    },
    async countEmailDomains(type: "allowlist" | "blocklist") {
      return Array.from(emailDomainsMap.values()).filter((d) => d.type === type)
        .length;
    },
    async upsertEmailDomain(domain: string, type: "allowlist" | "blocklist") {
      const existing = emailDomainsMap.get(domain);
      if (existing) {
        emailDomainsMap.set(domain, {
          ...existing,
          type,
          updatedAt: new Date(),
        });
      } else {
        emailDomainsMap.set(domain, {
          id: generateId(),
          domain,
          type,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    },
    async deleteEmailDomain(domain: string) {
      emailDomainsMap.delete(domain);
    },

    // Webhook
    async createWebhook(
      data: Omit<Webhook, "id" | "createdAt" | "updatedAt" | "enabled">
    ) {
      const id = generateId();
      const webhook: Webhook = {
        id,
        ...data,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      webhooksMap.set(id, webhook);
      return webhook;
    },
    async getWebhook(id: string) {
      return webhooksMap.get(id) || null;
    },
    async getWebhooksByOrganization(organizationId: string) {
      return Array.from(webhooksMap.values()).filter(
        (w) => w.organizationId === organizationId
      );
    },
    async getWebhooksByEvent(organizationId: string, event: string) {
      return Array.from(webhooksMap.values()).filter(
        (w) =>
          w.organizationId === organizationId &&
          w.enabled &&
          w.events.includes(event)
      );
    },
    async updateWebhook(id: string, data: Partial<Webhook>) {
      const existing = webhooksMap.get(id);
      if (!existing) {
        throw new Error("Webhook not found");
      }
      const updated = { ...existing, ...data, updatedAt: new Date() };
      webhooksMap.set(id, updated);
      return updated;
    },
    async deleteWebhook(id: string) {
      webhooksMap.delete(id);
    },

    // Webhook Delivery
    async createWebhookDelivery(data: Omit<WebhookDelivery, "attemptedAt">) {
      const delivery: WebhookDelivery = {
        ...data,
        attemptedAt: new Date(),
      };
      deliveriesMap.set(delivery.id, delivery);
      return delivery;
    },
    async getWebhookDeliveries(webhookId: string, limit = 50) {
      return Array.from(deliveriesMap.values())
        .filter((d) => d.webhookId === webhookId)
        .sort((a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime())
        .slice(0, limit);
    },

    // RBAC & Organizations
    async createOrganization(data: { name: string; slug: string }) {
      const id = generateId();
      const org: Organization = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      organizations.set(id, org);
      return org;
    },
    async getOrganization(id: string) {
      return organizations.get(id) || null;
    },
    async getOrganizationBySlug(slug: string) {
      return (
        Array.from(organizations.values()).find((o) => o.slug === slug) || null
      );
    },
    async updateOrganization(id: string, data: Partial<Organization>) {
      const org = organizations.get(id);
      if (!org) {
        throw new Error("Organization not found");
      }
      const updated = { ...org, ...data, updatedAt: new Date() };
      organizations.set(id, updated);
      return updated;
    },
    async deleteOrganization(id: string) {
      organizations.delete(id);
    },

    async addOrganizationMember(data: {
      organizationId: string;
      userId: string;
      roleId?: string;
    }) {
      const id = generateId();
      const member: OrganizationMember = {
        id,
        organizationId: data.organizationId,
        userId: data.userId,
        roleId: data.roleId || null,
        joinedAt: new Date(),
      };
      members.set(id, member);
      return member;
    },
    async getOrganizationMembers(organizationId: string) {
      return Array.from(members.values()).filter(
        (m) => m.organizationId === organizationId
      );
    },
    async removeOrganizationMember(organizationId: string, userId: string) {
      for (const [id, m] of members) {
        if (m.organizationId === organizationId && m.userId === userId) {
          members.delete(id);
          break;
        }
      }
    },

    async createRole(data: {
      name: string;
      description?: string;
      organizationId?: string;
    }) {
      const id = generateId();
      const role: Role = {
        id,
        name: data.name,
        description: data.description || null,
        organizationId: data.organizationId || null,
        createdAt: new Date(),
      };
      roles.set(id, role);
      return role;
    },
    async getRoles(organizationId?: string) {
      return Array.from(roles.values()).filter((r) =>
        organizationId ? r.organizationId === organizationId : true
      );
    },
    async deleteRole(id: string) {
      roles.delete(id);
    },

    async assignRoleToMember(memberId: string, roleId: string) {
      const member = members.get(memberId);
      if (!member) {
        throw new Error("Member not found");
      }
      members.set(memberId, { ...member, roleId });
    },

    async createPermission(data: { name: string; description?: string }) {
      const id = generateId();
      const permission: Permission = {
        id,
        name: data.name,
        description: data.description || null,
      };
      permissions.set(id, permission);
      return permission;
    },
    async getPermissions() {
      return Array.from(permissions.values());
    },
    async attachPermissionToRole(roleId: string, permissionId: string) {
      if (!rolePermissions.has(roleId)) {
        rolePermissions.set(roleId, new Set());
      }
      rolePermissions.get(roleId)?.add(permissionId);
    },
  };
}
