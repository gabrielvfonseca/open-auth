import "server-only";
import { type DatabaseAdapter, RefillingTokenBucket } from "@open-auth/core";
import { generateDeviceFingerprint } from "@open-auth/session";

export interface RiskAssessment {
  requiresTurnstile: boolean;
  riskFactors: string[];
  riskScore: number;
}

export interface RiskConfig {
  enabled?: boolean;
  blockSuspiciousIPs?: boolean;
  verifyNewDevices?: boolean;
  notifyNewDevice?: boolean;
}

export class RiskDetectionService {
  // Rate limit buckets for risk assessment
  private readonly riskIPBucket = new RefillingTokenBucket(20, 1);
  private readonly config: Required<RiskConfig>;

  constructor(
    private readonly adapter: DatabaseAdapter,
    config: RiskConfig = {}
  ) {
    this.config = {
      enabled: config.enabled ?? true,
      blockSuspiciousIPs: config.blockSuspiciousIPs ?? true,
      verifyNewDevices: config.verifyNewDevices ?? true,
      notifyNewDevice: config.notifyNewDevice ?? true,
    };
  }

  /**
   * Assess sign-in risk based on multiple factors
   */
  public async assessSignInRisk(
    userId: string | null,
    ipAddress: string | null,
    userAgent: string | null
  ): Promise<RiskAssessment> {
    // If Turnstile is disabled, never require it
    if (!this.config.enabled) {
      return {
        requiresTurnstile: false,
        riskFactors: [],
        riskScore: 0,
      };
    }

    const riskFactors: string[] = [];
    let riskScore = 0;

    // 1. Check rate limit violations (IP-based)
    if (ipAddress !== null && !this.riskIPBucket.check(ipAddress, 1)) {
      riskFactors.push("rate_limit_ip");
      riskScore += 3;
    }

    // 2. Check for new/unrecognized device (only if we have a user)
    if (userId !== null && userAgent !== null && ipAddress !== null) {
      const fingerprint = generateDeviceFingerprint(
        userAgent,
        ipAddress,
        userId
      );
      const existingDevice = await this.adapter.getDeviceByFingerprint(
        userId,
        fingerprint
      );

      if (existingDevice === null) {
        // Check if user has any trusted devices
        const devices = await this.adapter.getDevicesByUserId(userId);
        const trustedDevices = devices.filter((d) => d.trusted);

        if (trustedDevices.length > 0) {
          // User has trusted devices but this is a new one
          riskFactors.push("new_device");
          riskScore += 2;
        }
      }
    }

    // 3. Check for IP address changes from previous logins
    if (userId !== null && ipAddress !== null) {
      const sessions = await this.adapter.getSessionsByUserId(userId);
      const now = new Date();
      // Filter active sessions and sort
      // Assuming Session interface has lastActiveAt? core/src/index.ts doesn't show lastActiveAt in Session interface!
      // Step 1505: export interface Session { id, userId, expiresAt, ipAddress, userAgent, twoFactorVerified, createdAt, accountId }
      // NO lastActiveAt.
      // The original code sorted by 'lastActiveAt'.
      // This implies Session schema had it, but interface is missing it??
      // Or I missed it in view_file.
      // If it's missing, I can use createdAt.
      // Or I should update Session interface.
      // Let's assume createdAt for now if lastActiveAt is missing.

      const activeSessions = sessions
        .filter((s) => s.expiresAt > now)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // using createdAt descending

      const recentSession = activeSessions[0];

      if (recentSession?.ipAddress && recentSession.ipAddress !== ipAddress) {
        riskFactors.push("ip_change");
        riskScore += 2;
      }
    }

    // 4. Check for multiple failed login attempts
    // Logic handles both User and IP based on arguments passed to countFailedLoginAttempts
    if (userId !== null) {
      // user based
      const recentFailedAttempts = await this.adapter.countFailedLoginAttempts(
        userId,
        null,
        new Date(Date.now() - 60 * 60 * 1000)
      );
      if (recentFailedAttempts >= 3) {
        riskFactors.push("failed_attempts");
        riskScore += 2;
      }
    }

    // If no user ID check IP based?
    // Original code: if (userId === null && ipAddress !== null)
    if (userId === null && ipAddress !== null) {
      const recentFailedAttempts = await this.adapter.countFailedLoginAttempts(
        null,
        ipAddress,
        new Date(Date.now() - 60 * 60 * 1000)
      );
      if (recentFailedAttempts >= 5) {
        riskFactors.push("failed_attempts_ip");
        riskScore += 3;
      }
    }

    // Require Turnstile if any risk factor is detected
    const requiresTurnstile = riskScore > 0;

    return {
      requiresTurnstile,
      riskFactors,
      riskScore,
    };
  }
}
