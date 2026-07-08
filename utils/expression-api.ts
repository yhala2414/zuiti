import type { GenerateDraft, GenerateResult } from "@/stores/expression-flow-store";
import { postJson } from "@/utils/api-client";

type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiFailure = {
  ok: false;
  code: string;
  message: string;
  data?: unknown;
};

export type GenerateApiResponse = ApiSuccess<GenerateResult> | ApiFailure;

type FeedbackPayload = {
  sessionId: string;
  resultId: string;
  useful: boolean;
  reasonTags?: string[];
};

type TrackPayload = {
  sessionId: string;
  event: string;
  payload?: Record<string, unknown>;
};

export function generateExpression(draft: GenerateDraft) {
  return postJson<GenerateApiResponse>("/api/generate", draft);
}

export function sendFeedback(payload: FeedbackPayload) {
  return postJson<ApiSuccess<{ received?: boolean }> | ApiFailure>("/api/feedback", payload);
}

export function trackEvent(payload: TrackPayload) {
  return postJson<ApiSuccess<{ received?: boolean }> | ApiFailure>("/api/track", payload);
}
