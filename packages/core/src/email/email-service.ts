import "server-only";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { logger } from "../logger";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      }
    : undefined,
});

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@example.com";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export interface EmailOptions {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  sendEmail(
    options: EmailOptions
  ): Promise<{ success: boolean; messageId?: string }>;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendEmailWithRetry(
  options: EmailOptions,
  retryCount = 0
): Promise<void> {
  try {
    const command = new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: {
        ToAddresses: [options.to],
      },
      Message: {
        Subject: {
          Data: options.subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: options.html,
            Charset: "UTF-8",
          },
          ...(options.text && {
            Text: {
              Data: options.text,
              Charset: "UTF-8",
            },
          }),
        },
      },
    });

    await sesClient.send(command);
    logger.info("Email sent successfully", {
      to: options.to,
      subject: options.subject,
    });
  } catch (error) {
    const isRetryable =
      error instanceof Error &&
      (error.message.includes("Throttling") ||
        error.message.includes("ServiceUnavailable") ||
        error.message.includes("InternalFailure"));

    if (isRetryable && retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * 2 ** retryCount;
      logger.warn("Email send failed, retrying", {
        to: options.to,
        error: error instanceof Error ? error.message : String(error),
        retryCount: retryCount + 1,
        delay,
      });
      await sleep(delay);
      return sendEmailWithRetry(options, retryCount + 1);
    }

    logger.error("Email send failed after retries", {
      to: options.to,
      error: error instanceof Error ? error.message : String(error),
      retryCount,
    });
    throw error;
  }
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // In development, log to console if AWS credentials are not set
  if (
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.NODE_ENV === "development"
  ) {
    logger.info("Email would be sent (development mode)", {
      to: options.to,
      subject: options.subject,
      html: `${options.html.substring(0, 100)}...`,
    });
    console.log(`\n=== EMAIL TO: ${options.to} ===`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body:\n${options.text || options.html}\n`);
    return;
  }

  return sendEmailWithRetry(options);
}

export { FROM_EMAIL };
