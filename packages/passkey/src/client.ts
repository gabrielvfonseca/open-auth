export async function checkConditionalUIAvailable(): Promise<boolean> {
  if (
    typeof window === "undefined" ||
    !window.PublicKeyCredential ||
    !window.PublicKeyCredential.isConditionalMediationAvailable
  ) {
    return false;
  }
  try {
    return await window.PublicKeyCredential.isConditionalMediationAvailable();
  } catch {
    return false;
  }
}

// Export only client-side safe functions

export function createChallenge(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}
