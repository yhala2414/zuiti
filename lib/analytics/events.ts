export const analyticsEvents = {
  generateStarted: "generate_started",
  generateSucceeded: "generate_succeeded",
  generateFailed: "generate_failed",
  feedbackSubmitted: "feedback_submitted",
  userTracked: "user_tracked",
} as const;

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents] | string;
