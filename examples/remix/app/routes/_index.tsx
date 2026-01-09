import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { auth } from "open-auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const sessionId = auth.session.readSessionToken(cookieHeader ?? "");
  if (!sessionId) {
    return json({ user: null });
  }

  const { session, user } = await auth.validateSessionToken(sessionId);
  if (session) {
    // In a real app we might want to refresh the cookie here
    return json({ user });
  }
  return json({ user: null });
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Open Auth Remix Example</h1>
      {user ? (
        <p>Logged in as {user.username || user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
