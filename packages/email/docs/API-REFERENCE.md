# Email API Reference

## Primary Services

### `sendEmail(options: SendEmailOptions)`
Dispatches an email message.

### `sendTemplatedEmail(templateName: string, data: any, recipient: string)`
Renders a template with the provided data and sends it.

## Internal Components

### `templates`
An object containing all registered email templates (e.g., `templates.verificationCode`).

## Types

### `SendEmailOptions`
- `to`: string | string[]
- `subject`: string
- `body`: string (HTML or plain text)
- `attachments`: optional
