export function getVerificationEmailTemplate(code: string): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Verify your email address";
  const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
	<h1 style="color: #2c3e50;">Verify Your Email Address</h1>
	<p>Thank you for signing up! Please use the following code to verify your email address:</p>
	<div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
		<strong style="font-size: 24px; letter-spacing: 3px; color: #2c3e50;">${code}</strong>
	</div>
	<p>This code will expire in 10 minutes.</p>
	<p>If you didn't create an account, please ignore this email.</p>
	<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
	<p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
</body>
</html>
	`;
  const text = `
Verify Your Email Address

Thank you for signing up! Please use the following code to verify your email address:

${code}

This code will expire in 10 minutes.

If you didn't create an account, please ignore this email.
	`;

  return { subject, html, text };
}
