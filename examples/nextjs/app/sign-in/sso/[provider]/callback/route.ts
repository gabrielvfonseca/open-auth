import { type NextRequest, NextResponse } from "next/server";
import { auth } from "open-auth";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const providerId = params.provider; // This should be the provider ID or Slug from the URL

  try {
    const formData = await request.formData();
    const samlResponse = formData.get("SAMLResponse") as string;
    const _relayState = formData.get("RelayState") as string;

    if (!samlResponse) {
      return NextResponse.redirect(
        new URL("/sign-in?error=missing_saml_response", request.url)
      );
    }

    // Fetch provider (Assuming param is ID, can act as EntityID fallback if needed)
    const samlProvider = await auth.sso.getSAMLProviderById(providerId);

    if (!samlProvider) {
      return NextResponse.redirect(
        new URL("/sign-in?error=sso_provider_not_found", request.url)
      );
    }

    const assertion = await auth.sso.validateSAMLResponse(
      samlResponse,
      samlProvider,
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    );

    const attributes = auth.sso.extractUserAttributes(assertion, samlProvider);

    const { user, account } = await auth.account.findOrCreateAccountForSAML(
      samlProvider.entityId,
      assertion.nameId,
      attributes.email,
      attributes.username || attributes.email.split("@")[0]
    );

    const sessionToken = auth.session.generateSessionToken();
    const session = await auth.session.createSession(
      sessionToken,
      user.id,
      { twoFactorVerified: false },
      account.id
    );
    auth.session.setSessionTokenCookie(sessionToken, session.expiresAt);

    return NextResponse.redirect(new URL("/", request.url));
  } catch (e) {
    console.error("SSO callback error:", e);
    return NextResponse.redirect(
      new URL("/sign-in?error=sso_callback_failed", request.url)
    );
  }
}
