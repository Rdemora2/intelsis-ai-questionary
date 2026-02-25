import { randomUUID } from "crypto";

export function createRequestId(): string {
  return randomUUID();
}

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

export function log(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  const output = JSON.stringify(entry);

  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export function logRequest(
  requestId: string,
  method: string,
  path: string,
  statusCode: number,
  durationMs: number
): void {
  log("info", "request_completed", {
    request_id: requestId,
    method,
    path,
    status_code: statusCode,
    duration_ms: durationMs,
  });
}

export function logError(
  requestId: string,
  error: unknown,
  context?: string
): void {
  const message = error instanceof Error ? error.message : String(error);
  log("error", "error_occurred", {
    request_id: requestId,
    error: message,
    context,
  });
}
