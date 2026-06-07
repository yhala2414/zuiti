/**
 * Migration audit for backend-bff-state T037-T042 frontend scope.
 * Use this as the single checklist for where copy was moved and what is still pending.
 */
export const copyMigrationAudit = {
  pageCopy: [
    "app/layout.tsx",
    "app/page.tsx",
    "app/input/page.tsx",
    "app/tone/page.tsx",
    "app/results/page.tsx",
  ],
  componentCopy: [
    "components/TopBar.tsx",
    "components/ResultCard.tsx",
    "components/BottomNav.tsx",
    "components/content.ts",
  ],
  apiErrorCopy: [
    "app/api/generate/route.ts",
    "app/api/feedback/route.ts",
    "app/api/track/route.ts",
    "utils/expression-api.ts",
  ],
  fallbackCopy: [
    "app/tone/page.tsx",
    "app/results/page.tsx",
    "config/copy/content.ts",
  ],
  promptCopy: [
    {
      file: "lib/llm/prompts.ts",
      status: "pending",
      note: "Prompt 文本迁移属于 T041 的服务端范围，当前提交只先建立 config/prompts 目录契约。",
    },
  ],
} as const;
