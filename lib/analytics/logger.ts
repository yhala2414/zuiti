import type { AnalyticsEvent } from "./events";

type LogPayload = Record<string, unknown>;

function redactPayload(payload: LogPayload): LogPayload {
  const redacted: LogPayload = {};

  for (const [key, value] of Object.entries(payload)) {
    if (key === "text" && typeof value === "string") {
      redacted.textPreview = value.slice(0, 24);
      redacted.textLength = value.length;
      continue;
    }

    redacted[key] = value;
  }

  return redacted;
}

export function logEvent(event: AnalyticsEvent, payload: LogPayload = {}) {
  console.info(
    "[zuiti:event]",
    JSON.stringify({
      event,
      at: new Date().toISOString(),
      ...redactPayload(payload),
    }),
  );
}
