import "server-only";
export interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}
export interface TurnstileConfig {
  enabled?: boolean;
  siteKey?: string;
  secretKey?: string;
}
export declare class TurnstileService {
  private readonly config;
  constructor(config?: TurnstileConfig);
  verifyTurnstileToken(
    token: string,
    ipAddress: string | null
  ): Promise<boolean>;
}
