import type { User } from "@open-auth/core";
import { DeviceService } from "@open-auth/device";
import {
  AccountLockoutService,
  EmailDomainFilterService,
  globalPOSTRateLimit,
  RiskDetectionService,
  RiskSessionService,
  TurnstileService,
} from "@open-auth/guardian";
import { MagicLinkService } from "@open-auth/magic";
import {
  getTOTPConfig,
  MfaService,
  RecoveryCodeService,
  TotpService,
} from "@open-auth/mfa";
import { OAuthService } from "@open-auth/oauth";
import {
  WebAuthnService,
  WebAuthnVerificationService,
} from "@open-auth/passkey";
import {
  PasswordHistoryService,
  PasswordResetService,
  PasswordService,
} from "@open-auth/password";
import { RecoveryService } from "@open-auth/recovery";
import {
  type Session,
  type SessionFlags,
  SessionService,
} from "@open-auth/session";
import { SsoService } from "@open-auth/sso";
import { type TokenService, tokenService } from "@open-auth/token";
import { VerificationService } from "@open-auth/verification";
import { WebhookService } from "@open-auth/webhook";
import { headers } from "next/headers";
import { AccountDeletionService } from "./account-deletion";
import { actionWrapperService } from "./action-wrapper";
import type { AuthConfig } from "./config";
import { EmailService } from "./email";
import {
  type EmailVerification,
  EmailVerificationService,
} from "./email-verification";
import { AccountService } from "./services/account-service";
import { UserService } from "./services/user-service";
import { UsernameService } from "./username";

export interface SignInResult {
  success: boolean;
  message?: string;
  session?: Session;
  sessionToken?: string;
  requiresTurnstile?: boolean;
  riskSessionId?: string;
}

export interface SignUpResult {
  success: boolean;
  message?: string;
  user?: User;
  account?: unknown;
  session?: Session;
  sessionToken?: string;
  verification?: EmailVerification;
}

export interface PasskeySignInResult extends SignInResult {
  userId?: string;
}

export interface AuthorizationContext {
  [key: string]: string | number | boolean | null;
}

export class AuthClient {
  // Domain Services
  public readonly user: UserService;
  public readonly account: AccountService;
  public readonly session: SessionService;
  public readonly password: PasswordService;
  public readonly passwordHistory: PasswordHistoryService;
  public readonly passwordReset: PasswordResetService;
  public readonly mfa: {
    totp: TotpService;
    service: MfaService;
    recovery: RecoveryCodeService;
    getTOTPConfig: typeof getTOTPConfig;
  };
  public readonly passkey: WebAuthnService;
  public readonly passkeyVerification: WebAuthnVerificationService;
  public readonly magic: MagicLinkService;
  public readonly oauth: OAuthService;
  public readonly sso: SsoService;
  public readonly guardian: {
    lockout: AccountLockoutService;
    risk: RiskDetectionService;
    turnstile: TurnstileService;
    emailFilter: EmailDomainFilterService;
  };
  public readonly riskSession: RiskSessionService;
  public readonly device: DeviceService;
  public readonly recovery: RecoveryService;
  public readonly verification: VerificationService;
  public readonly token: TokenService;
  public readonly webhook: WebhookService;

  // Auth Package Services
  public readonly emailVerification: EmailVerificationService;
  public readonly accountDeletion: AccountDeletionService;
  public readonly username: UsernameService;
  public readonly email: EmailService;

  public readonly config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
    const adapter = config.database;

    // Core services with adapter injection
    this.user = new UserService(adapter);
    this.account = new AccountService(
      adapter,
      (userId) => this.user.getUserById(userId),
      (email, username) => this.user.createUser(email, username)
    );
    this.session = new SessionService(adapter, config.session);
    this.password = new PasswordService(config.password);
    this.passwordHistory = new PasswordHistoryService(adapter, this.password);
    this.passwordReset = new PasswordResetService(adapter);

    // MFA services
    const totpService = new TotpService(adapter, config.mfa?.totp);
    const mfaService = new MfaService(adapter, config.mfa);
    const recoveryCodeService = new RecoveryCodeService(
      adapter,
      config.mfa?.recoveryCodes
    );

    this.mfa = {
      totp: totpService,
      service: mfaService,
      recovery: recoveryCodeService,
      getTOTPConfig,
    };

    // Passkey/WebAuthn
    this.passkey = new WebAuthnService(adapter, config.passkey);
    this.passkeyVerification = new WebAuthnVerificationService(this.passkey);

