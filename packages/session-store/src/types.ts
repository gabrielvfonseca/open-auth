export interface SessionData {
  userId: string;
  createdAt: number;
  expiresAt: number;
  twoFactorVerified: boolean;
  deviceId?: string;
  metadata?: Record<string, unknown>;
}

export interface SessionStore {
  get(sessionId: string): Promise<SessionData | null>;
  set(sessionId: string, data: SessionData, ttlSeconds?: number): Promise<void>;
  delete(sessionId: string): Promise<void>;
  touch(sessionId: string, ttlSeconds?: number): Promise<void>;
}
