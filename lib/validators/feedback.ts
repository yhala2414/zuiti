import { z } from "zod";

export const FeedbackRequestSchema = z.object({
  sessionId: z.string().trim().min(1).max(120),
  resultId: z.string().trim().min(1).max(120),
  useful: z.boolean(),
  reasonTags: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
});

export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;
