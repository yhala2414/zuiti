import type { GenerateResult } from "../domain/enums";

type TonePreviewTextOptions = {
  fallbackPreview: string;
  generatedResult: GenerateResult | null;
};

export function getTonePreviewText({
  fallbackPreview,
  generatedResult,
}: TonePreviewTextOptions) {
  if (!generatedResult) {
    return fallbackPreview;
  }

  const wechatOutput = generatedResult.wechat;
  return wechatOutput.candidates[wechatOutput.recommendedIndex] ?? wechatOutput.candidates[0] ?? fallbackPreview;
}
