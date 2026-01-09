import type { DatabaseAdapter } from "@open-auth/core";

// This is a generic type for the Prisma Client to avoid importing the generated client
interface PrismaClientGeneric {
  user: any;
  session: any;
  account: any;
  device: any;
  passwordHistory: any;
  passwordResetSession: any;
  emailVerification: any;
  recoveryCode: any;
  totpCredential: any;
  passkeyCredential: any;
  securityKeyCredential: any;
  webAuthnChallenge: any;
  oAuthApplication: any;
  oAuthAuthorization: any;
  oAuthAuthorizationCode: any;
  oAuthToken: any;
  oAuthRefreshToken: any;
  sAMLProvider: any;
  magicLinkToken: any;
  failedLoginAttempt: any;
  emailDomain: any;
  webhook: any;
  webhookDelivery: any;
  organization: any;
  organizationMember: any;
  role: any;
  permission: any;
  rolePermission: any;
}

export function createPrismaAdapter(
  prisma: PrismaClientGeneric
): DatabaseAdapter {
  return {
    // User
    async createUser(email, username) {
      return prisma.user.create({
        data: {
          email,
          username,
          // Defaults handled by DB/Schema mostly, but explicit safe:
          emailVerified: false,
          failedLoginAttempts: 0,
        },
      });
    },
    async getUserById(id) {
      return prisma.user.findUnique({ where: { id } });
    },
    async getUserFromEmail(email) {
      return prisma.user.findUnique({ where: { email } });
    },
    async getUserFromUsername(username) {
      return prisma.user.findFirst({ where: { username } });
    },
    async updateUser(id, data) {
      return prisma.user.update({ where: { id }, data });
    },
    async deleteUser(id) {
      await prisma.user.delete({ where: { id } });
    },

    // Account
    async createAccount(data) {
      return prisma.account.create({ data });
    },
    async getAccountById(id) {
      return prisma.account.findUnique({ where: { id } });
    },
    async getAccountByProvider(providerId, provider) {
      return prisma.account.findUnique({
        where: {
          type_providerId: {
            type: provider,
            providerId,
          },
        },
      });
    },
    async getAccountsByUserId(userId) {
      return prisma.account.findMany({ where: { userId } });
    },
    async updateAccount(id, data) {
      return prisma.account.update({ where: { id }, data });
    },
    async deleteAccount(id) {
      await prisma.account.delete({ where: { id } });
    },

    // Session
    async createSession(data) {
      await prisma.session.create({ data });
    },
    async getSession(id) {
      return prisma.session.findUnique({ where: { id } });
    },
    async getSessionsByUserId(userId) {
      return prisma.session.findMany({ where: { userId } });
    },
    async updateSession(id, data) {
      await prisma.session.update({ where: { id }, data });
    },
    async deleteSession(id) {
      await prisma.session.delete({ where: { id } });
    },
    async deleteSessionsByUserId(userId) {
      await prisma.session.deleteMany({ where: { userId } });
    },

    // Password History
    async getPasswordHistory(userId) {
      return prisma.passwordHistory.findMany({ where: { userId } });
    },
    async createPasswordHistory(data) {
      await prisma.passwordHistory.create({ data });
    },
    async deletePasswordHistory(id) {
      await prisma.passwordHistory.delete({ where: { id } });
    },
    async deletePasswordHistoryByUserId(userId) {
      await prisma.passwordHistory.deleteMany({ where: { userId } });
    },

    // Password Reset Session
    async createPasswordResetSession(data) {
      await prisma.passwordResetSession.create({ data });
    },
    async getPasswordResetSession(token) {
      // Original code seemed to use ID as token or find by code?
      // Adapters interface had `getPasswordResetSession(token)`
      // Schema has `id` and `code`.
      // If token is ID:
      return prisma.passwordResetSession.findUnique({ where: { id: token } });
    },
    async getPasswordResetSessionById(id) {
      return prisma.passwordResetSession.findUnique({ where: { id } });
    },
    async updatePasswordResetSession(id, data) {
      await prisma.passwordResetSession.update({ where: { id }, data });
    },
    async deletePasswordResetSession(id) {
      await prisma.passwordResetSession.delete({ where: { id } });
    },
    async deletePasswordResetSessionsByUserId(userId) {
      await prisma.passwordResetSession.deleteMany({ where: { userId } });
    },

    // Device
    async createDevice(data) {
      return prisma.device.create({ data });
    },
    async getDevice(id) {
      return prisma.device.findUnique({ where: { id } });
    },
    async getDeviceByFingerprint(userId, fingerprint) {
      // Schema has unique fingerprint, so maybe findUnique by fingerprint is enough?
      // But we verify userId just in case?
      // prisma.device.findUnique({ where: { fingerprint } }) -> check user?
      // The interface asks for (userId, fingerprint).
      const device = await prisma.device.findUnique({ where: { fingerprint } });
      if (device && device.userId === userId) {
        return device;
      }
      return null;
    },
    async getDevicesByUserId(userId) {
      return prisma.device.findMany({ where: { userId } });
    },
    async updateDevice(id, data) {
      return prisma.device.update({ where: { id }, data });
    },
    async deleteDevice(id) {
      await prisma.device.delete({ where: { id } });
    },

    // Email Verification
    async createEmailVerification(data) {
      return prisma.emailVerification.create({ data });
    },
    async getEmailVerification(userId, code) {
      // This might be tricky if code is not unique globally, but unique per user?
      // Schema: @@index([code])
      // so findFirst({ where: { userId, code } })
      return prisma.emailVerification.findFirst({ where: { userId, code } });
    },
    async deleteEmailVerification(id) {
      await prisma.emailVerification.delete({ where: { id } });
    },
    async deleteEmailVerificationsByUserId(userId) {
      await prisma.emailVerification.deleteMany({ where: { userId } });
    },

    // Recovery Codes
    async createRecoveryCode(data) {
      return prisma.recoveryCode.create({ data });
    },
    async getRecoveryCodes(userId) {
      return prisma.recoveryCode.findMany({ where: { userId } });
    },
    async getRecoveryCode(userId, codeHash) {
      return prisma.recoveryCode.findFirst({ where: { userId, codeHash } });
    },
    async updateRecoveryCode(id, data) {
      await prisma.recoveryCode.update({ where: { id }, data });
    },
    async deleteRecoveryCodesByUserId(userId) {
      await prisma.recoveryCode.deleteMany({ where: { userId } });
    },

    // TOTP
    async createTOTPCredential(data) {
      return prisma.totpCredential.create({ data });
    },
    async getTOTPCredential(userId) {
      return prisma.totpCredential.findFirst({ where: { userId } });
    },
    async getTOTPCredentials(userId) {
      return prisma.totpCredential.findMany({ where: { userId } });
    },
    async updateTOTPCredential(id, data) {
      await prisma.totpCredential.update({ where: { id }, data });
    },
    async deleteTOTPCredential(id) {
      await prisma.totpCredential.delete({ where: { id } });
    },
    async deleteTOTPCredentialsByUserId(userId) {
      await prisma.totpCredential.deleteMany({ where: { userId } });
    },

    // Passkey
    async createPasskeyCredential(data) {
      // data.id is Buffer, schema uses Bytes @id.
      // prisma accepts Buffer for Bytes.
      return prisma.passkeyCredential.create({ data });
    },
    async getPasskeyCredential(userId, credentialId) {
      const cred = await prisma.passkeyCredential.findUnique({
        where: { id: credentialId },
      });
      if (cred && cred.userId === userId) {
        return cred;
      }
      return null;
    },
    async getPasskeyCredentials(userId) {
      return prisma.passkeyCredential.findMany({ where: { userId } });
    },
    async updatePasskeyCredential(id, data) {
      await prisma.passkeyCredential.update({ where: { id }, data });
    },
    async deletePasskeyCredential(id, userId) {
      // Safe delete verifying user?
      // prisma delete doesn't allow where: { id, userId } for primary key unique lookups unless composed
      // But we can check or just delete by ID if we trust caller.
      // Or findFirst then delete.
      // Interface provides userId.
      const cred = await prisma.passkeyCredential.findUnique({ where: { id } });
      if (cred && cred.userId === userId) {
        await prisma.passkeyCredential.delete({ where: { id } });
      }
    },
    async deletePasskeyCredentialsByUserId(userId) {
      await prisma.passkeyCredential.deleteMany({ where: { userId } });
    },

    // Security Key
    async createSecurityKeyCredential(data) {
      return prisma.securityKeyCredential.create({ data });
    },
    async getSecurityKeyCredential(userId, credentialId) {
      const cred = await prisma.securityKeyCredential.findUnique({
        where: { id: credentialId },
      });
      if (cred && cred.userId === userId) {
        return cred;
      }
      return null;
    },
    async getSecurityKeyCredentials(userId) {
      return prisma.securityKeyCredential.findMany({ where: { userId } });
    },
    async updateSecurityKeyCredential(id, data) {
      await prisma.securityKeyCredential.update({ where: { id }, data });
    },
    async deleteSecurityKeyCredential(id, userId) {
      const cred = await prisma.securityKeyCredential.findUnique({
        where: { id },
      });
      if (cred && cred.userId === userId) {
        await prisma.securityKeyCredential.delete({ where: { id } });
      }
    },
    async deleteSecurityKeyCredentialsByUserId(userId) {
      await prisma.securityKeyCredential.deleteMany({ where: { userId } });
    },

    // WebAuthn Challenge
    async createWebAuthnChallenge(data) {
      await prisma.webAuthnChallenge.create({ data });
    },
    async getWebAuthnChallenge(id) {
      return prisma.webAuthnChallenge.findUnique({ where: { id } });
    },
    async deleteWebAuthnChallenge(id) {
      await prisma.webAuthnChallenge.delete({ where: { id } });
    },
    async deleteExpiredWebAuthnChallenges() {
      const result = await prisma.webAuthnChallenge.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      return result.count;
    },

    // OAuth Application
    async createOAuthApplication(data) {
      return prisma.oAuthApplication.create({ data });
    },
    async getOAuthApplication(id) {
      return prisma.oAuthApplication.findUnique({ where: { id } });
    },
    async getOAuthApplicationByClientId(clientId) {
      return prisma.oAuthApplication.findUnique({ where: { clientId } });
    },
    async getOAuthApplications(userId, organizationId) {
      return prisma.oAuthApplication.findMany({
        where: { userId, organizationId },
      });
    },
    async updateOAuthApplication(id, data) {
      return prisma.oAuthApplication.update({ where: { id }, data });
    },
    async deleteOAuthApplication(id) {
      await prisma.oAuthApplication.delete({ where: { id } });
    },

    // OAuth Authorization
    async getOAuthAuthorization(userId, applicationId) {
      return prisma.oAuthAuthorization.findUnique({
        where: {
          userId_applicationId: { userId, applicationId },
        },
      });
    },
    async createOAuthAuthorization(data) {
      return prisma.oAuthAuthorization.create({ data });
    },
    async updateOAuthAuthorization(id, data) {
      return prisma.oAuthAuthorization.update({ where: { id }, data });
    },
    async getOAuthAuthorizations(userId) {
      return prisma.oAuthAuthorization.findMany({ where: { userId } });
    },
    async deleteOAuthAuthorization(id) {
      await prisma.oAuthAuthorization.delete({ where: { id } });
    },

    // OAuth Authorization Code
    async createOAuthAuthorizationCode(data) {
      return prisma.oAuthAuthorizationCode.create({ data });
    },
    async getOAuthAuthorizationCode(code) {
      return prisma.oAuthAuthorizationCode.findUnique({ where: { code } });
    },
    async updateOAuthAuthorizationCode(id, data) {
      return prisma.oAuthAuthorizationCode.update({ where: { id }, data });
    },

    // OAuth Token
    async createOAuthToken(data) {
      return prisma.oAuthToken.create({ data });
    },
    async getOAuthToken(tokenHash) {
      return prisma.oAuthToken.findUnique({ where: { tokenHash } });
    },
    async updateOAuthToken(id, data) {
      return prisma.oAuthToken.update({ where: { id }, data });
    },
    async deleteOAuthToken(id) {
      await prisma.oAuthToken.delete({ where: { id } });
    },

    // OAuth Refresh Token
    async createOAuthRefreshToken(data) {
      return prisma.oAuthRefreshToken.create({ data });
    },
    async getOAuthRefreshToken(tokenHash) {
      return prisma.oAuthRefreshToken.findUnique({ where: { tokenHash } });
    },
    async updateOAuthRefreshToken(id, data) {
      return prisma.oAuthRefreshToken.update({ where: { id }, data });
    },

    // SAML Provider
    async getSAMLProviders(enabledOnly) {
      const where = enabledOnly ? { enabled: true } : {};
      return prisma.sAMLProvider.findMany({ where });
    },
    async getSAMLProviderById(id) {
      return prisma.sAMLProvider.findUnique({ where: { id } });
    },
    async getSAMLProviderByEntityId(entityId) {
      return prisma.sAMLProvider.findUnique({ where: { entityId } });
    },
    async createSAMLProvider(data) {
      return prisma.sAMLProvider.create({ data });
    },
    async updateSAMLProvider(id, data) {
      return prisma.sAMLProvider.update({ where: { id }, data });
    },
    async deleteSAMLProvider(id) {
      await prisma.sAMLProvider.delete({ where: { id } });
    },

    // Magic Link
    async createMagicLinkToken(data) {
      return prisma.magicLinkToken.create({ data });
    },
    async getMagicLinkToken(tokenHash) {
      return prisma.magicLinkToken.findFirst({ where: { tokenHash } });
      // Schema has @@index([tokenHash]) not unique?
      // Oh schema: tokenHash String @map("token_hash")
      // @@index([tokenHash])
      // It should be unique conceptually. Using findFirst is safe.
    },
    async updateMagicLinkToken(id, data) {
      return prisma.magicLinkToken.update({ where: { id }, data });
    },
    async deleteExpiredMagicLinkTokens() {
      const result = await prisma.magicLinkToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      return result.count;
    },

    // Failed Login Attempt
    async createFailedLoginAttempt(data) {
      await prisma.failedLoginAttempt.create({ data });
    },
    async countFailedLoginAttempts(userId, ipAddress, since) {
      const where: any = {
        createdAt: { gte: since },
      };
      if (userId !== null) {
        where.userId = userId;
      } else if (ipAddress !== null) {
        where.ipAddress = ipAddress;
      } else {
        return 0;
      }
      return prisma.failedLoginAttempt.count({ where });
    },

    // Email Domain
    async getEmailDomain(domain) {
      return prisma.emailDomain.findUnique({ where: { domain } });
    },
    async countEmailDomains(type) {
      return prisma.emailDomain.count({ where: { type } });
    },
    async upsertEmailDomain(domain, type) {
      await prisma.emailDomain.upsert({
        where: { domain },
        create: { domain, type },
        update: { type },
      });
    },
    async deleteEmailDomain(domain) {
      await prisma.emailDomain.delete({ where: { domain } });
    },

    // Webhook
    async createWebhook(data) {
      return prisma.webhook.create({
        data: {
          ...data,
          enabled: true,
          applicationId: data.applicationId || null,
        },
      });
    },
    async getWebhook(id) {
      return prisma.webhook.findUnique({ where: { id } });
    },
    async getWebhooksByOrganization(organizationId) {
      return prisma.webhook.findMany({ where: { organizationId } });
    },
    async getWebhooksByEvent(organizationId, event) {
      return prisma.webhook.findMany({
        where: {
          organizationId,
          enabled: true,
          events: {
            has: event,
          },
        },
      });
    },
    async updateWebhook(id, data) {
      return prisma.webhook.update({ where: { id }, data });
    },
    async deleteWebhook(id) {
      await prisma.webhook.delete({ where: { id } });
    },

    // Webhook Delivery
    async createWebhookDelivery(data) {
      return prisma.webhookDelivery.create({ data });
    },
    async getWebhookDeliveries(webhookId, limit = 50) {
      return prisma.webhookDelivery.findMany({
        where: { webhookId },
        orderBy: { attemptedAt: "desc" },
        take: limit,
      });
    },

    // RBAC & Organizations
    async createOrganization(data) {
      return prisma.organization.create({ data });
    },
    async getOrganization(id) {
      return prisma.organization.findUnique({ where: { id } });
    },
    async getOrganizationBySlug(slug) {
      return prisma.organization.findUnique({ where: { slug } });
    },
    async updateOrganization(id, data) {
      return prisma.organization.update({ where: { id }, data });
    },
    async deleteOrganization(id) {
      await prisma.organization.delete({ where: { id } });
    },

    async addOrganizationMember(data) {
      return prisma.organizationMember.create({ data });
    },
    async getOrganizationMembers(organizationId) {
      return prisma.organizationMember.findMany({ where: { organizationId } });
    },
    async removeOrganizationMember(organizationId, userId) {
      await prisma.organizationMember.delete({
        where: {
          organizationId_userId: { organizationId, userId },
        },
      });
    },

    async createRole(data) {
      return prisma.role.create({ data });
    },
    async getRoles(organizationId) {
      return prisma.role.findMany({
        where: organizationId ? { organizationId } : {},
      });
    },
    async deleteRole(id) {
      await prisma.role.delete({ where: { id } });
    },

    async assignRoleToMember(memberId, roleId) {
      await prisma.organizationMember.update({
        where: { id: memberId },
        data: { roleId },
      });
    },

    async createPermission(data) {
      return prisma.permission.create({ data });
    },
    async getPermissions() {
      return prisma.permission.findMany();
    },
    async attachPermissionToRole(roleId, permissionId) {
      await prisma.rolePermission.create({
        data: { roleId, permissionId },
      });
    },
  };
}
