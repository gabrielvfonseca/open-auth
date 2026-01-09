import type { EmailOptions, EmailProvider } from "@open-auth/core";
import sgMail from "@sendgrid/mail";

export interface SendGridAdapterOptions {
  apiKey: string;
  defaultFrom?: string;
}

export function createSendGridAdapter(
  options: SendGridAdapterOptions
): EmailProvider {
  sgMail.setApiKey(options.apiKey);
  const defaultFrom = options.defaultFrom || "noreply@example.com";

  return {
    async sendEmail(emailOptions: EmailOptions) {
      try {
        const [response] = await sgMail.send({
          to: emailOptions.to,
          from: emailOptions.from || defaultFrom,
          subject: emailOptions.subject,
          html: emailOptions.html,
          text: emailOptions.text,
        });

        // SendGrid returns 202 Accepted for successful queuing
        const success = response.statusCode >= 200 && response.statusCode < 300;
        return {
          success,
          messageId: response.headers["x-message-id"] as string,
        };
      } catch (_error) {
        return { success: false };
      }
    },
  };
}
