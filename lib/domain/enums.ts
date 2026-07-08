export const scenes = ["student", "work", "social", "formal"] as const;
export type Scene = (typeof scenes)[number];

export const expressionStyles = [
  "delay",
  "refuse",
  "boundary",
  "followup",
  "decode",
  "sarcasm",
] as const;
export type ExpressionStyle = (typeof expressionStyles)[number];

export const outputModes = ["wechat", "email", "spoken"] as const;
export type OutputMode = (typeof outputModes)[number];

export const targets = [
  "mentor",
  "peer",
  "admin",
  "manager",
  "colleague",
  "cross",
  "client",
  "friend",
  "partner",
  "stranger",
  "gov",
  "school_admin",
  "service",
  "institution",
] as const;
export type TargetId = (typeof targets)[number];

export const operations = ["generate", "regenerate", "edit"] as const;
export type Operation = (typeof operations)[number];

export const resolvedLanguages = ["zh-CN", "en", "ja", "ko"] as const;
export type ResolvedLanguage = (typeof resolvedLanguages)[number];

export const generationSources = ["model", "fallback"] as const;
export type GenerateSource = (typeof generationSources)[number];

export type ToneSliders = {
  politeness: number;
  formality: number;
  distance: number;
};

export type OutputResult = {
  candidates: [string, string, string];
  recommendedIndex: 0 | 1 | 2;
  reasons: string[];
};

export type GenerationMeta = {
  source: GenerateSource;
  language: ResolvedLanguage;
};

export type GenerateResult = Record<OutputMode, OutputResult> & {
  assumptions: string[];
  safetyNotes: string[];
  meta: GenerationMeta;
};
