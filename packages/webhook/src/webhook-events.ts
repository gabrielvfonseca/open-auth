import "server-only";

/**
 * Trigger webhook event for user's organization
 * @deprecated Organizations are handled by User Service now, not Auth Service.
 * This function is kept but returns early until organizations logic is updated.
 */
export async function triggerWebhookEventForUser(
  _userId: string,
  _event: string,
  _payload: unknown
): Promise<void> {
  // This logic needs to be moved to the user service or wherever organizations are managed
  return;
}
