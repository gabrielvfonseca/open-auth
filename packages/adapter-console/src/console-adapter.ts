import type { EmailOptions, EmailProvider } from "@open-auth/core";
import { consola } from "consola";

export function createConsoleAdapter(): EmailProvider {
  return {
    async sendEmail(options: EmailOptions) {
      consola.box({
        title: "📧 Email Sent",
        message: `To: ${options.to}\nSubject: ${options.subject}\n\n${options.text || "(HTML Content)"}`,
        style: {
          borderColor: "green",
        },
      });
      return { success: true, messageId: `console-${Date.now()}` };
    },
  };
}
