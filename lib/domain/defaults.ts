import {
  outputModes,
  type ExpressionStyle,
  type OutputMode,
  type Scene,
  type TargetId,
  type ToneSliders,
} from "./enums";

export const defaultToneSliders: ToneSliders = {
  politeness: 60,
  formality: 50,
  distance: 70,
};

export const sceneDefaultStyles: Record<Scene, ExpressionStyle> = {
  student: "followup",
  work: "boundary",
  social: "refuse",
  formal: "delay",
};

export const sceneDefaultSliders: Record<Scene, ToneSliders> = {
  student: {
    politeness: 78,
    formality: 68,
    distance: 58,
  },
  work: {
    politeness: 76,
    formality: 58,
    distance: 62,
  },
  social: {
    politeness: 72,
    formality: 38,
    distance: 36,
  },
  formal: {
    politeness: 84,
    formality: 86,
    distance: 78,
  },
};

export const targetDefaultSliders: Partial<Record<TargetId, ToneSliders>> = {
  mentor: { politeness: 82, formality: 72, distance: 64 },
  peer: { politeness: 70, formality: 42, distance: 36 },
  admin: { politeness: 84, formality: 78, distance: 70 },
  manager: { politeness: 80, formality: 66, distance: 68 },
  colleague: { politeness: 72, formality: 52, distance: 48 },
  cross: { politeness: 76, formality: 62, distance: 60 },
  client: { politeness: 84, formality: 76, distance: 72 },
  friend: { politeness: 66, formality: 30, distance: 24 },
  partner: { politeness: 72, formality: 36, distance: 32 },
  stranger: { politeness: 78, formality: 54, distance: 68 },
  gov: { politeness: 88, formality: 90, distance: 82 },
  school_admin: { politeness: 86, formality: 86, distance: 76 },
  service: { politeness: 78, formality: 68, distance: 64 },
  institution: { politeness: 86, formality: 88, distance: 80 },
};

export function getContextDefaultSliders(scene: Scene, target: TargetId | null): ToneSliders {
  return target ? targetDefaultSliders[target] ?? sceneDefaultSliders[scene] : sceneDefaultSliders[scene];
}

export const defaultOutputModes: OutputMode[] = [...outputModes];

export const softInputTextLength = 300;
export const maxInputTextLength = 500;
export const minInputTextLength = 2;

export const modelTimeoutMs = 45_000;

export const fallbackSafetyNote = "已使用本地演示兜底生成，建议上线前配置真实模型。";
