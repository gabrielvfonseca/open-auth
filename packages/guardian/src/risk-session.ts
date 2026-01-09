import "server-only";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

export interface RiskSession {
  email: string;
  requiresTurnstile: boolean;
  createdAt: number;
}

export class RiskSessionService {
  // In-memory storage for risk sessions (expires after 10 minutes)
  private readonly riskSessions = new Map<string, RiskSession>();
  private readonly SESSION_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

  /**
   * Clean up expired sessions on access (lazy cleanup)
   */
  private cleanupExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, session] of this.riskSessions.entries()) {
      if (now - session.createdAt >= this.SESSION_EXPIRY_MS) {
        this.riskSessions.delete(sessionId);
      }
    }
  }

  /**
   * Create a temporary risk session
   */
  public async createRiskSession(
    email: string,
    requiresTurnstile: boolean
  ): Promise<string> {
    // Generate a unique session ID from email and timestamp
    const sessionData = `${email}:${Date.now()}:${Math.random()}`;
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(sessionData))
    );

    this.riskSessions.set(sessionId, {
      email,
      requiresTurnstile,
      createdAt: Date.now(),
    });

    return sessionId;
  }

  /**
   * Get a risk session by ID
   */
  public async getRiskSession(sessionId: string): Promise<RiskSession | null> {
    // Clean up expired sessions periodically
    this.cleanupExpiredSessions();

    const session = this.riskSessions.get(sessionId);
    if (!session) {
      return null;
    }

    // Check if expired
    const now = Date.now();
    if (now - session.createdAt >= this.SESSION_EXPIRY_MS) {
      this.riskSessions.delete(sessionId);
      return null;
    }

    return session;
  }

  /**
   * Delete a risk session
   */
  public async deleteRiskSession(sessionId: string): Promise<void> {
    this.riskSessions.delete(sessionId);
  }
}
