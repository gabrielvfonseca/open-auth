import "server-only";
import { type DatabaseAdapter } from "@open-auth/core";
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
export declare class RiskDetectionService {
  private readonly adapter;
  private readonly riskIPBucket;
  private readonly config;
  constructor(adapter: DatabaseAdapter, config?: RiskConfig);
  /**
   * Assess sign-in risk based on multiple factors
   */
  assessSignInRisk(
    userId: string | null,
    ipAddress: string | null,
    userAgent: string | null
  ): Promise<RiskAssessment>;
}
