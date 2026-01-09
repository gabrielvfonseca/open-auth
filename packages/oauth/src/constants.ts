// Default OAuth scopes
export const OAUTH_SCOPES = {
  READ_USER: "read:user",
  WRITE_USER: "write:user",
  READ_ORGANIZATION: "read:organization",
  WRITE_ORGANIZATION: "write:organization",
  ADMIN: "admin",
} as const;

export const DEFAULT_SCOPES = [
  OAUTH_SCOPES.READ_USER,
  OAUTH_SCOPES.WRITE_USER,
  OAUTH_SCOPES.READ_ORGANIZATION,
  OAUTH_SCOPES.WRITE_ORGANIZATION,
];
