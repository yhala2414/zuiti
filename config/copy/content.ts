/**
 * Shared demo content used by pages and reusable UI.
 * Update here when product-facing scene/style/result labels need to change.
 */
export type SceneKind = "student" | "work" | "social" | "formal";
export type IconKind =
  | SceneKind
  | "snail"
  | "hourglass"
  | "redirect"
  | "bell"
  | "translate"
  | "spark"
  | "contrast";

export const scenes = [
  {
    key: "student" as const,
    title: "学生沟通",
    subtitle: "与老师同学",
    href: "/input?scene=student",
    icon: "student" as const,
    context: "默认偏礼貌、偏正式",
  },
  {
    key: "work" as const,
    title: "职场沟通",
    subtitle: "与同事领导",
    href: "/input?scene=work",
    icon: "work" as const,
    context: "默认偏清晰、有边界",
  },
  {
    key: "social" as const,
    title: "社交沟通",
    subtitle: "与朋友合作方",
    href: "/input?scene=social",
    icon: "social" as const,
    context: "默认偏自然、柔和",
  },
  {
    key: "formal" as const,
    title: "正式事务",
    subtitle: "与机构/行政",
    href: "/input?scene=formal",
    icon: "formal" as const,
    context: "默认偏书面、正式",
  },
] as const;

export const expressionStyles = [
  {
    key: "delay" as const,
    title: "先别急",
    icon: "snail" as const,
    detail: "体面延期",
  },
  {
    key: "refuse" as const,
    title: "婉拒了哈",
    icon: "hourglass" as const,
    detail: "柔和拒绝",
  },
  {
    key: "boundary" as const,
    title: "别甩给我",
    icon: "redirect" as const,
    detail: "边界清晰",
  },
  {
    key: "followup" as const,
    title: "该交了吧",
    icon: "bell" as const,
    detail: "礼貌推进",
  },
  {
    key: "decode" as const,
    title: "翻译一下",
    icon: "translate" as const,
    detail: "转译语气",
  },
  {
    key: "sarcasm" as const,
    title: "阴阳一下",
    icon: "contrast" as const,
    detail: "微妙反差",
  },
] as const;

/**
 * Static result metadata stays centralized here; live result body text comes from the API.
 */
export const resultCards = [
  {
    mode: "wechat" as const,
    label: "微信短句版",
    tone: "lavender",
    icon: "wechat" as const,
    fit: "适合微信/IM",
    tags: ["礼貌但坚定", "边界清晰", "适合微信"],
    text: "这件事我不太负责啦～\n建议找下对应的同事，我这边就不参与啦。",
  },
  {
    mode: "email" as const,
    label: "邮件正式版",
    tone: "blue",
    icon: "mail" as const,
    fit: "适合邮件/书面沟通",
    tags: ["正式清晰", "适合向上沟通", "不失礼貌"],
    text: "您好，这个事项目前不在我的负责范围内，建议您联系相关负责同事以获得更准确的回复。\n如需我提供相关信息，请随时告知，我会尽力配合。",
  },
  {
    mode: "spoken" as const,
    label: "当面沟通版",
    tone: "pink",
    icon: "face" as const,
    fit: "适合当面沟通",
    tags: ["像朋友说话", "温和推进", "减少冲突"],
    text: "这个我不太负责诶，可能找 XX 同事更合适。\n我可以帮你拉一下他～",
  },
] as const;
