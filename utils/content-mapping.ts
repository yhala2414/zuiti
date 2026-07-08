import type {
  ExpressionStyle,
  OutputMode,
  Scene,
  TargetId,
} from "@/stores/expression-flow-store";

export const sceneKeys = ["student", "work", "social", "formal"] as const satisfies readonly Scene[];
export const styleKeys = [
  "delay",
  "refuse",
  "boundary",
  "followup",
  "decode",
  "sarcasm",
] as const satisfies readonly ExpressionStyle[];
export const outputModeKeys = ["wechat", "email", "spoken"] as const satisfies readonly OutputMode[];
export const targetKeys = [
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
] as const satisfies readonly TargetId[];

export const prdStyleAliases = {
  reject: "refuse",
  urge: "followup",
  translate: "decode",
} as const satisfies Record<string, ExpressionStyle>;

export function isScene(value: string | null): value is Scene {
  return sceneKeys.includes(value as Scene);
}

export function isStyle(value: string | null): value is ExpressionStyle {
  return styleKeys.includes(value as ExpressionStyle);
}

export function normalizeStyle(value: string | null): ExpressionStyle | null {
  if (isStyle(value)) {
    return value;
  }

  return value ? prdStyleAliases[value as keyof typeof prdStyleAliases] ?? null : null;
}

export function isTarget(value: string | null): value is TargetId {
  return targetKeys.includes(value as TargetId);
}

export function getStyleIndex(style: ExpressionStyle) {
  return styleKeys.indexOf(style);
}

export function getStyleByIndex(index: number): ExpressionStyle {
  return styleKeys[index] ?? "boundary";
}
