import { apiErrorCopy } from "@/config";
import type { GenerateDraft, GenerateResult } from "@/stores/expression-flow-store";

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

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as T | null;

  if (!response.ok && data === null) {
    return {
      ok: false,
      code: "NETWORK_ERROR",
      message: apiErrorCopy.networkError,
    } as T;
  }

  return data as T;
}

export function generateExpression(draft: GenerateDraft) {
  return postJson<GenerateApiResponse>("/api/generate", draft);
}

export function sendFeedback(payload: FeedbackPayload) {
  return postJson<ApiSuccess<{ received?: boolean }> | ApiFailure>("/api/feedback", payload);
}

export function trackEvent(payload: TrackPayload) {
  return postJson<ApiSuccess<{ received?: boolean }> | ApiFailure>("/api/track", payload);
}
