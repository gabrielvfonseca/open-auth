# Audit API Reference

## Primary Services

### `recordEvent(event: AuditEventDto)`
Saves a new audit event to the permanent record.

### `queryAuditLogs(filters: AuditFilters)`
Retrieves events based on actor ID, action type, or time range.

## Types

### `AuditEvent`
The core interface for an audit record.
- `id`: Unique identifier
- `actorId`: ID of the performing entity
- `action`: Type of action (e.g., 'auth.login.success')
- `timestamp`: RFC3339 timestamp
- `metadata`: Context-specific data (e.g., IP address)
