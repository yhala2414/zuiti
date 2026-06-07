/**
 * Reusable component copy under components/.
 * Update shared button labels, aria text, and navigation labels here.
 */
export const topBarCopy = {
  backAriaLabel: "返回",
} as const;

export const resultCardCopy = {
  tagsAriaLabel: "表达标签",
  copyAction: "复制",
  usefulAction: "有用",
  regenerateAction: "再润色",
  switchStyleAction: "换风格",
} as const;

export const bottomNavCopy = {
  activeKey: "home",
  items: [
    { key: "home", label: "首页", icon: "home" },
    { key: "note", label: "历史", icon: "note" },
    { key: "meter", label: "语气", icon: "meter" },
    { key: "user", label: "我的", icon: "user" },
  ],
} as const;
