import { z } from "zod";

const CandidateTupleSchema = z
  .array(z.string().trim().min(1).max(600))
  .length(3)
  .transform((value) => value as [string, string, string]);

export const OutputResultSchema = z.object({
  candidates: CandidateTupleSchema,
  recommendedIndex: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  reasons: z.array(z.string().trim().min(1).max(120)).min(1).max(3),
});

export const GeneratedResultSchema = z.object({
  wechat: OutputResultSchema,
  email: OutputResultSchema,
  spoken: OutputResultSchema,
  assumptions: z.array(z.string().trim().min(1).max(160)).max(3).default([]),
  safetyNotes: z.array(z.string().trim().min(1).max(160)).max(3).default([]),
});

export type GeneratedResult = z.infer<typeof GeneratedResultSchema>;
