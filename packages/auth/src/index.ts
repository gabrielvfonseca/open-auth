import { AuthClient } from "./client";
import type { AuthConfig } from "./config";

export { AuthClient } from "./client";
export * from "./config";

export function createAuthClient(config: AuthConfig) {
  return new AuthClient(config);
}

export type { Account, User } from "@open-auth/core";

// Export types from domain packages
export type {
  Session,
  SessionFlags,
  SessionInfo,
  SessionValidationResult,
} from "@open-auth/session";
export type {
  AuthorizationContext,
  PasskeySignInResult,
  SignInResult,
  SignUpResult,
} from "./client";

// No default client export as it requires adapter.
// Consumers must use createAuthClient(adapter).
