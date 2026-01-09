export declare function getEmailChangeVerificationTemplate(
  code: string,
  isNewEmail: boolean
): {
  subject: string;
  html: string;
  text: string;
};
