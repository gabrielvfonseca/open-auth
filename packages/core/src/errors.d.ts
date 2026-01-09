import "server-only";
export declare class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly userMessage?: string | undefined;
  readonly metadata?: Record<string, unknown> | undefined;
  constructor(
    message: string,
    code: string,
    statusCode?: number,
    userMessage?: string | undefined,
    metadata?: Record<string, unknown> | undefined
  );
}
/**
 * Check if error is a Next.js redirect (should be re-thrown)
 */
export declare function isNextRedirect(error: unknown): boolean;
/**
 * Check if error should be re-thrown (redirects, etc.)
 */
export declare function shouldRethrow(error: unknown): boolean;
export declare function getUserFriendlyErrorMessage(error: unknown): string;
export declare function handleActionError<
  T extends {
    message?: string;
    error?: string | null;
  },
>(error: unknown, actionName?: string, userId?: string | number): T;
export declare const ErrorCodes: {
  readonly UNAUTHORIZED: "UNAUTHORIZED";
  readonly FORBIDDEN: "FORBIDDEN";
  readonly NOT_FOUND: "NOT_FOUND";
  readonly VALIDATION_ERROR: "VALIDATION_ERROR";
  readonly RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED";
  readonly ACCOUNT_LOCKED: "ACCOUNT_LOCKED";
  readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
  readonly EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED";
  readonly SESSION_EXPIRED: "SESSION_EXPIRED";
  readonly INTERNAL_ERROR: "INTERNAL_ERROR";
};
