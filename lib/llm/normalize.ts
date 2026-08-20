import { createLocalizedFallbackCopy } from "@/config/copy/fallback";
import { fallbackSafetyNote } from "@/lib/domain/defaults";
import { outputModes, type GenerateResult, type GenerationMeta, type OutputMode } from "@/lib/domain/enums";
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
    return normalizeLooseGeneratedResult(value, meta);
  }

  return {
    ...parsed.data,
    meta,
  };
}

function normalizeLooseGeneratedResult(value: unknown, meta: GenerationMeta): GenerateResult | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const source = value as Record<string, unknown>;
  const normalizedModes = Object.fromEntries(
    outputModes.map((mode) => [mode, normalizeLooseOutput(source[mode], mode)]),
  ) as Pick<GenerateResult, OutputMode>;

  if (outputModes.some((mode) => normalizedModes[mode] === null)) {
    return null;
  }

  return {
    wechat: normalizedModes.wechat,
    email: normalizedModes.email,
    spoken: normalizedModes.spoken,
    assumptions: normalizeStringArray(source.assumptions, 3, 300),
    safetyNotes: normalizeStringArray(source.safetyNotes, 3, 300),
    meta,
  };
}

function normalizeLooseOutput(value: unknown, mode: OutputMode) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const source = value as Record<string, unknown>;
  const candidates = normalizeStringArray(source.candidates, 3, 1200);

  if (candidates.length < 3) {
    return null;
  }

  const rawIndex = Number(source.recommendedIndex);
  const recommendedIndex = rawIndex === 1 || rawIndex === 2 ? rawIndex : 0;
  const reasons = normalizeStringArray(source.reasons, 3, 240);

  return {
    candidates: candidates.slice(0, 3) as [string, string, string],
    recommendedIndex,
    reasons: reasons.length > 0 ? reasons : [`${mode} result from model output`],
  };
}

function normalizeStringArray(value: unknown, maxItems: number, maxLength: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, maxItems)
    .map((item) => item.slice(0, maxLength));
}
