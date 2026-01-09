# Telemetry API Reference

## Metrics Services

### `recordMetric(name: string, value: number, labels?: object)`
Increments a counter or records a value to a histogram.

### `measureDuration(name: string, labels?: object)`
Helper function to measure and record the execution time of a code block.

## Tracing Services

### `startSpan(name: string)`
Starts a new trace span for the current context.

### `injectTraceHeaders(headers: any)`
Adds tracing context to outbound HTTP headers.
