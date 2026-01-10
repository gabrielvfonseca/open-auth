import * as oauth from "@open-auth/oauth";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const cookieStore = cookies();

  if (error) {
    console.error(`OAuth error from ${provider}:`, error);
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!(code && state)) {
    return NextResponse.redirect(
      new URL("/sign-in?error=missing_oauth_params", request.url)
    );
  }

  const savedState = cookieStore.get(`${provider}_oauth_state`)?.value;

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(
      new URL("/sign-in?error=invalid_oauth_state", request.url)
    );
  }

  try {
    let accountId: string;
    let userId: string;

    if (provider === "github") {
      const tokens = await oauth.github.validateAuthorizationCode(code);
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const user = await userResponse.json();
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const emails = await emailResponse.json();
      const primaryEmail =
        emails.find((email: any) => email.primary)?.email || emails[0].email;

      const accountResult = await auth.account.findOrCreateAccountForOAuth(
        "github",
        user.id.toString(),
        primaryEmail,
        user.login
      );
      accountId = accountResult.account.id;
      userId = accountResult.user.id;
    } else if (provider === "google") {
      const codeVerifier = cookieStore.get("google_code_verifier")?.value;
      if (!codeVerifier) {
        return NextResponse.redirect(
          new URL("/sign-in?error=internal_error", request.url)
        );
      }
      const tokens = await oauth.google.validateAuthorizationCode(
        code,
        codeVerifier
      );
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );
      const user = await userResponse.json();

      const accountResult = await auth.account.findOrCreateAccountForOAuth(
        "google",
        user.id,
        user.email,
        user.name // Using name as username fallback, or stricter username generation if needed
      );
      accountId = accountResult.account.id;
      userId = accountResult.user.id;
    } else if (provider === "microsoft") {
      const codeVerifier = cookieStore.get("microsoft_code_verifier")?.value;
      if (!codeVerifier) {
        return NextResponse.redirect(
          new URL("/sign-in?error=internal_error", request.url)
        );
      }
      const tokens = await oauth.microsoft.validateAuthorizationCode(
        code,
        codeVerifier
      );
      const userResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const user = await userResponse.json();

      const accountResult = await auth.account.findOrCreateAccountForOAuth(
        "microsoft",
        user.id,
        user.mail || user.userPrincipalName,
        user.displayName
      );
      accountId = accountResult.account.id;
      userId = accountResult.user.id;
    } else {
      return NextResponse.redirect(
        new URL("/sign-in?error=provider_not_supported", request.url)
      );
    }

    const sessionToken = auth.session.generateSessionToken();
    const session = await auth.session.createSession(
      sessionToken,
      userId,
      { twoFactorVerified: false },
      accountId
    );
    auth.session.setSessionTokenCookie(sessionToken, session.expiresAt);

    return NextResponse.redirect(new URL("/", request.url));
  } catch (err) {
    console.error(`OAuth callback error for ${provider}:`, err);
    if (err instanceof OAuth2RequestError) {
      console.error("OAuth2 Request Error:", err.message, err.description);
    }
    return NextResponse.redirect(
      new URL("/sign-in?error=oauth_callback_failed", request.url)
    );
  }
}
