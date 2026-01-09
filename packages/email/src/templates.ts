import type { EmailTemplate, TemplateData } from "./email-types";

const templates: Record<
  EmailTemplate,
  (data: TemplateData) => { subject: string; html: string }
> = {
  verification: (data) => ({
    subject: "Verify your email address",
    html: `
            <h1>Verify your email</h1>
            <p>Click the link below to verify your email address:</p>
            <a href="${data.url}">${data.url}</a>
            <p>Or enter this code: <strong>${data.code}</strong></p>
        `,
  }),

  "password-reset": (data) => ({
    subject: "Reset your password",
    html: `
            <h1>Reset your password</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${data.url}">${data.url}</a>
            <p>This link expires in 1 hour.</p>
        `,
  }),

  "magic-link": (data) => ({
    subject: "Sign in to your account",
    html: `
            <h1>Sign in</h1>
            <p>Click the link below to sign in:</p>
            <a href="${data.url}">${data.url}</a>
            <p>This link expires in 15 minutes.</p>
        `,
  }),

  welcome: (data) => ({
    subject: "Welcome!",
    html: `
            <h1>Welcome, ${data.username}!</h1>
            <p>Your account has been created successfully.</p>
        `,
  }),

  "account-locked": (data) => ({
    subject: "Account Locked",
    html: `
            <h1>Account Locked</h1>
            <p>Your account has been locked due to too many failed login attempts.</p>
            <p>It will be unlocked at: ${data.unlockedAt}</p>
        `,
  }),

  "new-device": (data) => ({
    subject: "New device sign-in",
    html: `
            <h1>New Device Sign-in</h1>
            <p>A new device has signed into your account:</p>
            <p><strong>Device:</strong> ${data.deviceName}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p>If this wasn't you, please secure your account immediately.</p>
        `,
  }),
};

/**
 * Render an email template
 */
export function renderTemplate(
  template: EmailTemplate,
  data: TemplateData
): { subject: string; html: string } {
  const renderer = templates[template];
  if (!renderer) {
    throw new Error(`Unknown email template: ${template}`);
  }
  return renderer(data);
}
