import { analyticsEvents } from "@/lib/analytics/events";
import { logEvent } from "@/lib/analytics/logger";
import type { FeedbackRequest } from "@/lib/validators/feedback";

export async function submitFeedback(request: FeedbackRequest) {
  logEvent(analyticsEvents.feedbackSubmitted, {
    sessionId: request.sessionId,
    resultId: request.resultId,
    useful: request.useful,
    reasonTags: request.reasonTags,
  });

  return { ok: true as const };
}
