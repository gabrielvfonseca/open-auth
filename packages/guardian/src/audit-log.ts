// TODO: Replace audit log functionality - AuditLog model removed from schema
import "server-only";
import { logger } from "@open-auth/core";
import { headers } from "next/headers";

export type AuditEventType =
  | "user.sign_up"
  | "user.sign_in"
  | "user.logout"
  | "user.password_change"
  | "user.password_reset"
  | "user.email_change"
  | "user.email_verified"
  | "user.username_change"
  | "user.account_deleted"
  | "user.account_locked"
  | "user.account_unlocked"
  | "2fa.totp_enabled"
  | "2fa.totp_disabled"
  | "2fa.passkey_added"
  | "2fa.passkey_removed"
  | "2fa.security_key_added"
  | "2fa.security_key_removed"
  | "2fa.recovery_codes_regenerated"
  | "oauth.linked"
  | "oauth.unlinked"
  | "session.created"
  | "session.revoked"
  | "api.key_created"
  | "api.key_revoked"
  | "api.key_rotated"
  | "suspicious_activity.detected"
  | "admin.user_managed"
  | "admin.system_config_changed";

interface AuditLogMetadata {
  [key: string]: unknown;
}

export class AuditLogService {
  public async createAuditLog(
    eventType: AuditEventType,
    options: {
      userId?: string;
      metadata?: AuditLogMetadata;
    }
  ): Promise<void> {
    try {
      const headersList = headers();
      const ipAddress =
        headersList.get("X-Forwarded-For") ||
        headersList.get("x-forwarded-for") ||
        null;
      const userAgent = headersList.get("user-agent") || null;

      // TODO: AuditLog model removed from schema - logging to logger only for now

      logger.info("Audit log created", {
        eventType,
        userId: options.userId,
        ipAddress,
        userAgent,
        metadata: options.metadata,
      });
    } catch (error) {
      logger.error("Failed to create audit log", {
        eventType,
        userId: options.userId,
        error: error instanceof Error ? error.message : String(error),
      });
      // Don't throw - audit logging should not break the application
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getAuditLogs(_options: {
    userId?: string;
    eventType?: AuditEventType;
    limit?: number;
    offset?: number;
  }): Promise<
    Array<{
      id: string;
      userId: string | null;
      eventType: string;
      ipAddress: string | null;
      userAgent: string | null;
      metadata: string | null;
      createdAt: Date;
    }>
  > {
    // TODO: AuditLog model removed from schema - returning empty array for now
    return [];
  }

  public async getAuditLogsByUser(
    userId: string,
    limit = 100
  ): Promise<ReturnType<typeof this.getAuditLogs>> {
    return this.getAuditLogs({ userId, limit });
  }

  public async getAuditLogsByEventType(
    eventType: AuditEventType,
    limit = 100
  ): Promise<ReturnType<typeof this.getAuditLogs>> {
    return this.getAuditLogs({ eventType, limit });
  }
}

export const auditLogService = new AuditLogService();
