import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
export interface EmailFilterConfig {
  allowlist?: string[];
  blocklist?: string[];
  blockDisposable?: boolean;
}
export declare class EmailDomainFilterService {
  private readonly adapter;
  private readonly config;
  constructor(adapter: DatabaseAdapter, config?: EmailFilterConfig);
  isEmailDomainAllowed(email: string): Promise<boolean>;
  addEmailDomainToConfig(
    domain: string,
    type: "allowlist" | "blocklist"
  ): Promise<void>;
  removeEmailDomainFromConfig(domain: string): Promise<void>;
}
