import test from "node:test";
import assert from "node:assert/strict";
import type { GenerateResult } from "../lib/domain/enums";
import { getTonePreviewText } from "../lib/tone/preview";

const generatedResult: GenerateResult = {
  wechat: {
    candidates: ["微信候选 1", "AI 推荐微信文案", "微信候选 3"],
    recommendedIndex: 1,
    reasons: ["更自然"],
  },
  email: {
    candidates: ["邮件候选 1", "邮件候选 2", "邮件候选 3"],
    recommendedIndex: 0,
    reasons: ["更正式"],
  },
  spoken: {
    candidates: ["口语候选 1", "口语候选 2", "口语候选 3"],
    recommendedIndex: 2,
    reasons: ["更顺口"],
  },
  assumptions: [],
  safetyNotes: [],
  meta: {
    source: "model",
    language: "zh-CN",
  },
};

test("uses generated recommended wechat copy when AI result exists", () => {
  const previewText = getTonePreviewText({
    fallbackPreview: "静态占位文案",
    generatedResult,
  });

  assert.equal(previewText, "AI 推荐微信文案");
});

test("falls back to static preview when no AI result exists", () => {
  const previewText = getTonePreviewText({
    fallbackPreview: "静态占位文案",
    generatedResult: null,
  });

  assert.equal(previewText, "静态占位文案");
});
