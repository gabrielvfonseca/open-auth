export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export type EmailTemplate =
  | "verification"
  | "password-reset"
  | "magic-link"
  | "welcome"
  | "account-locked"
  | "new-device";

export interface TemplateData {
  [key: string]: string | number | boolean | undefined;
}
