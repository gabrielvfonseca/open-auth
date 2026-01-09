import "server-only";

export enum WebAuthnErrorCode {
  INVALID_CHALLENGE = "INVALID_CHALLENGE",
  INVALID_ORIGIN = "INVALID_ORIGIN",
  INVALID_RP_ID = "INVALID_RP_ID",
  INVALID_CREDENTIAL = "INVALID_CREDENTIAL",
  CREDENTIAL_NOT_FOUND = "CREDENTIAL_NOT_FOUND",
  UNSUPPORTED_ALGORITHM = "UNSUPPORTED_ALGORITHM",
  USER_NOT_VERIFIED = "USER_NOT_VERIFIED",
  USER_NOT_PRESENT = "USER_NOT_PRESENT",
  INVALID_SIGNATURE = "INVALID_SIGNATURE",
  CHALLENGE_EXPIRED = "CHALLENGE_EXPIRED",
  TOO_MANY_CREDENTIALS = "TOO_MANY_CREDENTIALS",
  CREDENTIAL_ALREADY_EXISTS = "CREDENTIAL_ALREADY_EXISTS",
  INVALID_CLIENT_DATA = "INVALID_CLIENT_DATA",
  INVALID_ATTESTATION = "INVALID_ATTESTATION",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export interface WebAuthnError {
  code: WebAuthnErrorCode;
  message: string;
  userMessage: string;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(code: WebAuthnErrorCode): string {
  const messages: Record<WebAuthnErrorCode, string> = {
    [WebAuthnErrorCode.INVALID_CHALLENGE]:
      "The authentication request has expired. Please try again.",
    [WebAuthnErrorCode.INVALID_ORIGIN]:
      "The request came from an invalid origin. Please try again.",
    [WebAuthnErrorCode.INVALID_RP_ID]:
      "The authentication request is invalid. Please try again.",
    [WebAuthnErrorCode.INVALID_CREDENTIAL]:
      "The passkey is invalid or has been removed. Please try again or use a different passkey.",
    [WebAuthnErrorCode.CREDENTIAL_NOT_FOUND]:
      "The passkey was not found. Please try again or use a different passkey.",
    [WebAuthnErrorCode.UNSUPPORTED_ALGORITHM]:
      "This passkey uses an unsupported algorithm. Please use a different passkey.",
    [WebAuthnErrorCode.USER_NOT_VERIFIED]:
      "Biometric verification failed. Please try again.",
    [WebAuthnErrorCode.USER_NOT_PRESENT]:
      "User presence check failed. Please try again.",
    [WebAuthnErrorCode.INVALID_SIGNATURE]:
      "The passkey signature is invalid. Please try again.",
    [WebAuthnErrorCode.CHALLENGE_EXPIRED]:
      "The authentication request has expired. Please try again.",
    [WebAuthnErrorCode.TOO_MANY_CREDENTIALS]:
      "You have reached the maximum number of passkeys (5). Please delete an existing passkey first.",
    [WebAuthnErrorCode.CREDENTIAL_ALREADY_EXISTS]:
      "This passkey is already registered. Please use a different passkey.",
    [WebAuthnErrorCode.INVALID_CLIENT_DATA]:
      "Invalid authentication data. Please try again.",
    [WebAuthnErrorCode.INVALID_ATTESTATION]:
      "Invalid passkey attestation. Please try again.",
    [WebAuthnErrorCode.INTERNAL_ERROR]:
      "An internal error occurred. Please try again later.",
  };

  return messages[code] || "An error occurred. Please try again.";
}

/**
 * Create a WebAuthn error
 */
export function createWebAuthnError(
  code: WebAuthnErrorCode,
  message?: string
): WebAuthnError {
  return {
    code,
    message: message || code,
    userMessage: getUserFriendlyErrorMessage(code),
  };
}

/**
 * Convert error to user-friendly message string
 */
export function toUserMessage(error: WebAuthnError | Error | unknown): string {
  if (error && typeof error === "object" && "userMessage" in error) {
    return (error as WebAuthnError).userMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An error occurred. Please try again.";
}
