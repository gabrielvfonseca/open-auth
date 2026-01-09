import "server-only";
import type { DatabaseAdapter, SAMLProvider } from "@open-auth/core";
import saml2 from "saml2-js";
import { samlRequestStoreService } from "./saml-request-store";

// Type definitions for saml2-js library
interface SAML2Response {
  response_header?: {
    id?: string;
    destination?: string;
    in_response_to?: string;
    [key: string]: unknown;
  };
  name_id?: string;
  nameID?: string;
  name_id_format?: string;
  nameIDFormat?: string;
  session_index?: string;
  sessionIndex?: string;
  [key: string]: unknown;
}

export interface SAMLAssertion {
  nameId: string;
  nameIdFormat: string;
  attributes: Record<string, string | string[]>;
  sessionIndex?: string;
}

export interface UserAttributes {
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface CreateSAMLProviderData {
  name: string;
  entityId: string;
  ssoUrl: string;
  certificate: string;
  enabled?: boolean;
  emailAttribute?: string;
  firstNameAttribute?: string;
  lastNameAttribute?: string;
  usernameAttribute?: string;
}

export interface UpdateSAMLProviderData {
  name?: string;
  entityId?: string;
  ssoUrl?: string;
  certificate?: string;
  enabled?: boolean;
  emailAttribute?: string;
  firstNameAttribute?: string;
  lastNameAttribute?: string;
  usernameAttribute?: string;
}

export interface SsoConfig {
  enabled?: boolean;
}

export class SsoService {
  private readonly config: SsoConfig;

  constructor(
    private readonly adapter: DatabaseAdapter,
    config: SsoConfig = {}
  ) {
    this.config = {
      enabled: config.enabled ?? true,
    };
  }

  /**
   * Get all SAML providers
   */
  public async getSAMLProviders(enabledOnly = false): Promise<SAMLProvider[]> {
    return this.adapter.getSAMLProviders(enabledOnly);
  }

  /**
   * Get SAML provider by ID
   */
  public async getSAMLProviderById(id: string): Promise<SAMLProvider | null> {
    return this.adapter.getSAMLProviderById(id);
  }

  /**
   * Get SAML provider by entity ID
   */
  public async getSAMLProviderByEntityId(
    entityId: string
  ): Promise<SAMLProvider | null> {
    return this.adapter.getSAMLProviderByEntityId(entityId);
  }

  /**
   * Create new SAML provider
   */
  public async createSAMLProvider(
    data: CreateSAMLProviderData
  ): Promise<SAMLProvider> {
    return this.adapter.createSAMLProvider({
      name: data.name,
      entityId: data.entityId,
      ssoUrl: data.ssoUrl,
      certificate: data.certificate,
      enabled: data.enabled ?? true,
      emailAttribute: data.emailAttribute ?? "email",
      firstNameAttribute: data.firstNameAttribute ?? "firstName",
      lastNameAttribute: data.lastNameAttribute ?? "lastName",
      usernameAttribute: data.usernameAttribute ?? "username",
    });
  }

  /**
   * Update SAML provider
   */
  public async updateSAMLProvider(
    id: string,
    data: UpdateSAMLProviderData
  ): Promise<SAMLProvider> {
    return this.adapter.updateSAMLProvider(id, data);
  }

