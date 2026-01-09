export type AuditEventType =
  | "user.login"
  | "user.logout"
  | "user.register"
  | "user.password_change"
  | "user.password_reset"
  | "user.email_change"
  | "user.email_verified"
  | "user.mfa_enabled"
  | "user.mfa_disabled"
  | "user.passkey_registered"
  | "user.passkey_removed"
  | "user.account_locked"
  | "user.account_unlocked"
  | "user.deleted"
  | "session.created"
  | "session.terminated"
  | "session.expired"
  | "device.registered"
  | "device.trusted"
  | "device.removed"
  | "oauth.authorization_granted"
  | "oauth.authorization_revoked"
  | "oauth.token_issued"
  | "oauth.token_revoked"
  | "api_key.created"
  | "api_key.revoked"
  | "admin.user_updated"
  | "admin.role_assigned"
  | "admin.policy_updated";

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  userId: string | null;
  targetUserId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface CreateAuditLogInput {
  type: AuditEventType;
  userId?: string | null;
  targetUserId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}

export interface AuditLogFilter {
  userId?: string;
  targetUserId?: string;
  type?: AuditEventType | AuditEventType[];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}
