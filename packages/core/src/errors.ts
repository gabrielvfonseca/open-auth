import "server-only";
import { logger } from "./logger";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly userMessage?: string,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Check if error is a Next.js redirect (should be re-thrown)
 */
export function isNextRedirect(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === "object" &&
    "digest" in error &&
    typeof (error as { digest?: string }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

/**
 * Check if error should be re-thrown (redirects, etc.)
 */
export function shouldRethrow(error: unknown): boolean {
  return isNextRedirect(error);
}

export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.userMessage || error.message;
  }

  if (error instanceof Error) {
    // Don't expose internal error messages to users
    logger.error("Unexpected error", {
      error: error.message,
      stack: error.stack,
    });
    return "An unexpected error occurred. Please try again later.";
  }

  logger.error("Unknown error type", { error });
  return "An unexpected error occurred. Please try again later.";
}

export function handleActionError<
  T extends { message?: string; error?: string | null },
>(error: unknown, actionName?: string, userId?: string | number): T {
  // Re-throw redirects and other special errors
  if (shouldRethrow(error)) {
    throw error;
  }

  const userMessage = getUserFriendlyErrorMessage(error);
  logger.error("Action error", {
    action: actionName,
    userId,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  // Support both message and error field formats
  if ("message" in ({} as T)) {
    return { message: userMessage } as T;
  }
  return { error: userMessage } as T;
}

// Common error codes
export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;
