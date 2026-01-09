import { type NextRequest, NextResponse } from "next/server";
import { auth } from "open-auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const providerIdOrEntityId = params.provider;

  try {
    // Try to find provider by ID first, then Entity ID
    // Note: The UI likely links with the ID/Slug
    let samlProvider = await auth.sso.getSAMLProviderById(providerIdOrEntityId);

    if (!samlProvider) {
      samlProvider =
        await auth.sso.getSAMLProviderByEntityId(providerIdOrEntityId);
    }

    if (!samlProvider?.enabled) {
      return NextResponse.redirect(
        new URL("/sign-in?error=sso_provider_not_found", request.url)
      );
    }

    const { request: loginUrl, id: requestId } =
      await auth.sso.generateSAMLRequest(
        samlProvider,
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      );

    // Redirect to IdP
    return NextResponse.redirect(loginUrl);
  } catch (e) {
    console.error("SSO init error:", e);
    return NextResponse.redirect(
      new URL("/sign-in?error=sso_init_failed", request.url)
    );
  }
}
