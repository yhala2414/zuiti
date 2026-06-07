# config 目录维护说明

`config/` 是本项目集中维护“文案配置”和“Prompt 配置”的地方，目的是把会频繁调整、但不该散落在页面和模型链路里的文本统一收口。

当前结构：

```text
config/
  copy/       # 给用户看的文案、页面文案、组件文案、兜底文案、接口报错文案
  prompts/    # 给模型看的 Prompt 文本、Prompt 专用标签、多语言指令
  index.ts    # 对外统一导出
```

## 1. 先判断改哪里

改文案前，先看“这段文字主要是给谁看的”：

- 给用户直接看：改 `config/copy/`
- 给模型看，用来影响生成结果：改 `config/prompts/`
- 同一个概念同时涉及“用户展示”和“模型理解”：两边分别改，不要混放

快速判断示例：

- 首页标题、按钮名、空状态提示：`config/copy/`
- API 报错提示、fallback 兜底结果：`config/copy/`
- system prompt、human prompt、风格/场景的 Prompt 标签：`config/prompts/`
- “学生沟通”这种页面展示名和“学生沟通：老师、同学、课程或校园事务”这种 Prompt 描述，不是同一层配置，分别在 `copy` 和 `prompts`

## 2. config/copy 做什么

`config/copy/` 负责所有面向用户的稳定文案，目标是让页面、组件、接口提示和 Demo 兜底文本统一来源。

当前文件分工：

- `config/copy/pages.ts`
  - 页面级文案
  - 包含首页、输入页、语气页、结果页的标题、副标题、CTA、空状态、提示语
- `config/copy/components.ts`
  - 组件级复用文案
  - 包含顶部返回按钮、结果卡操作按钮、底部导航标签等
- `config/copy/content.ts`
  - Demo 展示内容
  - 包含场景卡、风格卡、静态结果卡等产品展示数据
- `config/copy/api.ts`
  - 用户可见的接口错误文案
  - 供路由和前端请求层共用，保证失败提示一致
- `config/copy/fallback.ts`
  - 模型不可用时的本地兜底表达
  - 这是“给用户看的结果”，虽然和生成有关，但仍属于用户展示文案
- `config/copy/audit.ts`
  - 文案迁移审计清单
  - 用于记录哪些文案已经迁移到 `config/`，通常不是日常产品文案修改入口
- `config/copy/index.ts`
  - `copy` 子目录统一导出入口

### 什么时候改 `config/copy`

出现以下情况时，优先检查这里：

- 产品改页面标题、按钮文案、提示语
- 需要统一组件上的操作文案
- 需要修改场景名、风格名、展示卡片文案
- 需要优化错误提示、拒答提示、加载提示
- 需要调整 Demo fallback 的中文或多语言表达

### 在哪改

常见需求与落点：

- 改首页、输入页、结果页文案：`config/copy/pages.ts`
- 改按钮、导航、卡片操作文字：`config/copy/components.ts`
- 改场景卡、风格卡、静态展示内容：`config/copy/content.ts`
- 改接口报错提示：`config/copy/api.ts`
- 改 fallback 兜底结果：`config/copy/fallback.ts`

## 3. config/prompts 做什么

`config/prompts/` 负责所有模型侧文本配置，目标是让 Prompt 策略可维护、可审阅、可单独调整，而不是散落在 `lib/llm/**` 的组装逻辑里。

当前文件分工：

- `config/prompts/generation.ts`
  - 生成链路的核心 Prompt 文本
  - 包含 `systemLines`、`humanLines`
  - 包含 Prompt 专用的场景标签、风格标签、语言标签、语言指令
- `config/prompts/index.ts`
  - `prompts` 子目录统一导出入口

### 什么时候改 `config/prompts`

出现以下情况时，优先检查这里：

- 想调整模型的输出约束
- 想修改语气边界、安全边界、推荐理由表达方式
- 想让某个场景或风格被模型理解得更准确
- 想调整多语言输出要求
- 想改 Prompt 文案，但不想碰 `lib/llm/**` 的拼装逻辑

### 在哪改

常见需求与落点：

