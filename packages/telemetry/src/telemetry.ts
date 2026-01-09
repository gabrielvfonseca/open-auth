import "server-only";
import { logger } from "@open-auth/core";
import type { TelemetryEvent, TelemetryEventType } from "./types";

// Event buffer for batching
const eventBuffer: TelemetryEvent[] = [];
const MAX_BUFFER_SIZE = 100;

/**
 * Track a telemetry event
 */
export function trackEvent(
  type: TelemetryEventType,
  userId?: string,
  metadata?: Record<string, unknown>
): void {
  const event: TelemetryEvent = {
    type,
    timestamp: Date.now(),
    userId,
    metadata,
  };

  eventBuffer.push(event);

  logger.debug("Telemetry event tracked", { type, userId });

  // Flush if buffer is full
  if (eventBuffer.length >= MAX_BUFFER_SIZE) {
    flushEvents();
  }
}

/**
 * Flush buffered events
 */
export async function flushEvents(): Promise<void> {
  if (eventBuffer.length === 0) {
    return;
  }

  const events = [...eventBuffer];
  eventBuffer.length = 0;

  // In production, send to telemetry service
  logger.info("Telemetry events flushed", { count: events.length });
}

/**
 * Measure execution time of an async function
 */
export async function measureLatency<T>(
  name: string,
  fn: () => Promise<T>,
  tags?: Record<string, string>
): Promise<T> {
  const start = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - start;

    logger.debug("Latency measured", { name, durationMs: duration, tags });

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.debug("Latency measured (error)", {
      name,
      durationMs: duration,
      tags,
    });
    throw error;
  }
}

/**
 * Get current buffer size
 */
export function getBufferSize(): number {
  return eventBuffer.length;
}
