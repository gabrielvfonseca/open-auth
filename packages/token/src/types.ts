export type TokenType =
  | "session"
  | "api_key"
  | "oauth_access"
  | "oauth_refresh"
  | "verification"
  | "password_reset"
  | "magic_link";

export interface TokenPayload {
  type: TokenType;
  userId?: string;
  expiresAt: number;
  metadata?: Record<string, unknown>;
}

export interface GeneratedToken {
  token: string;
  hash: string;
  expiresAt: Date;
}
