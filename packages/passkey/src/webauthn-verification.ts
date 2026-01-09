import "server-only";
import {
  decodePKIXECDSASignature,
  decodeSEC1PublicKey,
  p256,
  verifyECDSASignature,
} from "@oslojs/crypto/ecdsa";
import {
  decodePKCS1RSAPublicKey,
  sha256ObjectIdentifier,
  verifyRSASSAPKCS1v15Signature,
} from "@oslojs/crypto/rsa";
import { sha256 } from "@oslojs/crypto/sha2";
import { decodeBase64 } from "@oslojs/encoding";
import {
  type AuthenticatorData,
  type ClientData,
  ClientDataType,
  coseAlgorithmES256,
  coseAlgorithmRS256,
  createAssertionSignatureMessage,
  parseAuthenticatorData,
  parseClientDataJSON,
} from "@oslojs/webauthn";
import { ObjectParser } from "@pilcrowjs/object-parser";
import type { WebAuthnService, WebAuthnUserCredential } from "./webauthn";
import { getRelyingPartyId, isOriginAllowed } from "./webauthn-config";
import {
  createWebAuthnError,
  toUserMessage,
  WebAuthnErrorCode,
} from "./webauthn-errors";

export interface WebAuthnVerificationOptions {
  /**
   * Function to retrieve the credential by ID
   */
  getCredential: (
    credentialId: Uint8Array,
    userId?: string
  ) => Promise<WebAuthnUserCredential | null>;
  /**
   * Function to update credential last used timestamp (optional)
   */
  updateLastUsed?: (credentialId: Uint8Array) => Promise<void>;
  /**
   * Relying Party ID to verify against (defaults to getRelyingPartyId())
   */
  rpId?: string;
  /**
   * Function to check if origin is allowed (defaults to isOriginAllowed)
   */
  checkOrigin?: (origin: string) => boolean;
  /**
   * Whether to require userVerified flag (defaults to false for 2FA)
   */
  requireUserVerified?: boolean;
  /**
   * Whether to use detailed error messages (defaults to true)
   */
  useDetailedErrors?: boolean;
}

export interface WebAuthnVerificationResult {
  success: boolean;
  error: string | null;
}

export class WebAuthnVerificationService {
  constructor(private readonly webAuthnService: WebAuthnService) {}

  /**
   * Parse and validate WebAuthn assertion data from client
   */
  private parseWebAuthnData(data: unknown): {
    success: boolean;
    error: string | null;
    authenticatorData?: Uint8Array;
    clientDataJSON?: Uint8Array;
    credentialId?: Uint8Array;
    signature?: Uint8Array;
  } {
    const parser = new ObjectParser(data);
    let encodedAuthenticatorData: string;
    let encodedClientDataJSON: string;
    let encodedCredentialId: string;
    let encodedSignature: string;
    try {
      encodedAuthenticatorData = parser.getString("authenticator_data");
      encodedClientDataJSON = parser.getString("client_data_json");
      encodedCredentialId = parser.getString("credential_id");
      encodedSignature = parser.getString("signature");
    } catch {
      return {
        success: false,
        error: "Invalid or missing fields",
      };
    }

    let authenticatorDataBytes: Uint8Array;
    let clientDataJSON: Uint8Array;
    let credentialId: Uint8Array;
    let signatureBytes: Uint8Array;
    try {
      authenticatorDataBytes = decodeBase64(encodedAuthenticatorData);
      clientDataJSON = decodeBase64(encodedClientDataJSON);
      credentialId = decodeBase64(encodedCredentialId);
      signatureBytes = decodeBase64(encodedSignature);
    } catch {
      return {
        success: false,
        error: "Invalid or missing fields",
      };
    }

    return {
      success: true,
      error: null,
      authenticatorData: authenticatorDataBytes,
      clientDataJSON,
      credentialId,
      signature: signatureBytes,
    };
  }

  /**
   * Verify WebAuthn assertion for 2FA
   */
  public async verifyWebAuthnAssertion(
    data: unknown,
    options: WebAuthnVerificationOptions & { userId?: string }
  ): Promise<WebAuthnVerificationResult & { userId?: string }> {
    // Parse input data
    const parsed = this.parseWebAuthnData(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error,
      };
    }

