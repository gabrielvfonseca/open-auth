import * as oauth from "@open-auth/oauth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider;
  const cookieStore = cookies();

  try {
    let url: URL;
    const state = generateState();

    if (provider === "github") {
      url = await oauth.github.createAuthorizationURL(state, []);
    } else if (provider === "google") {
      const codeVerifier = generateCodeVerifier();
      url = await oauth.google.createAuthorizationURL(state, codeVerifier, [
        "profile",
        "email",
      ]);
      cookieStore.set("google_code_verifier", codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
      });
    } else if (provider === "microsoft") {
      const codeVerifier = generateCodeVerifier();
      url = await oauth.microsoft.createAuthorizationURL(state, codeVerifier, [
        "User.Read",
      ]);
      cookieStore.set("microsoft_code_verifier", codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 10,
        sameSite: "lax",
      });
    } else {
      return NextResponse.redirect(
        new URL(
          `/sign-in?error=provider_not_supported&provider=${provider}`,
          request.url
        )
      );
    }

    cookieStore.set(`${provider}_oauth_state`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    return NextResponse.redirect(url);
  } catch (e) {
    console.error("OAuth init error:", e);
    return NextResponse.redirect(
      new URL(
        `/sign-in?error=oauth_init_failed&provider=${provider}`,
        request.url
      )
    );
  }
}
