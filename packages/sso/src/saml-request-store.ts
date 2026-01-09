import "server-only";
import { cache } from "@open-auth/cache";
import { logger } from "@open-auth/core";

const SAML_REQUEST_PREFIX = "saml:request:";
const DEFAULT_TTL_SECONDS = 10 * 60; // 10 minutes

export class SamlRequestStoreService {
  /**
   * Store a SAML request ID in Redis with expiration
   * @param requestId - The SAML request ID to store
   * @param ttlSeconds - Time to live in seconds (default: 10 minutes)
   */
  public async storeRequestId(
    requestId: string,
    ttlSeconds: number = DEFAULT_TTL_SECONDS
  ): Promise<void> {
    try {
      const key = `${SAML_REQUEST_PREFIX}${requestId}`;
      await cache.set(key, "1", ttlSeconds);
    } catch (error) {
      logger.error("Failed to store SAML request ID", {
        error: error instanceof Error ? error.message : String(error),
        requestId,
      });
      throw error;
    }
  }

  /**
   * Check if a SAML request ID exists in Redis
   * @param requestId - The SAML request ID to check
   * @returns true if the request ID exists, false otherwise
   */
  public async hasRequestId(requestId: string): Promise<boolean> {
    try {
      const key = `${SAML_REQUEST_PREFIX}${requestId}`;
      return await cache.exists(key);
    } catch (error) {
      logger.error("Failed to check SAML request ID", {
        error: error instanceof Error ? error.message : String(error),
        requestId,
      });
      // On error, allow the request to prevent breaking authentication
      return true;
    }
  }

  /**
   * Delete a SAML request ID from Redis (one-time use)
   * @param requestId - The SAML request ID to delete
   */
  public async deleteRequestId(requestId: string): Promise<void> {
    try {
      const key = `${SAML_REQUEST_PREFIX}${requestId}`;
      await cache.del(key);
    } catch (error) {
      logger.error("Failed to delete SAML request ID", {
        error: error instanceof Error ? error.message : String(error),
        requestId,
      });
      // Don't throw - deletion failure is not critical
    }
  }

  /**
   * Cleanup expired request IDs (optional - Redis TTL handles this automatically)
   * This function is no longer needed as Redis TTL handles expiration automatically.
   * Kept for backward compatibility but returns 0.
   */
  public async cleanupExpiredRequestIds(): Promise<number> {
    // TTL-based expiration is automatic in Redis, no cleanup needed
    return 0;
  }
}

export const samlRequestStoreService = new SamlRequestStoreService();

// Export standalone functions for backward compatibility/internal use during refactor if needed
export async function storeRequestId(
  requestId: string,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<void> {
  return samlRequestStoreService.storeRequestId(requestId, ttlSeconds);
}

export async function hasRequestId(requestId: string): Promise<boolean> {
  return samlRequestStoreService.hasRequestId(requestId);
}

export async function deleteRequestId(requestId: string): Promise<void> {
  return samlRequestStoreService.deleteRequestId(requestId);
}
