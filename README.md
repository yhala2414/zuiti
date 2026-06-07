# 嘴替（Zuiti）Web H5 Demo

> 版本：v0.1（Demo 方案）  
> 技术栈：Next.js（App Router）+ TypeScript（单仓库）  
> 目标：黑客松快速出可演示结果，同时保持工程规范、协作友好

## 1. 项目定位

“嘴替”是一个面向日常沟通的 Web H5 Demo：用户输入一句原话/想法，选择模式（1-5），一次生成多条不同风格的表达，并给出推荐与理由，帮助用户更清晰、更礼貌、更可沟通地表达。

本仓库为**单仓库、单 Next.js 项目**：
- **前端（浏览器 UI）**：页面与组件渲染
- **后端/BFF（Next 服务端能力）**：同一项目中的 API 路由（用于参数校验、组装请求、调用模型、做轻量安全过滤与埋点）

## 2. Demo 范围（简化版）

### 2.1 必须实现（Must）
- 输入一句原话/想法，选择模式 1-5 之一
- 一次生成：3 条候选 + 1 条推荐（推荐必须来自候选）+ 2-3 条推荐理由
- 结果可复制；最小反馈闭环（有用/无用 + 原因标签）

### 2.2 不在范围（Out of Scope）
- 登录注册、账号体系、跨端同步
- 多轮对话、长期记忆、风格训练
- 复杂场景库/对象关系选择器
- 复杂数据库与报表（Demo 允许先用日志或轻量存储）

## 3. 快速开始（3 分钟跑起来）

### 3.1 环境要求
- Node.js：LTS 版本（建议 18/20）

### 3.2 安装与启动

在项目根目录执行：

```bash
npm install
npm run dev
```

浏览器打开：
- http://localhost:3000

常用命令：

```bash
npm run dev      # 本地开发
npm run build    # 生产构建
npm run start    # 以生产模式启动（需先 build）
npm run lint     # 代码规范检查
```

### 3.3 环境变量（建议）

本地使用 `.env.local`（不提交到仓库），仓库建议提供 `.env.example`（提交）用于说明需要哪些配置。

常见字段示例（按你们使用的模型服务调整）：
- `AI_API_KEY`：模型服务密钥
- `AI_BASE_URL`：可选，自建网关/代理地址
- `AI_MODEL`：可选，模型名称

## 3.4 文档导航（当前仓库入口）

如果你是第一次接手这个仓库，建议先按下面顺序阅读：

1. [根 README](./README.md)：快速了解项目定位、启动方式和仓库入口
2. [产品说明](./docs/product-prd.md)：先理解这个 Demo 到底解决什么问题、面向谁
3. [页面路由说明](./docs/mobile-pages-routes.md)：确认 `/`、`/input`、`/tone`、`/results` 的页面职责
4. [后端架构定稿](./docs/backend-architecture.md)：确认 Next.js BFF、`app/api/**`、`lib/**` 的边界
5. [配置维护说明](./config/README.md)：修改文案、fallback、Prompt 前先看这里
6. [SDD 宪章](./docs/sddspec.md)：做非小改动前先看规格流程
7. [Specs 入口](./docs/specs/README.md)：查看当前激活规格和后续实施入口

如果你要按职责找文档，可以直接走下面入口：

- 产品和目标用户：[`docs/product-prd.md`](./docs/product-prd.md)
- 页面和路由：[`docs/mobile-pages-routes.md`](./docs/mobile-pages-routes.md)
- 后端/BFF 架构：[`docs/backend-architecture.md`](./docs/backend-architecture.md)
- 配置和 Prompt 维护：[`config/README.md`](./config/README.md)
- 当前后端状态规格：[`docs/specs/backend-bff-state/spec.md`](./docs/specs/backend-bff-state/spec.md)
- 当前后端状态设计：[`docs/specs/backend-bff-state/design.md`](./docs/specs/backend-bff-state/design.md)
- 当前后端状态任务：[`docs/specs/backend-bff-state/tasks.md`](./docs/specs/backend-bff-state/tasks.md)
- 当前后端状态检查清单：[`docs/specs/backend-bff-state/checklist.md`](./docs/specs/backend-bff-state/checklist.md)

开发者高频维护场景建议这样进入：

- 想改首页、按钮、提示语、错误文案、fallback 文案：
  先看 [`config/README.md`](./config/README.md)，再进入 `config/copy/*`
- 想改模型 Prompt、场景标签、风格标签、多语言输出要求：
  先看 [`config/README.md`](./config/README.md)，再进入 `config/prompts/*`
- 想确认“这段文字到底该改 `copy` 还是 `prompts`”：
  直接看 [`config/README.md`](./config/README.md) 的判断规则
- 想继续实现当前 AI 生成闭环：
  先看 [`docs/specs/backend-bff-state/tasks.md`](./docs/specs/backend-bff-state/tasks.md)

## 4. 交互与数据流（端到端）

1) 用户输入文本 + 选择模式 → 点击生成  
2) 前端请求服务端 API（同仓库内）  
3) 服务端执行：输入校验 →（可选）内容安全初筛 → 组装模型请求 → 调用模型 → 结果结构化与校验 → 返回前端  
4) 前端渲染：推荐卡 + 候选卡 + 复制 + 反馈  
5) 复制/反馈触发埋点或反馈接口（可先落日志）

为了 Demo 不翻车，页面建议有清晰的状态机：
- `idle`：未生成
- `loading`：生成中
- `success`：成功展示结果
- `fail`：生成失败（可重试）
- `refused`：命中安全规则的拒答（提示原因与替代建议）

### 4.1 API 约定（概念级）

