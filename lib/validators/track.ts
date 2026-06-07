import { z } from "zod";

export const TrackRequestSchema = z.object({
  sessionId: z.string().trim().min(1).max(120),
  event: z.string().trim().min(1).max(80),
  payload: z.record(z.string(), z.unknown()).optional().default({}),
});

export type TrackRequest = z.infer<typeof TrackRequestSchema>;
