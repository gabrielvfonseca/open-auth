import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";
import { logger } from "@open-auth/core";

// Common disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "temp-mail.org",
  "getnada.com",
  "mohmal.com",
  "fakeinbox.com",
];

export interface EmailFilterConfig {
  allowlist?: string[];
  blocklist?: string[];
  blockDisposable?: boolean;
}

export class EmailDomainFilterService {
  private readonly config: Required<EmailFilterConfig>;

  constructor(
    private readonly adapter: DatabaseAdapter,
    config: EmailFilterConfig = {}
  ) {
    this.config = {
      allowlist: config.allowlist ?? [],
      blocklist: config.blocklist ?? [],
      blockDisposable: config.blockDisposable ?? true,
    };
  }

  public async isEmailDomainAllowed(email: string): Promise<boolean> {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) {
      return false;
    }

    // 1. Check strict allowlist from config first
    if (this.config.allowlist.length > 0) {
      if (!this.config.allowlist.includes(domain)) {
        logger.info("Email domain not in allowlist", { domain, email });
        return false;
      }
      return true;
    }

    // 2. Check blocklist from config
    if (this.config.blocklist.includes(domain)) {
      logger.info("Email domain blocked", { domain, email });
      return false;
    }

    // 3. Check disposable domains if configured
    if (
      this.config.blockDisposable &&
      DISPOSABLE_EMAIL_DOMAINS.includes(domain)
    ) {
      logger.info("Disposable email domain detected", { domain, email });
      return false;
    }

    // 4. Check database blocklist/allowlist as fallback?
    // Original code checked DB.
    // Now we prefer config, but should we still check DB?
    // Configuration implies static config source?
    // Let's keep DB check as dynamic source?
    // Or replace completely?
    // The previous implementation was purely DB based + hardcoded disposable.
    // The new config allows static definition.
    // Let's keep DB checks for dynamic capability but prioritize config.

    // Check blocklist from DB
    const blocklistEntry = await this.adapter.getEmailDomain(domain);
    if (blocklistEntry && blocklistEntry.type === "blocklist") {
      logger.info("Email domain blocked (DB)", { domain, email });
      return false;
    }

    // Check allowlist from DB?
    // If strict match, we already returned. config allowlist > db allowlist?
    // Or we allow if EITHER allowlist permits it?
    // Complex. Let's assume Config OR DB allowlist.
    // If config allowlist is empty, we fall back to DB allowlist logic?

    const dbAllowlistCount = await this.adapter.countEmailDomains("allowlist");
    if (dbAllowlistCount > 0) {
      const allowlistEntry = await this.adapter.getEmailDomain(domain);
      if (!allowlistEntry || allowlistEntry.type !== "allowlist") {
        // Blocked because DB has allowlist and this isn't in it
        logger.info("Email domain not in allowlist (DB)", { domain, email });
        return false;
      }
    }

    return true;
  }

  public async addEmailDomainToConfig(
    domain: string,
    type: "allowlist" | "blocklist"
  ): Promise<void> {
    await this.adapter.upsertEmailDomain(domain, type);
    logger.info("Email domain config updated", { domain, type });
  }

  public async removeEmailDomainFromConfig(domain: string): Promise<void> {
    await this.adapter.deleteEmailDomain(domain);
    logger.info("Email domain config removed", { domain });
  }
}
