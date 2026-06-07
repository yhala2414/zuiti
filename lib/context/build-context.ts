import {
  formatPromptFewShots,
  promptLanguageInstructions,
  promptLanguageLabels,
  promptSceneLabels,
  promptStyleLabels,
} from "@/config";
import type { ResolvedLanguage } from "@/lib/domain/enums";
import type { GenerateRequest } from "@/lib/validators/generate";
import { inferPrimaryLanguage } from "./infer-language";

export type GenerationContext = {
  language: ResolvedLanguage;
  languageLabel: string;
  languageInstruction: string;
  sceneLabel: string;
  styleLabel: string;
  styleFewShots: string;
  toneSummary: string;
  sessionId?: string;
  previousContext: string;
};

export function buildGenerationContext(request: GenerateRequest): GenerationContext {
  const language = inferPrimaryLanguage(request.text);

  return {
    language,
    languageLabel: promptLanguageLabels[language],
    languageInstruction: promptLanguageInstructions[language],
    sceneLabel: promptSceneLabels[request.scene],
    styleLabel: promptStyleLabels[request.style],
    styleFewShots: formatPromptFewShots(request.style),
    toneSummary: [
      `礼貌度 ${request.sliders.politeness}/100`,
      `正式度 ${request.sliders.formality}/100`,
      `距离感 ${request.sliders.distance}/100`,
    ].join("，"),
    sessionId: request.context?.sessionId,
    previousContext: request.context?.prev ? JSON.stringify(request.context.prev).slice(0, 800) : "无",
  };
}
