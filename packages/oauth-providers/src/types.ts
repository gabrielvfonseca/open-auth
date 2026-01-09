export type OAuthProviderType = "github" | "google" | "microsoft" | "apple";

export interface OAuthUserInfo {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: OAuthProviderType;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}
