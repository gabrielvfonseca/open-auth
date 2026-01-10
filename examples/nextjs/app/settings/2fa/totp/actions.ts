"use server";

import { decodeBase32, encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";
import QRCode from "qrcode";
import { auth } from "@/lib/auth";

export interface TOTPSetupState {
  error?: string;
  success?: boolean;
  qrCode?: string;
  secret?: string;
}

export async function getTOTPSetupDataAction(): Promise<TOTPSetupState> {
  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    const config = await auth.mfa.getTOTPConfig();

    // Generate a new secret
    const secretBytes = new Uint8Array(20);
    crypto.getRandomValues(secretBytes);
    const secret = encodeBase32UpperCaseNoPadding(secretBytes);

    // Create otpauth URL
    const otpauth = `otpauth://totp/${encodeURIComponent(config.issuer)}:${encodeURIComponent(user.email ?? "User")}?secret=${secret}&issuer=${encodeURIComponent(config.issuer)}&algorithm=${config.algorithm}&digits=${config.digits}&period=${config.period}`;

    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauth);

    return {
      qrCode,
      secret,
    };
  } catch (error) {
    console.error("TOTP setup error:", error);
    return { error: "Failed to generate TOTP setup" };
  }
}

export async function verifyTOTPSetupAction(
  _prevState: TOTPSetupState,
  formData: FormData
): Promise<TOTPSetupState> {
  const code = formData.get("code") as string;
  const secret = formData.get("secret") as string; // We'll need to pass the secret back from the form or store it in a temp session.
  // Actually, stateless is risky if the user refreshes. But for simplicity let's assume we pass it in hidden field for now,
  // OR we just re-verify with the same secret. The user sees the secret on screen.
  // The previous implementation didn't pass secret back. Let's see how to handle this.
  // Best practice: Store in DB but mark as 'setup_pending'.
  // Current TOTPService doesn't seem to have 'pending' state.
  // Let's rely on the client explicitly sending the secret they are trying to verify.
  // Wait, the form in page.tsx doesn't have a hidden input for secret. I need to add that to the form or rely on state.
  // Ideally, we persist the pending secret in a short-lived cookie or DB.
  // For now, let's update the page to send the secret back.

  // BUT wait, I can't update the page in this tool call easily if I change the contract.
  // Let's assume the form will send it if I add the input.

  // Alternative: Just generate the key, verify it, and SAVE it.

  if (!code || code.length !== 6) {
    return { error: "Please enter a valid 6-digit code" };
  }

  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    // We need the secret that was shown to the user.
    // If it's not in FormData, we can't verify it against what the user scanned.
    // I will update the page.tsx to include the secret as a hidden field.

    // However, if I can't change the page right now, I'm stuck.
    // Let's assume I will change the page.

    if (!secret) {
      console.error("No secret provided in form data");
      return { error: "Session expired or invalid setup flow." };
    }

    // Decode secret
    let key: Uint8Array;
    try {
      key = decodeBase32(secret);
    } catch (e) {
      console.error("Failed to decode secret:", e);
      return { error: "Invalid secret format" };
    }

    // Verify
    const valid = auth.mfa.totp.verifyTOTPWithClockSkew(key, code);

    if (!valid.valid) {
      return { error: "Invalid verification code" };
    }

    // Save credential
    await auth.mfa.totp.createTOTPCredential(user.id, key, "Authenticator App");

    return { success: true };
  } catch (error) {
    console.error("TOTP verification error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function disableTOTPAction(): Promise<TOTPSetupState> {
  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    await auth.mfa.totp.deleteUserTOTPKey(user.id);
    return { success: true };
  } catch (error) {
    console.error("TOTP disable error:", error);
    return { error: "Failed to disable 2FA" };
  }
}