    // OAuth, Magic Link, SSO
    this.magic = new MagicLinkService(adapter, config.magicLink);
    this.oauth = new OAuthService(adapter, config.oauth);
    this.sso = new SsoService(adapter, config.sso);

    // Device & recovery
    this.device = new DeviceService(adapter, config.device);
    this.recovery = new RecoveryService(adapter);

    // Verification (needs TOTP and WebAuthn services)
    this.verification = new VerificationService(
      adapter,
      this.mfa.totp,
      this.passkeyVerification,
      config.email?.verification
    );

    this.token = tokenService;
    // Webhook
    this.webhook = new WebhookService(adapter, config.webhook);

    // Guardian services
    this.riskSession = new RiskSessionService();
    // Guardian services
    const accountLockoutService = new AccountLockoutService(
      adapter,
      config.guardian?.lockout
    );
    const riskDetectionService = new RiskDetectionService(
      adapter,
      config.guardian?.risk
    );
    const turnstileService = new TurnstileService(config.guardian?.turnstile);
    const emailDomainFilterService = new EmailDomainFilterService(
      adapter,
      config.guardian?.emailFilter
    );

    this.guardian = {
      lockout: accountLockoutService,
      risk: riskDetectionService,
      turnstile: turnstileService,
      emailFilter: emailDomainFilterService,
    };
    // Local auth services
    this.emailVerification = new EmailVerificationService(adapter);
    this.accountDeletion = new AccountDeletionService(
      adapter,
      this.session,
      this.account
    );
    this.username = new UsernameService(adapter);
    this.email = new EmailService(adapter);

