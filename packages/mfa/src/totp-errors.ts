import "server-only";

export enum TOTPErrorCode {
  INVALID_CODE = "INVALID_CODE",
  EXPIRED_CODE = "EXPIRED_CODE",
  CLOCK_SKEW = "CLOCK_SKEW",
  TOO_MANY_ATTEMPTS = "TOO_MANY_ATTEMPTS",
  INVALID_KEY = "INVALID_KEY",
  CREDENTIAL_NOT_FOUND = "CREDENTIAL_NOT_FOUND",
  INVALID_INPUT = "INVALID_INPUT",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  SETUP_FAILED = "SETUP_FAILED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export interface TOTPError {
  code: TOTPErrorCode;
  message: string;
  userMessage: string;
}

export function getUserFriendlyErrorMessage(code: TOTPErrorCode): string {
  const messages: Record<TOTPErrorCode, string> = {
    [TOTPErrorCode.INVALID_CODE]:
      "The verification code is incorrect. Please check your authenticator app and try again.",
    [TOTPErrorCode.EXPIRED_CODE]:
      "The verification code has expired. Please enter a new code from your authenticator app.",
    [TOTPErrorCode.CLOCK_SKEW]:
      "There may be a time synchronization issue. Please check your device's clock and try again.",
    [TOTPErrorCode.TOO_MANY_ATTEMPTS]:
      "Too many failed attempts. Please wait a moment before trying again.",
    [TOTPErrorCode.INVALID_KEY]:
      "The TOTP key is invalid. Please set up your authenticator app again.",
    [TOTPErrorCode.CREDENTIAL_NOT_FOUND]:
      "No authenticator app found. Please set up your authenticator app first.",
    [TOTPErrorCode.INVALID_INPUT]: "Please enter a valid 6-digit code.",
    [TOTPErrorCode.RATE_LIMIT_EXCEEDED]:
      "Too many requests. Please wait a moment before trying again.",
    [TOTPErrorCode.SETUP_FAILED]:
      "Failed to set up authenticator app. Please try again.",
    [TOTPErrorCode.INTERNAL_ERROR]:
      "An internal error occurred. Please try again later.",
  };

  return messages[code] || "An error occurred. Please try again.";
}

export function createTOTPError(
  code: TOTPErrorCode,
  message?: string
): TOTPError {
  return {
    code,
    message: message || code,
    userMessage: getUserFriendlyErrorMessage(code),
  };
}

export function toUserMessage(error: TOTPError | Error | unknown): string {
  if (error && typeof error === "object" && "userMessage" in error) {
    return (error as TOTPError).userMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An error occurred. Please try again.";
}
