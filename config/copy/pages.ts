/**
 * Page-level copy for route components under app/.
 * Keep route titles, CTA labels, empty states, and demo hints centralized here.
 */
export const appMetadataCopy = {
  title: "话到嘴边",
  description: "年轻人的场景表达转换器",
} as const;

export const homePageCopy = {
  topLabel: "年轻人的场景表达转换器",
  profileAriaLabel: "我的收藏",
  heroTitle: "话到嘴边",
  heroSubtitleLines: ["把不好开口的话，", "换一种更合适的表达"] as const,
  heroDescription: "帮你把真实想法，转成适合不同对象、不同场景的表达版本",
  recentSectionTitle: "最近使用",
  recentSectionAction: "查看全部",
  recentCardTitle: "关于周末活动分工的沟通",
  recentCardSubtitle: "职场沟通 · 别甩给我",
  recentCardMeta: "刚刚",
  hotSectionTitle: "热门风格",
  primaryAction: "开始转换",
} as const;

export const inputPageCopy = {
  title: "你想说的话",
  exampleAction: "示例",
  clearAction: "清空",
  exampleRawText: "这个活不是我负责的，别老找我。",
  fieldLabel: "对什么人，说什么话",
  emptySceneHint: "一句原话，也可以有更好的说法",
  textAreaPlaceholder: "在这里输入你想说的话...\n\n例如：这个活不是我负责的，别老找我。",
  styleSectionTitle: "选择风格",
  styleSectionHint: "左右滑动选择",
  readyHint: "左右滑动，选择你喜欢的风格",
  blockedHint: "先输入至少 2 个字，再继续生成",
  primaryAction: "开始转换",
} as const;

export const tonePageCopy = {
  title: "语气仪表盘",
  subtitle: "微调语气，让表达更贴近你的意图",
  resetAction: "重置",
  missingDraftTitle: "还差一句原话",
  missingDraftBadge: "待补充",
  missingDraftDescription: "先回到输入页，选择场景并写下你想表达的真实想法。",
  previewTitle: "表达预览",
  previewBadge: "实时预览",
  previewSamples: {
    formalHigh: "您好，关于您提到的事项目前不在我的负责范围内，建议联系对应负责人确认，我会尽力配合需要的信息。",
    distanceLow: "这个我不太负责诶，可能找对应同事更合适，我可以帮你问问该找谁～",
    politenessHigh: "这件事我这边可能不太负责，建议你联系对应同事确认一下，会更准确一些。",
    default: "我理解你的需求，这个部分目前不在我的负责范围内，我可以帮你确认负责的同事是谁～",
  },
  sliders: {
    politeness: {
      title: "礼貌程度",
      left: "直接",
      right: "礼貌",
      hint: "语气更礼貌，表达更照顾对方感受",
    },
    formality: {
      title: "正式程度",
      left: "日常",
      right: "正式",
      hint: "表达更正式，适合书面或职场场景",
    },
    distance: {
      title: "关系距离",
      left: "熟人",
      right: "陌生/上级",
      hint: "保持适当距离，表达更得体",
    },
  },
  generateAction: "生成结果",
  backToInputAction: "返回输入",
} as const;

export const resultsPageCopy = {
  title: "转换结果",
  subtitle: "根据你的当前草稿实时生成结果",
  saveAction: "收藏",
  shareAction: "分享",
  originalLabel: "原话",
  emptyOriginal: "还没有输入原话，请先回到输入页补充。",
  successModelTitle: "真实模型已生成",
  successModelDescription: "当前结果来自后端模型链路，可继续复制、反馈或再润色。",
  successFallbackTitle: "已切到演示兜底",
  successFallbackDescription: "当前结果来自本地 fallback，用于保证 demo 可演示，不代表真实模型已生效。",
  metaSourceLabel: "生成来源",
  metaLanguageLabel: "输出语言",
  sourceLabels: {
    model: "model",
    fallback: "fallback",
  },
  languageLabels: {
    "zh-CN": "中文",
    en: "English",
    ja: "日本語",
    ko: "한국어",
  },
  missingDraftTitle: "还不能生成结果",
  missingDraftDescription: "请先选择沟通场景，并输入至少 2 个字的真实想法。",
  missingDraftAction: "返回输入",
  loadingTitle: "正在生成",
  loadingDescription: "正在把你的真实想法转换成更适合发送、书写和当面表达的版本。",
  refusedTitle: "这句话需要换个目标",
  refusedFallbackMessage: "当前表达风险较高，请改为描述事实、影响和诉求。",
  refusedAction: "修改原话",
  failTitle: "生成暂时失败",
  failFallbackMessage: "服务暂时不可用，请稍后再试。",
  retryAction: "重试一次",
  compareAction: "查看“原话 → 优化版”的变化点",
  adjustToneAction: "再调整语气",
  switchStyleAction: "换一种风格",
} as const;
