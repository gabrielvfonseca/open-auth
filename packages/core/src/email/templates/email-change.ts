export function getEmailChangeVerificationTemplate(
  code: string,
  isNewEmail: boolean
): { subject: string; html: string; text: string } {
  const action = isNewEmail ? "complete" : "confirm";
  const subject = `${action === "complete" ? "Complete" : "Confirm"} email address change`;
  const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Email Change Verification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
	<h1 style="color: #2c3e50;">${action === "complete" ? "Complete" : "Confirm"} Email Address Change</h1>
	<p>You requested to change your email address. Please use the following code to ${action} the change:</p>
	<div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
		<strong style="font-size: 24px; letter-spacing: 3px; color: #2c3e50;">${code}</strong>
	</div>
	<p>This code will expire in 10 minutes.</p>
	<p>If you didn't request to change your email address, please ignore this email and contact support immediately.</p>
	<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
	<p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
</body>
</html>
	`;
  const text = `
${action === "complete" ? "Complete" : "Confirm"} Email Address Change

You requested to change your email address. Please use the following code to ${action} the change:

${code}

This code will expire in 10 minutes.

If you didn't request to change your email address, please ignore this email and contact support immediately.
	`;

  return { subject, html, text };
}