    // Initialize plugins
    if (config.plugins) {
      for (const plugin of config.plugins) {
        if (plugin.init) {
          plugin.init(this);
        }
      }
    }
  }

  /**
   * Get current session and user (orchestrated)
   */
  public async getCurrentSession(): Promise<
    { session: Session; user: User } | { session: null; user: null }
  > {
    const { session } = await this.session.getCurrentSession();
    if (!session) {
      return { session: null, user: null };
    }
    const user = await this.user.getUserById(session.userId);
    if (!user) {
      return { session: null, user: null };
    }
    return { session, user };
  }

  /**
   * Validate session token and return user (orchestrated)
   */
  public async validateSessionToken(
    token: string
  ): Promise<{ session: Session; user: User } | { session: null; user: null }> {
    const { session } = await this.session.validateSessionToken(token);
    if (!session) {
      return { session: null, user: null };
    }
    const user = await this.user.getUserById(session.userId);
    if (!user) {
      return { session: null, user: null };
    }
    return { session, user };
  }

  /**
   * Assess sign-in risk (internal)
   */
  private async assessRisk(
    email: string,
    clientIP: string | null,
    userAgent: string | null
  ) {
    const user = await this.user.getUserFromEmail(email);
    const riskAssessment = await this.guardian.risk.assessSignInRisk(
      user?.id ?? null,
      clientIP,
      userAgent
    );
    return { user, riskAssessment };
  }

  /**
   * Orchestrated Email/Password Sign-In
   */
  public async signInWithEmailPassword(
    email: string,
    password: string,
    options: {
      rememberMe?: boolean;
      turnstileToken?: string;
      riskSessionId?: string;
      clientIP?: string | null;
    } = {}
  ): Promise<SignInResult> {
    if (!globalPOSTRateLimit()) {
      return { success: false, message: "Too many requests" };
    }

    const clientIP = options.clientIP ?? headers().get("X-Forwarded-For");
    const userAgent = headers().get("user-agent") || null;

    const { user, riskAssessment } = await this.assessRisk(
      email,
      clientIP,
      userAgent
    );

    if (riskAssessment.requiresTurnstile && !options.turnstileToken) {
      const newRiskSessionId = await this.riskSession.createRiskSession(
        email,
        true
      );
      return {
        success: false,
        message: "TURNSTILE_REQUIRED",
        requiresTurnstile: true,
        riskSessionId: newRiskSessionId,
      };
    }

    if (options.turnstileToken) {
      const valid = await this.guardian.turnstile.verifyTurnstileToken(
        options.turnstileToken,
        clientIP ?? null
      );
      if (!valid) {
        return {
          success: false,
          message: "Verification failed. Please try again.",
        };
      }
    }

    if (!user) {
      if (clientIP) {
        await this.guardian.lockout.recordFailedLoginAttempt(null, clientIP);
      }
      return { success: false, message: "Account does not exist" };
    }

    // Lockout check
    if (await this.guardian.lockout.isAccountLocked(user.id)) {
      return {
        success: false,
        message: "Account is locked. Please try again later.",
      };
    }

    // Account & Password
    const account = await this.account.getAccountByEmail(
      "email_password",
      email
    );
    if (!account) {
      return {
        success: false,
        message: "This account does not have a password.",
      };
    }

    const passwordHash = await this.account.getAccountPasswordHash(account.id);
    if (!passwordHash) {
      return {
        success: false,
        message: "This account does not have a password.",
      };
    }

    const validPassword = await this.password.verifyPasswordHash(
      passwordHash,
      password
    );
    if (!validPassword) {
      await this.guardian.lockout.recordFailedLoginAttempt(
        user.id,
        clientIP ?? null
      );
      return { success: false, message: "Invalid password" };
    }

    // Success flow
    await this.guardian.lockout.resetFailedLoginAttempts(user.id);
    await this.account.updateAccountLastUsed(account.id);

    const sessionFlags: SessionFlags = {
      twoFactorVerified: false,
      rememberMe: options.rememberMe,
      isPersistent: options.rememberMe,
    };

    const sessionToken = this.session.generateSessionToken();
    const session = await this.session.createSession(
      sessionToken,
      user.id,
      sessionFlags,
      account.id
    );
    this.session.setSessionTokenCookie(sessionToken, session.expiresAt);

    return { success: true, session, sessionToken };
  }

  /**
   * Orchestrated Passkey Sign-In (Discovery/Passwordless)
   */
  public async signInWithPasskey(
    data: unknown,
    options: {
      rememberMe?: boolean;
      clientIP?: string | null;
    } = {}
  ): Promise<PasskeySignInResult> {
    if (!globalPOSTRateLimit()) {
      return { success: false, message: "Too many requests" };
    }

    const verification = await this.passkeyVerification.verifyWebAuthnAssertion(
      data,
      {
        getCredential: (credentialId: Uint8Array) =>
          this.passkey.getPasskeyCredential(credentialId),
        updateLastUsed: (credentialId: Uint8Array) =>
          this.passkey.updatePasskeyLastUsed(credentialId),
      }
    );

    if (!(verification.success && verification.userId)) {
      return {
        success: false,
        message: verification.error || "Authentication failed",
      };
    }

    const userId = verification.userId;
    const user = await this.user.getUserById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const sessionFlags: SessionFlags = {
      twoFactorVerified: true,
      rememberMe: options.rememberMe,
      isPersistent: options.rememberMe,
    };

    const sessionToken = this.session.generateSessionToken();
    const session = await this.session.createSession(
      sessionToken,
      userId,
      sessionFlags
    );
    this.session.setSessionTokenCookie(sessionToken, session.expiresAt);

    return { success: true, session, sessionToken, userId };
  }

  /**
   * Orchestrated Sign-Up
   */
  public async signUp(
    email: string,
    username: string,
    password: string,
    _options: {
      clientIP?: string | null;
    }
  ): Promise<SignUpResult> {
    if (!globalPOSTRateLimit()) {
      return { success: false, message: "Too many requests" };
    }

    const emailDomainAllowed =
      await this.guardian.emailFilter.isEmailDomainAllowed(email);
    if (!emailDomainAllowed) {
      return { success: false, message: "This email domain is not allowed" };
    }

    const emailAvailable = await this.account.checkEmailAvailability(email);
    if (!emailAvailable) {
      return { success: false, message: "Email is already used" };
    }

    const strongPassword = await this.password.verifyPasswordStrength(password);
    if (!strongPassword) {
      return { success: false, message: "Password is too weak." };
    }

    // Creation
    const user = await this.user.createUser(email, username);
    const account = await this.account.createEmailPasswordAccount(
      user.id,
      email,
      password
    );

    // Verification flow
    const verification = await this.emailVerification.createEmailVerification(
      user.id,
      user.email
    );
    this.emailVerification.setEmailVerificationCookie(verification);

    // Session
    const sessionFlags: SessionFlags = { twoFactorVerified: false };
    const sessionToken = this.session.generateSessionToken();
    const session = await this.session.createSession(
      sessionToken,
      user.id,
      sessionFlags,
      account.id
    );
    this.session.setSessionTokenCookie(sessionToken, session.expiresAt);

    return {
      success: true,
      user,
      account,
      session,
      sessionToken,
      verification,
    };
  }

  public withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
    action: T,
    actionName?: string
  ): T {
    return actionWrapperService.withErrorHandling(action, actionName);
  }
}

/**
 * Create an AuthClient with the provided configuration
 */
/** @public */
export function createAuthClient(config: AuthConfig): AuthClient {
  return new AuthClient(config);
}
