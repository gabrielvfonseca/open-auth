import "server-only";
import { logger } from "@open-auth/core";
import type { MetricData } from "./types";

// Metrics buffer
const metricsBuffer: MetricData[] = [];

/**
 * Record a metric
 */
export function recordMetric(
  name: string,
  value: number,
  unit?: string,
  tags?: Record<string, string>
): void {
  const metric: MetricData = {
    name,
    value,
    unit,
    tags,
    timestamp: Date.now(),
  };

  metricsBuffer.push(metric);
  logger.debug("Metric recorded", { name, value, unit });
}

/**
 * Increment a counter metric
 */
export function incrementCounter(
  name: string,
  increment = 1,
  tags?: Record<string, string>
): void {
  recordMetric(name, increment, "count", tags);
}

/**
 * Record a gauge metric
 */
export function recordGauge(
  name: string,
  value: number,
  tags?: Record<string, string>
): void {
  recordMetric(name, value, "gauge", tags);
}

/**
 * Record a histogram value
 */
export function recordHistogram(
  name: string,
  value: number,
  unit = "ms",
  tags?: Record<string, string>
): void {
  recordMetric(name, value, unit, tags);
}

/**
 * Flush metrics buffer
 */
export async function flushMetrics(): Promise<void> {
  if (metricsBuffer.length === 0) {
    return;
  }

  const metrics = [...metricsBuffer];
  metricsBuffer.length = 0;

  // In production, send to metrics service
  logger.info("Metrics flushed", { count: metrics.length });
}

/**
 * Get metrics buffer size
 */
export function getMetricsBufferSize(): number {
  return metricsBuffer.length;
}
