import "server-only";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

function formatLogEntry(entry: LogEntry): string {
  const { level, message, timestamp, ...metadata } = entry;
  const metadataStr =
    Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : "";
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metadataStr}`;
}

function createLogger() {
  return {
    info(message: string, metadata?: Record<string, unknown>): void {
      const entry: LogEntry = {
        level: "info",
        message,
        timestamp: new Date().toISOString(),
        ...metadata,
      };
      console.log(formatLogEntry(entry));
    },
    warn(message: string, metadata?: Record<string, unknown>): void {
      const entry: LogEntry = {
        level: "warn",
        message,
        timestamp: new Date().toISOString(),
        ...metadata,
      };
      console.warn(formatLogEntry(entry));
    },
    error(message: string, metadata?: Record<string, unknown>): void {
      const entry: LogEntry = {
        level: "error",
        message,
        timestamp: new Date().toISOString(),
        ...metadata,
      };
      console.error(formatLogEntry(entry));
    },
    debug(message: string, metadata?: Record<string, unknown>): void {
      if (process.env.NODE_ENV === "development") {
        const entry: LogEntry = {
          level: "debug",
          message,
          timestamp: new Date().toISOString(),
          ...metadata,
        };
        console.debug(formatLogEntry(entry));
      }
    },
  };
}

export const logger = createLogger();
