import { GitHub, Google, MicrosoftEntraId } from "arctic";

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID ?? "",
  process.env.GITHUB_CLIENT_SECRET ?? "",
  `${process.env.NEXT_PUBLIC_APP_URL}/sign-in/oauth/github/callback`
);

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID ?? "",
  process.env.GOOGLE_CLIENT_SECRET ?? "",
  `${process.env.NEXT_PUBLIC_APP_URL}/sign-in/oauth/google/callback`
);

export const microsoft = new MicrosoftEntraId(
  process.env.MICROSOFT_TENANT_ID ?? "",
  process.env.MICROSOFT_CLIENT_ID ?? "",
  process.env.MICROSOFT_CLIENT_SECRET ?? "",
  `${process.env.NEXT_PUBLIC_APP_URL}/sign-in/oauth/microsoft/callback`
);
