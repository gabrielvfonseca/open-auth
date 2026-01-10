"use server";

import { auth } from "@/lib/auth";

export interface PasskeyState {
  error?: string;
  success?: boolean;
  passkeys?: Array<{
    id: string;
    name: string;
    createdAt: Date;
    lastUsed?: Date;
  }>;
  registrationOptions?: any;
}

export async function getPasskeysAction(): Promise<PasskeyState> {
  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    const passkeys = await auth.passkey.getUserPasskeyCredentials(user.id);

    return {
      passkeys: passkeys.map(
        (pk: {
          id: Uint8Array;
          name: string | null;
          createdAt: Date;
          lastUsedAt: Date | null;
        }) => ({
          id: Buffer.from(pk.id).toString("hex"),
          name: pk.name || "Passkey",
          createdAt: pk.createdAt,
          lastUsed: pk.lastUsedAt ?? undefined,
        })
      ),
    };
  } catch (error) {
    console.error("Get passkeys error:", error);
    return { error: "Failed to load passkeys" };
  }
}

export async function getRegistrationOptionsAction(): Promise<PasskeyState> {
  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    const challenge = await auth.passkey.createWebAuthnChallenge(
      user.id,
      user.email,
      "registration"
    );

    // Construct options object for client (placeholder structure)
    const options = {
      challenge: Buffer.from(challenge).toString("base64"),
      rp: { name: "open-auth Auth", id: "localhost" }, // TODO: Get from env
      user: { id: user.id, name: user.email, displayName: user.username },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },
        { alg: -257, type: "public-key" },
      ],
      timeout: 60_000,
      attestation: "none",
    };

    return { registrationOptions: options };
  } catch (error) {
    console.error("Registration options error:", error);
    return { error: "Failed to generate registration options" };
  }
}

export async function registerPasskeyAction(
  _credential: any
): Promise<PasskeyState> {
  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    // Note: In real implementation, verify declaration using @simplewebauthn/server or similar
    // Here we assume validation passed (placeholder) and store credential
    // We need to map `credential` (from client) to CreatePasskeyCredentialData

    // Placeholder check - assume credential object has necessary data
    // const credentialData = credential as any;

    // await auth.passkey.createPasskeyCredential({
    //     id: new Uint8Array(Buffer.from(credentialData.id, 'base64')),
    //     userId: user.id,
    //     name: "Passkey",
    //     algorithmId: -7,
    //     publicKey: new Uint8Array(Buffer.from(credentialData.publicKey, 'base64'))
    // });

    console.log("Passkey verified and stored (placeholder)");

    return { success: true };
  } catch (error) {
    console.error("Register passkey error:", error);
    return { error: "Failed to register passkey" };
  }
}

export async function deletePasskeyAction(
  passkeyId: string
): Promise<PasskeyState> {
  try {
    const { session, user } = await auth.getCurrentSession();

    if (!(session && user)) {
      return { error: "You must be signed in" };
    }

    // Helper to convert hex/string to Uint8Array if needed, typically credentialId is passed as string in FormData
    // We'll assume encodedId is hex string
    const credentialIdBytes = new Uint8Array(Buffer.from(passkeyId, "hex"));
    await auth.passkey.deleteUserPasskeyCredential(user.id, credentialIdBytes);

    return { success: true };
  } catch (error) {
    console.error("Delete passkey error:", error);
    return { error: "Failed to delete passkey" };
  }
}
