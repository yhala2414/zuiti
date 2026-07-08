/**
 * Shared demo content used by pages and reusable UI.
 * Update here when product-facing scene/style/result labels need to change.
 */
export type SceneKind = "student" | "work" | "social" | "formal";
export type TargetKind =
  | "mentor"
  | "peer"
  | "admin"
  | "manager"
  | "colleague"
  | "cross"
  | "client"
  | "friend"
  | "partner"
  | "stranger"
  | "gov"
  | "school_admin"
  | "service"
  | "institution";
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
    prdKey: "campus" as const,
    title: "校园",
    subtitle: "老师 / 同学 / 行政",
    href: "/input?scene=student",
    icon: "student" as const,
    context: "默认偏礼貌、偏正式",
  },
  {
    key: "work" as const,
    prdKey: "workplace" as const,
    title: "职场",
    subtitle: "上级 / 同事 / 客户",
    href: "/input?scene=work",
    icon: "work" as const,
    context: "默认偏清晰、有边界",
  },
  {
    key: "social" as const,
    prdKey: "social" as const,
    title: "社交沟通",
    subtitle: "朋友 / 伴侣 / 陌生人",
    href: "/input?scene=social",
    icon: "social" as const,
    context: "默认偏自然、柔和",
  },
  {
    key: "formal" as const,
    prdKey: "formal" as const,
    title: "正式事务",
    subtitle: "政务 / 学校 / 服务方",
    href: "/input?scene=formal",
    icon: "formal" as const,
    context: "默认偏书面、正式",
  },
] as const;

export const targetOptionsByScene = {
  student: [
    { key: "mentor", title: "老师/导师", detail: "需要尊重、清晰表达诉求" },
    { key: "peer", title: "同学/同辈", detail: "自然一点，避免太生硬" },
    { key: "admin", title: "学校行政", detail: "正式、准确、便于处理" },
  ],
  work: [
    { key: "manager", title: "上级/领导", detail: "稳妥、留有余地" },
    { key: "colleague", title: "同事", detail: "合作友好，同时守住边界" },
    { key: "cross", title: "跨部门", detail: "说明背景和责任边界" },
    { key: "client", title: "客户/外部", detail: "更正式，降低误解风险" },
  ],
  social: [
    { key: "friend", title: "朋友", detail: "像正常聊天，不端着" },
    { key: "partner", title: "伴侣/亲近的人", detail: "照顾感受，也说清需要" },
    { key: "stranger", title: "陌生人", detail: "保持距离，表达明确" },
  ],
  formal: [
    { key: "gov", title: "政务窗口", detail: "礼貌、正式、诉求明确" },
    { key: "school_admin", title: "学校部门", detail: "信息完整，便于推进" },
    { key: "service", title: "客服/服务方", detail: "说明问题和期望处理" },
    { key: "institution", title: "机构/单位", detail: "书面、稳妥、可转发" },
  ],
} as const;

export const expressionStyles = [
  {
    key: "delay" as const,
    prdKey: "delay" as const,
    title: "先别急",
    icon: "snail" as const,
    detail: "体面延期，争取时间。",
    description: "把“现在不方便/需要更多时间”说得更稳妥，让对方知道你不是消失，而是在给出可接受的节奏。",
  },
  {
    key: "refuse" as const,
    prdKey: "reject" as const,
    title: "婉拒了哈",
    icon: "hourglass" as const,
    detail: "优雅拒绝，不撕破脸。",
    description: "把拒绝说得不伤人，说明限制和原因，同时给对方一个可接受的替代方向。",
  },
  {
    key: "boundary" as const,
    prdKey: "boundary" as const,
    title: "别甩给我",
    icon: "redirect" as const,
    detail: "划清边界，避免背锅。",
    description: "把责任边界说清楚，不硬怼、不背锅，让对方知道该找谁、你能配合到哪里。",
  },
  {
    key: "followup" as const,
    prdKey: "urge" as const,
    title: "该交了吧",
    icon: "bell" as const,
    detail: "礼貌推进，让对方行动。",
    description: "把催促变成推进，说明时间点、影响和下一步，让对方更容易行动。",
  },
  {
    key: "decode" as const,
    prdKey: "translate" as const,
    title: "翻译一下",
    icon: "translate" as const,
    detail: "识别潜台词，看懂真实意思。",
    description: "把太直、太冲或太绕的话转成更适合当前对象理解和接受的表达。",
  },
  {
    key: "sarcasm" as const,
    prdKey: "sarcasm" as const,
    title: "阴阳一下",
    icon: "contrast" as const,
    detail: "阴阳怪气，但不直接翻车。",
    description: "保留一点态度，但降低攻击性，适合轻微表达不满或反差感。",
  },
] as const;

export const exampleTextsByTarget = {
  mentor: "老师您好，我这周时间有点紧，论文初稿可能没法按原计划交。",
  peer: "这个小组任务不是我负责的部分，但大家一直来问我。",
  admin: "老师您好，我想咨询一下材料提交后一直没有反馈，想确认现在进度。",
  manager: "这个需求现在排期比较紧，如果今天加进来，原来的任务可能会延期。",
  colleague: "这块不是我负责的范围，但对方一直让我处理。",
  cross: "这个事项涉及你们部门的确认，我这边无法直接拍板。",
  client: "这个需求目前不在本次交付范围内，需要单独确认排期和成本。",
  friend: "我今天真的有点累，不太想参加聚会。",
  partner: "我不是不想聊，只是你这样说的时候我会有点压力。",
  stranger: "不好意思，我不太方便提供这个信息。",
  gov: "您好，我想咨询一下材料已提交后的办理进度和下一步需要补充的内容。",
  school_admin: "老师您好，我想确认一下申请材料是否已经收到，以及预计处理时间。",
  service: "您好，我遇到的问题还没有解决，希望能帮我确认具体处理方案。",
  institution: "您好，关于此前提交的事项，想请贵单位协助确认当前进展。",
} as const;

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
