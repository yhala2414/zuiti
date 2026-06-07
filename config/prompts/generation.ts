import type { ExpressionStyle, ResolvedLanguage, Scene } from "@/lib/domain/enums";

/**
 * Prompt text for the expression generation chain.
 * Update here when product strategy, tone boundaries, or model-facing wording changes.
 */
export const generationPromptCopy = {
  systemLines: [
    "你是“话到嘴边”的表达转换引擎，只服务场景化沟通改写。",
    "不要写成通用聊天，不要解释过程，不要输出 Markdown。",
    "必须只输出一个 JSON 对象，字段固定为 wechat、email、spoken、assumptions、safetyNotes。",
    "wechat/email/spoken 各包含 candidates 三条、recommendedIndex 0-2、reasons 1-3 条。",
    "表达要安全、可直接使用、降低冲突风险。sarcasm 只能轻微反差，不能攻击羞辱。",
    "few-shot 样例用于学习表达策略，不要照抄样例内容，不要编造事实。",
  ] as const,
  humanLines: [
    "场景：{sceneLabel}",
    "风格：{styleLabel}",
    "当前风格 few-shot 参考：\n{styleFewShots}",
    "语气参数：{toneSummary}",
    "主语言：{languageLabel}",
    "语言要求：{languageInstruction}",
    "操作：{operation}",
    "输出模式：{outputModes}",
    "上一轮上下文：{previousContext}",
    "用户原话：{text}",
    "请严格返回 JSON 对象，不要输出 Markdown、代码块或额外解释。",
  ] as const,
} as const;

/**
 * Prompt-only labels for scene and style. They can differ from UI copy but remain centralized.
 */
export const promptSceneLabels: Record<Scene, string> = {
  student: "学生沟通：老师、同学、课程或校园事务",
  work: "职场沟通：同事、上级、协作与边界",
  social: "社交沟通：朋友、合作方、熟人关系",
  formal: "正式事务：机构、行政、书面沟通",
};

export const promptStyleLabels: Record<ExpressionStyle, string> = {
  delay: "缓一缓：体面延期，争取时间",
  refuse: "不方便：优雅拒绝，不撕破脸",
  boundary: "这锅不背：划清边界，避免背锅",
  followup: "催一催：礼貌推进，让对方行动",
  decode: "话里有话：识别潜台词，看懂真实意思",
  sarcasm: "礼貌带刺：阴阳怪气，但不直接翻车",
};

export const promptLanguageLabels: Record<ResolvedLanguage, string> = {
  "zh-CN": "简体中文",
  en: "English",
  ja: "日本语",
  ko: "한국어",
};

export const promptLanguageInstructions: Record<ResolvedLanguage, string> = {
  "zh-CN": "请使用简体中文输出全部候选、理由、假设和安全备注，必要时保留专有名词原文。",
  en: "Write every candidate, reason, assumption, and safety note in natural English. Keep proper nouns in the original form when helpful.",
  ja: "候选文、理由、前提、安全备注はすべて自然な日本语で出力してください。固有名词は必要に応じて原文を残してください。",
  ko: "모든 후보 문장, 이유, 가정, 안전 메모를 자연스러운 한국어로 작성하세요. 필요하면 고유명사는 원문을 유지하세요.",
};
