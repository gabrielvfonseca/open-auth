import "server-only";
export interface RiskSession {
  email: string;
  requiresTurnstile: boolean;
  createdAt: number;
}
export declare class RiskSessionService {
  private readonly riskSessions;
  private readonly SESSION_EXPIRY_MS;
  /**
   * Clean up expired sessions on access (lazy cleanup)
   */
  private cleanupExpiredSessions;
  /**
   * Create a temporary risk session
   */
  createRiskSession(email: string, requiresTurnstile: boolean): Promise<string>;
  /**
   * Get a risk session by ID
   */
  getRiskSession(sessionId: string): Promise<RiskSession | null>;
  /**
   * Delete a risk session
   */
  deleteRiskSession(sessionId: string): Promise<void>;
}
