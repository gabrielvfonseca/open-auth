import "server-only";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { logger } from "@open-auth/core";
import type { EmailOptions, EmailResult } from "./email-types";
import { env } from "./env";

const sesClient = new SESClient({ region: env.AWS_REGION });

/**
 * Send an email using configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  if (env.EMAIL_PROVIDER === "console") {
    return sendEmailToConsole(options);
  }

  return sendEmailViaSES(options);
}

async function sendEmailViaSES(options: EmailOptions): Promise<EmailResult> {
  const fromEmail =
    options.from ?? env.AWS_SES_FROM_EMAIL ?? "noreply@example.com";
  const fromName = env.AWS_SES_FROM_NAME ?? "Auth System";
  const toAddresses = Array.isArray(options.to) ? options.to : [options.to];

  try {
    const command = new SendEmailCommand({
      Source: `${fromName} <${fromEmail}>`,
      Destination: {
        ToAddresses: toAddresses,
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
      ...(options.replyTo && {
        ReplyToAddresses: [options.replyTo],
      }),
    });

    const response = await sesClient.send(command);

    logger.info("Email sent via SES", {
      messageId: response.MessageId,
      to: toAddresses,
    });

    return {
      success: true,
      messageId: response.MessageId,
    };
  } catch (error) {
    logger.error("Failed to send email via SES", { error, to: toAddresses });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function sendEmailToConsole(options: EmailOptions): Promise<EmailResult> {
  const toAddresses = Array.isArray(options.to) ? options.to : [options.to];

  logger.info("Email (console mode)", {
    to: toAddresses,
    subject: options.subject,
    html: `${options.html.substring(0, 200)}...`,
  });

  return {
    success: true,
    messageId: `console-${Date.now()}`,
  };
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  to: string,
  code: string,
  baseUrl: string
): Promise<EmailResult> {
  const verifyUrl = `${baseUrl}/verify-email?code=${code}`;

  return sendEmail({
    to,
    subject: "Verify your email address",
    html: `
            <h1>Verify your email</h1>
            <p>Click the link below to verify your email address:</p>
            <a href="${verifyUrl}">${verifyUrl}</a>
            <p>Or enter this code: <strong>${code}</strong></p>
            <p>This link expires in 24 hours.</p>
        `,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  code: string,
  baseUrl: string
): Promise<EmailResult> {
  const resetUrl = `${baseUrl}/reset-password?code=${code}`;

  return sendEmail({
    to,
    subject: "Reset your password",
    html: `
            <h1>Reset your password</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `,
  });
}

/**
 * Send magic link email
 */
export async function sendMagicLinkEmail(
  to: string,
  token: string,
  baseUrl: string
): Promise<EmailResult> {
  const loginUrl = `${baseUrl}/magic-link?token=${token}`;

  return sendEmail({
    to,
    subject: "Sign in to your account",
    html: `
            <h1>Sign in</h1>
            <p>Click the link below to sign in:</p>
            <a href="${loginUrl}">${loginUrl}</a>
            <p>This link expires in 15 minutes.</p>
        `,
  });
}
