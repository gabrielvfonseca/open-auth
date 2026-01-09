import "server-only";
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
export declare class AuditLogService {
  createAuditLog(
    eventType: AuditEventType,
    options: {
      userId?: string;
      metadata?: AuditLogMetadata;
    }
  ): Promise<void>;
  getAuditLogs(_options: {
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
  >;
  getAuditLogsByUser(
    userId: string,
    limit?: number
  ): Promise<ReturnType<typeof this.getAuditLogs>>;
  getAuditLogsByEventType(
    eventType: AuditEventType,
    limit?: number
  ): Promise<ReturnType<typeof this.getAuditLogs>>;
}
export declare const auditLogService: AuditLogService;