为保持“单仓库、一条链路可演示”，建议把服务端能力收敛到少量接口：
- `POST /api/generate`：生成候选与推荐（服务端完成输入校验、调用模型、结果校验）
- `POST /api/track`（可选）：埋点事件上报（也可先只落日志）
- `POST /api/feedback`（可选）：用户反馈闭环（有用/无用 + 原因标签）

返回结构建议统一为“成功/失败”两类，便于前端状态机稳定处理（不追求复杂错误体系，够用即可）。

## 5. 目录结构与放置规范（按当前仓库）

当前仓库已经形成前端页面、BFF、配置层、状态层和规格文档的基本分层，核心目录如下：

```
zuiti/
  app/
    api/               # BFF API：generate / feedback / track
    input/             # 输入页
    tone/              # 语气仪表盘页
    results/           # 结果页
    layout.tsx         # 全局布局（App Router）
    page.tsx           # 首页
    globals.css        # 全局样式与设计 token
  components/          # 复用 UI 组件
  config/              # 文案配置与 Prompt 配置统一入口
  docs/                # 产品、架构、页面、SDD、Specs 文档
  lib/                 # 后端/BFF 业务能力、校验、LLM、安全、上下文
  stores/              # Zustand 状态管理
  utils/               # 前端 API client 与映射工具
  public/              # 静态资源
  next.config.ts
  tsconfig.json
  eslint.config.mjs
  README.md
```

开发者可按职责进入：

- 页面流程维护：[`app/`](./app)
- 复用 UI 组件维护：[`components/`](./components)
- 文案与 Prompt 配置维护：[`config/README.md`](./config/README.md)
- BFF 与生成链路维护：[`lib/`](./lib)
- 流程状态维护：[`stores/`](./stores)
- 当前规格与任务维护：[`docs/specs/`](./docs/specs)

放置原则（记住这 3 条就够用）：
- 页面：放在 `app/**/page.tsx`（负责拼装页面模块与管理页面状态）
- 组件：放在 `components/**`（只做展示与交互，不做模型请求与复杂逻辑）
- 业务能力/工具：放在 `lib/**`（可被页面和 API 复用，避免散落在各处）

### 5.1 当前主要模块说明

- `app/api/**/route.ts`
  - Next.js BFF 接口入口
  - 当前已包含 `generate`、`feedback`、`track`
- `lib/domain/**`
  - 枚举、默认值、错误码、响应契约等领域定义
- `lib/validators/**`
  - 请求体验证
- `lib/context/**`
  - 生成上下文与语言推断
- `lib/llm/**`
  - 模型调用、Prompt 装配、结果 normalize、输出结构约束
- `lib/safety/**`
  - 安全策略与后检查
- `config/copy/**`
  - 给用户看的文案配置
- `config/prompts/**`
  - 给模型看的 Prompt 配置
- `stores/expression-flow-store.ts`
  - `/input -> /tone -> /results` 的 Zustand 状态流

## 6. 工程化规范（保持“够用且不重”）

### 6.1 TypeScript（默认强约束）
- 尽量让“外部输入”都有明确校验：用户输入、URL 参数、API 请求体、模型返回值
- UI 层只处理展示，不在组件里拼接复杂规则或“半业务逻辑”

### 6.2 ESLint（统一代码风格）
- 执行 `npm run lint` 保持最基本的一致性
- 合并前尽量确保 lint 通过，减少“看起来像 bug 但其实是风格差异”的沟通成本

### 6.3 环境变量与安全
- `.env.local` 不提交；仓库只提交 `.env.example`
- 不在前端暴露密钥；模型调用放在服务端 API 中完成

## 7. Next.js（App Router）简明介绍（够用版）

### 7.1 页面与路由
- `app/page.tsx` 对应路由 `/`
- `app/<route>/page.tsx` 对应路由 `/<route>`
- `app/layout.tsx` 是全局布局，会包裹所有页面

### 7.2 “后端/BFF”在哪里？
Next.js 支持在同一个项目内提供服务端 API（常用于 Demo 或 BFF）：
- 这些 API 在服务端执行，可读取环境变量、调用外部服务、做输入/输出校验
- 前端通过 `fetch` 调用它们，保持“一个仓库、一个启动命令”

### 7.3 为什么适合黑客松 Demo
- 前后端同仓同语言（TypeScript），协作成本低
- 路由与部署链路成熟，演示与上线更顺滑

## 8. 常见问题（Troubleshooting）

- 访问不了 `http://localhost:3000`：检查终端是否启动成功、端口是否被占用
- 构建失败：先执行 `npm run lint`，再检查 Node 版本是否为 LTS
- “需要密钥/接口报错”：确认 `.env.local` 配置齐全，并且密钥没有放到前端代码里
- 想改文案但不知道从哪里下手：先看 [`config/README.md`](./config/README.md)
- 想改 Prompt 但不想误改后端逻辑：先看 [`config/README.md`](./config/README.md) 的 Prompt 维护说明
- 想继续推进当前生成闭环：先看 [`docs/specs/backend-bff-state/tasks.md`](./docs/specs/backend-bff-state/tasks.md)

## 9. 参考

- Next.js 文档：https://nextjs.org/docs
- Vercel 部署：https://vercel.com/new
- 配置维护文档：[`config/README.md`](./config/README.md)
- 产品说明：[`docs/product-prd.md`](./docs/product-prd.md)
- 页面路由：[`docs/mobile-pages-routes.md`](./docs/mobile-pages-routes.md)
- 后端架构：[`docs/backend-architecture.md`](./docs/backend-architecture.md)
- SDD 宪章：[`docs/sddspec.md`](./docs/sddspec.md)
- Specs 入口：[`docs/specs/README.md`](./docs/specs/README.md)
- 当前实现规格：[`docs/specs/backend-bff-state/spec.md`](./docs/specs/backend-bff-state/spec.md)
