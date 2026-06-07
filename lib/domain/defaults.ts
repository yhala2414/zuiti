import { outputModes, type OutputMode, type ToneSliders } from "./enums";

export const defaultToneSliders: ToneSliders = {
  politeness: 60,
  formality: 50,
  distance: 70,
};

export const defaultOutputModes: OutputMode[] = [...outputModes];

export const maxInputTextLength = 800;
export const minInputTextLength = 2;

export const modelTimeoutMs = 45_000;

export const fallbackSafetyNote = "已使用本地演示兜底生成，建议上线前配置真实模型。";
