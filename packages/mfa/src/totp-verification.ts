import "server-only";
import { parseFormData, totpVerifySchema } from "@open-auth/core";
import type { TotpService } from "./totp";
import { createTOTPError, TOTPErrorCode, toUserMessage } from "./totp-errors";

export interface TOTPVerificationOptions {
  userId: string;
  formData: FormData;
  onSuccess: (userId: string) => Promise<void>;
  totpService: TotpService; // Inject service
}

export interface TOTPVerificationResult {
  success: boolean;
  message: string;
}

export async function verifyTOTPFor2FA(
  options: TOTPVerificationOptions
): Promise<TOTPVerificationResult> {
  const { userId, formData, onSuccess, totpService } = options;

  // Validate form data
  const validation = parseFormData(totpVerifySchema, formData);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error,
    };
  }

  const { code } = validation.data;

  // Check rate limit
  if (!totpService.checkRateLimit(userId)) {
    return {
      success: false,
      message: toUserMessage(
        createTOTPError(TOTPErrorCode.RATE_LIMIT_EXCEEDED)
      ),
    };
  }

  // Consume rate limit
  if (!totpService.consumeRateLimit(userId)) {
    return {
      success: false,
      message: toUserMessage(
        createTOTPError(TOTPErrorCode.RATE_LIMIT_EXCEEDED)
      ),
    };
  }

  // Verify TOTP code
  const verification = await totpService.verifyTOTPCode(userId, code);
  if (!verification.valid) {
    return {
      success: false,
      message: toUserMessage(createTOTPError(TOTPErrorCode.INVALID_CODE)),
    };
  }

  // Reset rate limit on success
  totpService.resetRateLimit(userId);

  // Call success callback
  await onSuccess(userId);

  return {
    success: true,
    message: "",
  };
}
