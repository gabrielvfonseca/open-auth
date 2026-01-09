import "server-only";
declare const FROM_EMAIL: string;
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}
export declare function sendEmail(options: EmailOptions): Promise<void>;
export { FROM_EMAIL };
