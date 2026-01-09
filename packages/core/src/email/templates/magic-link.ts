export function getMagicLinkEmailTemplate(url: string): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Sign in to your account";
  const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Sign In</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
	<h1 style="color: #2c3e50;">Sign In to Your Account</h1>
	<p>Click the button below to sign in to your account. This link will expire in 15 minutes.</p>
	<div style="text-align: center; margin: 30px 0;">
		<a href="${url}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Sign In</a>
	</div>
	<p>Or copy and paste this link into your browser:</p>
	<p style="word-break: break-all; color: #3498db;">${url}</p>
	<p>If you didn't request this sign-in link, please ignore this email.</p>
	<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
	<p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
</body>
</html>
	`;
  const text = `
Sign In to Your Account

Click the link below to sign in to your account. This link will expire in 15 minutes.

${url}

If you didn't request this sign-in link, please ignore this email.
	`;

  return { subject, html, text };
}
