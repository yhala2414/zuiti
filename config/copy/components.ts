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
  usefulActiveAction: "已记录",
  regenerateAction: "再润色",
  switchStyleAction: "换风格",
  expandAction: "展开",
  collapseAction: "收起",
} as const;

export const bottomNavCopy = {
  activeKey: "home",
  unavailableMessage: "这个入口后续版本开放",
  items: [
    { key: "home", label: "首页", icon: "home", href: "/" },
    { key: "note", label: "历史", icon: "note", href: "/history" },
    { key: "meter", label: "语气", icon: "meter", href: "/tone" },
    { key: "user", label: "我的", icon: "user", href: "/profile" },
  ],
} as const;