    // Type guard: parsed.success is true, so these are defined
    if (
      !(
        parsed.authenticatorData &&
        parsed.clientDataJSON &&
        parsed.credentialId &&
        parsed.signature
      )
    ) {
      return {
        success: false,
        error: "Invalid or missing fields",
      };
    }

    const {
      authenticatorData: authenticatorDataBytes,
      clientDataJSON,
      credentialId,
      signature: signatureBytes,
    } = parsed;

    // Parse authenticator data
    let authenticatorData: AuthenticatorData;
    try {
      authenticatorData = parseAuthenticatorData(authenticatorDataBytes);
    } catch {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.INVALID_CLIENT_DATA)
              )
            : "Invalid data",
      };
    }

    // Verify RP ID
    const rpId = options.rpId ?? getRelyingPartyId();
    if (!authenticatorData.verifyRelyingPartyIdHash(rpId)) {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.INVALID_RP_ID)
              )
            : "Invalid data",
      };
    }

    // Verify user presence
    if (!authenticatorData.userPresent) {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.USER_NOT_PRESENT)
              )
            : "Invalid data",
      };
    }

    // Verify user verified if required
    if (options.requireUserVerified && !authenticatorData.userVerified) {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.USER_NOT_VERIFIED)
              )
            : "Invalid data",
      };
    }

    // Parse client data
    let clientData: ClientData;
    try {
      clientData = parseClientDataJSON(clientDataJSON);
    } catch {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.INVALID_CLIENT_DATA)
              )
            : "Invalid data",
      };
    }

    // Verify client data type
    if (clientData.type !== ClientDataType.Get) {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.INVALID_CLIENT_DATA)
              )
            : "Invalid data",
      };
    }

    // Verify challenge
    const challengeValid = await this.webAuthnService.verifyWebAuthnChallenge(
      clientData.challenge
    );
    if (!challengeValid) {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.INVALID_CHALLENGE)
              )
            : "Invalid data",
      };
    }

    // Verify origin
    const checkOrigin = options.checkOrigin ?? isOriginAllowed;
    if (!checkOrigin(clientData.origin)) {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.INVALID_ORIGIN)
              )
            : "Invalid data",
      };
    }

    // Verify not cross-origin
    if (clientData.crossOrigin !== null && clientData.crossOrigin) {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.INVALID_ORIGIN)
              )
            : "Invalid data",
      };
    }

    // Get credential
    const credential = await options.getCredential(
      credentialId,
      options.userId
    );
    if (credential === null) {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.CREDENTIAL_NOT_FOUND)
              )
            : "Invalid credential",
      };
    }

    // If userId was provided in options, verify it matches
    if (options.userId && credential.userId !== options.userId) {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.CREDENTIAL_NOT_FOUND)
              )
            : "Invalid credential",
      };
    }

    // Verify signature
    let validSignature: boolean;
    if (credential.algorithmId === coseAlgorithmES256) {
      const ecdsaSignature = decodePKIXECDSASignature(signatureBytes);
      const ecdsaPublicKey = decodeSEC1PublicKey(p256, credential.publicKey);
      const hash = sha256(
        createAssertionSignatureMessage(authenticatorDataBytes, clientDataJSON)
      );
      validSignature = verifyECDSASignature(
        ecdsaPublicKey,
        hash,
        ecdsaSignature
      );
    } else if (credential.algorithmId === coseAlgorithmRS256) {
      const rsaPublicKey = decodePKCS1RSAPublicKey(credential.publicKey);
      const hash = sha256(
        createAssertionSignatureMessage(authenticatorDataBytes, clientDataJSON)
      );
      validSignature = verifyRSASSAPKCS1v15Signature(
        rsaPublicKey,
        sha256ObjectIdentifier,
        hash,
        signatureBytes
      );
    } else {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.UNSUPPORTED_ALGORITHM)
              )
            : "Internal error",
      };
    }

    if (!validSignature) {
      return {
        success: false,
        error:
          options.useDetailedErrors !== false
            ? toUserMessage(
                createWebAuthnError(WebAuthnErrorCode.INVALID_SIGNATURE)
              )
            : "Invalid data",
      };
    }

    // Update last used timestamp if callback provided
    if (options.updateLastUsed) {
      await options.updateLastUsed(credentialId);
    }

    return {
      success: true,
      error: null,
      userId: credential.userId,
    };
  }
}
