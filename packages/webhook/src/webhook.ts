import "server-only";
import { createHmac } from "node:crypto";
import type {
  DatabaseAdapter,
  Webhook,
  WebhookDelivery,
} from "@open-auth/core";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

export interface WebhookConfig {
  enabled?: boolean;
}

export class WebhookService {
  private readonly config: Required<WebhookConfig>;

  constructor(
    private readonly adapter: DatabaseAdapter,
    config: WebhookConfig = {}
  ) {
    this.config = {
      enabled: config.enabled ?? true,
    };
  }

  /**
   * Create a webhook
   */
  public async createWebhook(
    userId: string,
    organizationId: string,
    url: string,
    events: string[],
    applicationId?: string
  ): Promise<{ id: string; secret: string }> {
    if (!this.config.enabled) {
      throw new Error("Webhook service is disabled");
    }

    const secretBytes = new Uint8Array(32);
    crypto.getRandomValues(secretBytes);
    const secret = encodeBase32LowerCaseNoPadding(secretBytes);

    const webhook = await this.adapter.createWebhook({
      userId,
      organizationId,
      applicationId: applicationId || null,
      url,
      events,
      secret,
    });

    return { id: webhook.id, secret };
  }

  /**
   * Sign webhook payload with HMAC-SHA256
   */
  public signWebhookPayload(secret: string, payload: string): string {
    return createHmac("sha256", secret).update(payload).digest("hex");
  }

  /**
   * Deliver webhook event
   */
  public async deliverWebhook(
    webhookId: string,
    event: string,
    payload: unknown
  ): Promise<void> {
    const webhook = await this.adapter.getWebhook(webhookId);

    if (!(webhook?.enabled && webhook.events.includes(event))) {
      return;
    }

    const payloadString = JSON.stringify(payload);
    const signature = this.signWebhookPayload(webhook.secret, payloadString);

    try {
      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Event": event,
          "X-Webhook-Signature": signature,
          "X-Webhook-Id": webhook.id,
          "X-Webhook-Timestamp": new Date().toISOString(),
        },
        body: payloadString,
        signal: AbortSignal.timeout(30_000), // 30 second timeout
      });

      await this.adapter.createWebhookDelivery({
        id: encodeBase32LowerCaseNoPadding(
          crypto.getRandomValues(new Uint8Array(20))
        ),
        webhookId: webhook.id,
        event,
        payload: JSON.parse(JSON.stringify(payload)),
        statusCode: response.status,
        success: response.ok,
        error: response.ok ? null : `HTTP ${response.status}`,
      });
    } catch (error) {
      await this.adapter.createWebhookDelivery({
        id: encodeBase32LowerCaseNoPadding(
          crypto.getRandomValues(new Uint8Array(20))
        ),
        webhookId: webhook.id,
        event,
        payload: JSON.parse(JSON.stringify(payload)),
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        statusCode: null,
      });
    }
  }

  /**
   * Trigger webhook event for organization
   */
  public async triggerWebhookEvent(
    organizationId: string,
    event: string,
    payload: unknown
  ): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    const webhooks = await this.adapter.getWebhooksByEvent(
      organizationId,
      event
    );

    await Promise.allSettled(
      webhooks.map((webhook) => this.deliverWebhook(webhook.id, event, payload))
    );
  }

  /**
   * Get webhook deliveries
   */
  public async getWebhookDeliveries(
    webhookId: string,
    limit = 50
  ): Promise<WebhookDelivery[]> {
    return this.adapter.getWebhookDeliveries(webhookId, limit);
  }

  /**
   * Get organization's webhooks
   */
  public async getOrganizationWebhooks(
    organizationId: string
  ): Promise<Webhook[]> {
    return this.adapter.getWebhooksByOrganization(organizationId);
  }

  /**
   * Update webhook
   */
  public async updateWebhook(
    webhookId: string,
    userId: string,
    data: {
      url?: string;
      events?: string[];
      enabled?: boolean;
    }
  ): Promise<boolean> {
    const webhook = await this.adapter.getWebhook(webhookId);

    if (!webhook || webhook.userId !== userId) {
      return false;
    }

    await this.adapter.updateWebhook(webhookId, data);
    return true;
  }

  /**
   * Delete webhook
   */
  public async deleteWebhook(
    webhookId: string,
    userId: string
  ): Promise<boolean> {
    const webhook = await this.adapter.getWebhook(webhookId);

    if (!webhook || webhook.userId !== userId) {
      return false;
    }

    await this.adapter.deleteWebhook(webhookId);
    return true;
  }
}
