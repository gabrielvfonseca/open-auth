export type VerificationType = "email" | "phone" | "email_change";

export type VerificationStatus = "pending" | "verified" | "expired" | "failed";

export interface VerificationResult {
  success: boolean;
  status: VerificationStatus;
  userId?: string;
  email?: string;
}

export interface SendVerificationResult {
  success: boolean;
  expiresAt: Date;
}