- 改 system prompt：`config/prompts/generation.ts` 里的 `generationPromptCopy.systemLines`
- 改 human prompt 模板：`config/prompts/generation.ts` 里的 `generationPromptCopy.humanLines`
- 改场景 Prompt 标签：`config/prompts/generation.ts` 里的 `promptSceneLabels`
- 改风格 Prompt 标签：`config/prompts/generation.ts` 里的 `promptStyleLabels`
- 改多语言说明：`config/prompts/generation.ts` 里的 `promptLanguageInstructions`

## 4. 修改示例

### 示例 1：把输入页占位文案改得更具体

需求：把输入框提示从“在这里输入你想说的话...”改成更贴近职场场景。

修改位置：`config/copy/pages.ts`

```ts
export const inputPageCopy = {
  textAreaPlaceholder:
    "在这里输入你想表达的话...\n\n例如：这个事项暂时不在我的负责范围内，建议联系对应同事。",
} as const;
```

适用判断：

- 用户能直接看到
- 不影响模型理解逻辑
- 所以属于 `config/copy/`

### 示例 2：加强模型对 sarcasm 风格的边界约束

需求：让模型保留轻微反差感，但进一步避免攻击性表达。

修改位置：`config/prompts/generation.ts`

```ts
export const generationPromptCopy = {
  systemLines: [
    "你是“话到嘴边”的表达转换引擎，只服务场景化沟通改写。",
    "不要写成通用聊天，不要解释过程，不要输出 Markdown。",
    "必须只输出一个 JSON 对象，字段固定为 wechat、email、spoken、assumptions、safetyNotes。",
    "wechat/email/spoken 各包含 candidates 三条、recommendedIndex 0-2、reasons 1-3 条。",
    "表达要安全、可直接使用、降低冲突风险。sarcasm 只能轻微反差，不能攻击羞辱，也不能引导对抗升级。",
  ] as const,
} as const;
```

适用判断：

- 这是给模型看的规则
- 目的是改变生成策略
- 所以属于 `config/prompts/`

### 示例 3：同一概念同时改展示文案和 Prompt 标签

需求：产品想把页面上的“正式事务”改得更易懂，同时让模型更清楚这类场景包含行政和机构沟通。

修改方式：

- 页面/场景卡展示名：改 `config/copy/content.ts`
- 模型理解标签：改 `config/prompts/generation.ts`

这类需求不要只改一边，否则会出现“页面写法”和“模型理解”不一致。

## 5. 给 AI 的改 Prompt 提示词模板

当你想让 AI 帮你调整 Prompt，建议直接说明“只改配置，不改链路逻辑”，避免它顺手去改 `lib/llm/**`、接口协议或页面逻辑。

可直接复制下面模板：

```text
请在 d:\zuiti 里只修改 Prompt 配置，不要改业务逻辑。

目标：
1. 我想调整的话术/约束：
[在这里写你的目标，例如：让 sarcasm 更克制，避免攻击感]
2. 影响范围：
[在这里写场景，例如：只影响生成链路，不改页面展示文案]

修改要求：
- 只允许修改 config/prompts/**，必要时可补充 config/README.md 的说明
- 不要修改 lib/llm/** 的拼装逻辑
- 不要改 API 返回结构
- 保持现有 JSON 输出契约不变
- 改完说明：改了哪些文件、每处为什么改、可能带来的生成效果变化

如果你判断这次需求其实应该改 config/copy/** 而不是 config/prompts/**，请先指出原因再改。
```

如果你的目标是“改页面文案”而不是“改模型策略”，把上面的 `config/prompts/**` 替换成 `config/copy/**` 即可。

## 6. 维护注意事项

- 不要把用户文案写进 `lib/**`、`app/**`、`components/**` 里，优先收口到 `config/`
- 不要把 Prompt 文本和用户文案混在同一个文件里
- 改 Prompt 时，优先改措辞和约束，不要随手改输出字段契约
- 改 fallback 文案时，要注意它是 Demo 兜底，不代表真实模型输出
- 改场景名、风格名时，检查 `copy` 和 `prompts` 是否都需要同步
- 如果只是导出关系变化，优先检查 `config/index.ts`、`config/copy/index.ts`、`config/prompts/index.ts`

## 7. 推荐阅读路径

- 仓库根目录入口：`README.md`
- 配置维护总览：`config/README.md`
- 用户可见文案维护：`config/copy/*`
- 模型 Prompt 维护：`config/prompts/*`
