import type { GenerateResult } from "@/lib/domain/enums";

const unsafeOutputPatterns = [/去死|弄死|报复|人肉|开盒|傻逼|废物|垃圾/u];

export function isGeneratedResultSafe(result: GenerateResult) {
  const allText = [
    ...result.wechat.candidates,
    ...result.email.candidates,
    ...result.spoken.candidates,
  ].join("\n");

  return !unsafeOutputPatterns.some((pattern) => pattern.test(allText));
}
