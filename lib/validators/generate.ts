import { z } from "zod";
import {
  defaultOutputModes,
  defaultToneSliders,
  maxInputTextLength,
  minInputTextLength,
} from "@/lib/domain/defaults";
import { expressionStyles, operations, outputModes, scenes, targets } from "@/lib/domain/enums";

const ToneSlidersSchema = z.object({
  politeness: z.coerce.number().int().min(0).max(100),
  formality: z.coerce.number().int().min(0).max(100),
  distance: z.coerce.number().int().min(0).max(100),
});

export const GenerateRequestSchema = z.object({
  text: z
    .string()
    .trim()
    .min(minInputTextLength, "text is too short")
    .max(maxInputTextLength, "text is too long"),
  scene: z.enum(scenes),
  target: z.enum(targets).optional(),
  style: z.enum(expressionStyles),
  sliders: ToneSlidersSchema.default(defaultToneSliders),
  outputModes: z.array(z.enum(outputModes)).min(1).default(defaultOutputModes),
  operation: z.enum(operations).default("generate"),
  context: z
    .object({
      sessionId: z.string().trim().max(120).optional(),
      prev: z.unknown().optional().nullable(),
    })
    .optional(),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
