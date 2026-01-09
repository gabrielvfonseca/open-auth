import "server-only";
import { decodeBase64 } from "@oslojs/encoding";
import { Apple, GitHub, Google, MicrosoftEntraId } from "arctic";
import { env } from "./env";
import type { OAuthProviderType } from "./types";

// GitHub
export const github =
  env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
    ? new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, null)
    : null;

// Google
export const google =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, "")
    : null;

// Microsoft (Entra ID)
export const microsoft =
  env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET
    ? new MicrosoftEntraId(
        "common",
        env.MICROSOFT_CLIENT_ID,
        env.MICROSOFT_CLIENT_SECRET,
        ""
      )
    : null;

// Apple
export const apple =
  env.APPLE_CLIENT_ID &&
  env.APPLE_TEAM_ID &&
  env.APPLE_KEY_ID &&
  env.APPLE_PRIVATE_KEY
    ? new Apple(
        env.APPLE_CLIENT_ID,
        env.APPLE_TEAM_ID,
        env.APPLE_KEY_ID,
        decodeBase64(env.APPLE_PRIVATE_KEY),
        ""
      )
    : null;

/**
 * Get a provider instance by type
 */
export function getProvider(type: OAuthProviderType) {
  switch (type) {
    case "github":
      return github;
    case "google":
      return google;
    case "microsoft":
      return microsoft;
    case "apple":
      return apple;
    default:
      return null;
  }
}

/**
 * Check if a provider is configured
 */
export function isProviderConfigured(type: OAuthProviderType): boolean {
  return getProvider(type) !== null;
}

/**
 * Get list of configured providers
 */
export function getConfiguredProviders(): OAuthProviderType[] {
  const providers: OAuthProviderType[] = [];
  if (github) {
    providers.push("github");
  }
  if (google) {
    providers.push("google");
  }
  if (microsoft) {
    providers.push("microsoft");
  }
  if (apple) {
    providers.push("apple");
  }
  return providers;
}
