import type {
  ExpressionStyle,
  OutputMode,
  Scene,
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

export function isScene(value: string | null): value is Scene {
  return sceneKeys.includes(value as Scene);
}

export function getStyleIndex(style: ExpressionStyle) {
  return styleKeys.indexOf(style);
}

export function getStyleByIndex(index: number): ExpressionStyle {
  return styleKeys[index] ?? "boundary";
}