  /**
   * Delete SAML provider
   */
  public async deleteSAMLProvider(id: string): Promise<boolean> {
    try {
      await this.adapter.deleteSAMLProvider(id);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate SAML AuthnRequest
   */
  public async generateSAMLRequest(
    provider: SAMLProvider,
    baseUrl: string,
    relayState?: string
  ): Promise<{ request: string; id: string; relayState: string }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const idp_options: any = {
      sso_login_url: provider.ssoUrl,
      sso_logout_url: provider.ssoUrl,
      certificates: [provider.certificate],
    };
    const idp = new saml2.IdentityProvider(idp_options);

    const sp_options: any = {
      entity_id: `${baseUrl}/api/auth/sso/metadata`,
      assert_endpoint: `${baseUrl}/api/auth/sso/acs`,
      allow_unencrypted_assertion: true,
      nameid_format: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
    };
    const sp = new saml2.ServiceProvider(sp_options);

    return new Promise((resolve, reject) => {
      sp.create_login_request_url(
        idp,
        { relay_state: relayState },
        async (error, login_url, requestId) => {
          if (error) {
            return reject(error);
          }

          if (!(login_url && requestId)) {
            return reject(new Error("Failed to generate login URL"));
          }

          await samlRequestStoreService.storeRequestId(requestId);

          resolve({
            request: login_url,
            id: requestId,
            relayState: relayState || "",
          });
        }
      );
    });
  }

  /**
   * Validate SAML response and extract assertion
   */
  public async validateSAMLResponse(
    response: string,
    provider: SAMLProvider,
    baseUrl: string
  ): Promise<SAMLAssertion> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const idp_options: any = {
      sso_login_url: provider.ssoUrl,
      sso_logout_url: provider.ssoUrl,
      certificates: [provider.certificate],
    };
    const idp = new saml2.IdentityProvider(idp_options);

    const sp_options: any = {
      entity_id: `${baseUrl}/api/auth/sso/metadata`,
      assert_endpoint: `${baseUrl}/api/auth/sso/acs`,
      allow_unencrypted_assertion: true,
    };
    const sp = new saml2.ServiceProvider(sp_options);

    const options = {
      request_body: { SAMLResponse: response },
    };

    return new Promise((resolve, reject) => {
      sp.post_assert(idp, options, async (error, saml_response: unknown) => {
        if (error) {
          return reject(new Error(`SAML validation failed: ${error.message}`));
        }

        const typedResponse = saml_response as SAML2Response;

        const inResponseTo = typedResponse.response_header?.in_response_to;
        if (inResponseTo) {
          const isValidRequest =
            await samlRequestStoreService.hasRequestId(inResponseTo);
          if (!isValidRequest) {
            // Could reject if enforcing SP-initiated SSO
          }
          await samlRequestStoreService.deleteRequestId(inResponseTo);
        }

        const nameId = typedResponse.name_id || typedResponse.nameID;
        if (!nameId) {
          return reject(new Error("SAML response missing NameID"));
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const attributes: Record<string, string | string[]> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawAttributes = (typedResponse as any).user?.attributes || {};

        for (const key in rawAttributes) {
          const value = rawAttributes[key];
          if (Array.isArray(value) && value.length === 1) {
            attributes[key] = value[0];
          } else {
            attributes[key] = value;
          }
        }

        resolve({
          nameId,
          nameIdFormat:
            typedResponse.name_id_format || typedResponse.nameIDFormat || "",
          attributes,
          sessionIndex:
            typedResponse.session_index || typedResponse.sessionIndex,
        });
      });
    });
  }

  /**
   * Extract user attributes from SAML assertion
   */
  public extractUserAttributes(
    assertion: SAMLAssertion,
    provider: SAMLProvider
  ): UserAttributes {
    const attributes = assertion.attributes;

    const getAttribute = (name: string): string | undefined => {
      if (attributes[name]) {
        const val = attributes[name];
        return Array.isArray(val) ? val[0] : val;
      }

      const lowerName = name.toLowerCase();
      const key = Object.keys(attributes).find(
        (k) => k.toLowerCase() === lowerName
      );
      if (key) {
        const val = attributes[key];
        return Array.isArray(val) ? val[0] : val;
      }

      return undefined;
    };

    const email = getAttribute(provider.emailAttribute) || assertion.nameId;
    const firstName = getAttribute(provider.firstNameAttribute);
    const lastName = getAttribute(provider.lastNameAttribute);
    const username = getAttribute(provider.usernameAttribute);

    return {
      email,
      firstName,
      lastName,
      username,
    };
  }

  /**
   * Generate Service Provider metadata XML
   */
  public async generateSPMetadata(
    baseUrl: string,
    _certificate?: string
  ): Promise<string> {
    const metadata = `<?xml version="1.0"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${baseUrl}/sign-in/saml/metadata">
    <SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
        <NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:transient</NameIDFormat>
        <NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress</NameIDFormat>
        <NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</NameIDFormat>
    </SPSSODescriptor>
</EntityDescriptor>`;

    return metadata;
  }
}

// Re-export SAMLProvider type from core
export type { SAMLProvider };
