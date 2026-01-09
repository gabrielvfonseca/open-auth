export type AccountType =
  | "email_password"
  | "github"
  | "google"
  | "microsoft"
  | "apple"
  | "magic_link"
  | "saml";
export interface Account {
  id: string;
  userId: string;
  type: AccountType;
  providerId: string | null;
  email: string | null;
  emailVerified: boolean;
  createdAt: Date;
  lastUsedAt: Date | null;
}
export interface User {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  registeredTOTP: boolean;
  registeredSecurityKey: boolean;
  registeredPasskey: boolean;
  registered2FA: boolean;
}
