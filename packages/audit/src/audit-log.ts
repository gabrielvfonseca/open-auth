import "server-only";
import { generateUUID, logger } from "@open-auth/core";
import type {
  AuditEvent,
  AuditLogFilter,
  CreateAuditLogInput,
} from "./audit-types";

// In-memory store for now - can be replaced with database implementation
const auditLogs: AuditEvent[] = [];

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  input: CreateAuditLogInput
): Promise<AuditEvent> {
  const event: AuditEvent = {
    id: generateUUID(),
    type: input.type,
    userId: input.userId ?? null,
    targetUserId: input.targetUserId ?? null,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
    metadata: input.metadata ?? {},
    createdAt: new Date(),
  };

  auditLogs.push(event);

  logger.info("Audit event created", {
    eventId: event.id,
    type: event.type,
    userId: event.userId,
  });

  return event;
}

/**
 * Get audit logs with optional filtering
 */
export async function getAuditLogs(
  filter: AuditLogFilter = {}
): Promise<AuditEvent[]> {
  let results = [...auditLogs];

  if (filter.userId) {
    results = results.filter((e) => e.userId === filter.userId);
  }

  if (filter.targetUserId) {
    results = results.filter((e) => e.targetUserId === filter.targetUserId);
  }

  if (filter.type) {
    const types = Array.isArray(filter.type) ? filter.type : [filter.type];
    results = results.filter((e) => types.includes(e.type));
  }

  if (filter.startDate) {
    results = results.filter((e) => e.createdAt >= filter.startDate!);
  }

  if (filter.endDate) {
    results = results.filter((e) => e.createdAt <= filter.endDate!);
  }

  // Sort by newest first
  results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Apply pagination
  const offset = filter.offset ?? 0;
  const limit = filter.limit ?? 100;
  return results.slice(offset, offset + limit);
}

/**
 * Get a single audit log by ID
 */
export async function getAuditLogById(id: string): Promise<AuditEvent | null> {
  return auditLogs.find((e) => e.id === id) ?? null;
}
