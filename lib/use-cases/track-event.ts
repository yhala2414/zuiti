import { analyticsEvents } from "@/lib/analytics/events";
import { logEvent } from "@/lib/analytics/logger";
import type { TrackRequest } from "@/lib/validators/track";

export async function trackEvent(request: TrackRequest) {
  logEvent(analyticsEvents.userTracked, {
    sessionId: request.sessionId,
    event: request.event,
    payload: request.payload,
  });

  return { ok: true as const };
}
