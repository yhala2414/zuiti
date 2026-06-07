import { createLocalizedFallbackCopy } from "@/config";
import { fallbackSafetyNote } from "@/lib/domain/defaults";
import type { GenerateResult, GenerationMeta } from "@/lib/domain/enums";
import type { GenerateRequest } from "@/lib/validators/generate";
import { GeneratedResultSchema } from "./schema";

type ResultMetaOptions = {
  language: GenerationMeta["language"];
  note?: string;
};

export function createFallbackResult(
  request: GenerateRequest,
  { language, note = fallbackSafetyNote }: ResultMetaOptions,
): GenerateResult {
  return {
    ...createLocalizedFallbackCopy(language, request.style, request.text, note),
    meta: {
      source: "fallback",
      language,
    },
  };
}

export function normalizeGeneratedResult(value: unknown, meta: GenerationMeta): GenerateResult | null {
  const parsed = GeneratedResultSchema.safeParse(value);
  if (!parsed.success) {
    return null;
  }

  return {
    ...parsed.data,
    meta,
  };
}
