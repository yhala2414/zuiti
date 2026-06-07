import type { ResolvedLanguage } from "@/lib/domain/enums";

const latinPattern = /[A-Za-z]/g;
const cjkPattern = /[\u4e00-\u9fff]/g;
const hiraganaKatakanaPattern = /[\u3040-\u30ff]/g;
const hangulPattern = /[\uac00-\ud7af]/g;

function countMatches(text: string, pattern: RegExp) {
  return text.match(pattern)?.length ?? 0;
}

export function inferPrimaryLanguage(text: string): ResolvedLanguage {
  const source = text.trim();

  if (!source) {
    return "zh-CN";
  }

  const japaneseScore = countMatches(source, hiraganaKatakanaPattern) * 3;
  const koreanScore = countMatches(source, hangulPattern) * 3;

  if (japaneseScore > 0 && japaneseScore >= koreanScore) {
    return "ja";
  }

  if (koreanScore > 0) {
    return "ko";
  }

  const cjkScore = countMatches(source, cjkPattern);
  const latinScore = countMatches(source, latinPattern);

  if (cjkScore === 0 && latinScore === 0) {
    return "zh-CN";
  }

  if (cjkScore >= latinScore) {
    return "zh-CN";
  }

  return "en";
}
