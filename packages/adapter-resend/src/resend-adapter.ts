import { Resend } from "resend";
import type { EmailOptions, EmailProvider } from "./index";

export interface ResendAdapterOptions {
  apiKey: string;
  defaultFrom?: string;
}

export function createResendAdapter(
  options: ResendAdapterOptions
): EmailProvider {
  const resend = new Resend(options.apiKey);
  const defaultFrom = options.defaultFrom || "noreply@example.com";

  return {
    async sendEmail(emailOptions: EmailOptions) {
      const { data, error } = await resend.emails.send({
        from: emailOptions.from || defaultFrom,
        to: emailOptions.to,
        subject: emailOptions.subject,
        html: emailOptions.html,
        text: emailOptions.text,
      });

      if (error) {
        return { success: false };
      }

      return { success: true, messageId: data?.id };
    },
  };
}
