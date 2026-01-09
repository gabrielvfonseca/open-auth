export type TelemetryEventType =
  | "auth.login"
  | "auth.logout"
  | "auth.register"
  | "auth.password_reset"
  | "auth.mfa_challenge"
  | "api.request"
  | "api.error"
  | "session.created"
  | "session.expired";

export interface TelemetryEvent {
  type: TelemetryEventType;
  timestamp: number;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface MetricData {
  name: string;
  value: number;
  unit?: string;
  tags?: Record<string, string>;
  timestamp: number;
}
