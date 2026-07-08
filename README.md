# 话到嘴边 zuiti

<p align="center">
  <img alt="Project status" src="https://img.shields.io/badge/status-MVP%20closure%20foundation-6d5df6">
  <img alt="Mobile H5" src="https://img.shields.io/badge/mobile-H5-8b7cf6">
  <img alt="Next.js 16.2.7" src="https://img.shields.io/badge/Next.js-16.2.7-black?logo=nextdotjs">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white">
  <img alt="Local fallback" src="https://img.shields.io/badge/fallback-local%20deterministic-22c55e">
</p>

`话到嘴边` 是一个移动端 H5 场景表达转换工具，帮助用户把真实、直接、混乱、难开口的话，转成适合具体对象、具体场景的可发送表达版本。

它不是通用 AI 写作平台，也不是聊天机器人。它的核心目标是降低年轻人在学生、职场、社交和正式事务沟通中的表达成本与冲突风险。

## 产品体验

当前主链路：

```text
/ -> /input -> /tone -> /results
```

用户从首页进入，选择沟通场景、对象和表达风格，输入真实想法，再调节礼貌程度、正式程度和关系距离，最终获得微信/IM、邮件/书面、当面/语音三类可直接使用的表达版本。

辅助体验包括：

- 首页热门风格入口和最近使用记录。
- 结果页复制、反馈、分享、收藏、编辑和重新生成。
- 本地历史与收藏页。
- 本地 MVP 偏好、统计和个人页。

## 当前阶段：MVP 闭环奠基期

项目当前重点不是扩展成完整平台，而是把一个聚焦的表达转换闭环做稳：

- 使用 Zustand 承载当前转换流程状态。
- 使用本地浏览器存储沉淀最近历史、收藏、偏好和统计。
- 使用 Next.js BFF 提供生成、反馈和行为记录接口。
- 使用服务端 OpenAI-compatible 模型配置进行生成；未配置或失败时返回确定性的本地兜底结果。
- 在响应和状态中保留 `meta.source`，区分 `model` 与 `fallback`。

当前未进入阶段的能力不要擅自加入：

- 登录、账号、跨设备同步。
- 数据库或长期云端存储。
- 长期记忆、向量检索或 RAG。
- 独立后端服务。
- 复杂 LangChain Agent 或多工具自动化流程。
- 通用聊天或通用写作平台能力。
- 新 UI 框架、状态管理器、测试框架或 CI 服务。

## 核心功能

### 场景与对象

当前支持四类沟通场景：

- `student` - 学生沟通
- `work` - 职场沟通
- `social` - 社交沟通
- `formal` - 正式事务

对象在场景选择后继续细分，例如老师、同学、领导、同事、客户、朋友、合作方、陌生人或机构窗口等。

### 表达风格

当前支持六种场景化表达风格：

- `delay` - 先别急：体面延期，争取时间。
- `refuse` - 婉拒了哈：优雅拒绝，不撕破脸。
- `boundary` - 别甩给我：划清边界，避免背锅。
- `followup` - 该交了吧：礼貌推进，让对方行动。
- `decode` - 翻译一下：识别潜台词，看懂真实意思。
- `sarcasm` - 阴阳一下：保留一点态度，但不能攻击或升级冲突。

### 语气控制

用户可以通过三个 `0-100` 的滑杆调整结果倾向：

- `politeness` - 礼貌程度
- `formality` - 正式程度
- `distance` - 关系距离

### 输出版本

生成结果固定包含三类输出模式：

- `wechat` - 微信/IM 短句版
- `email` - 邮件/书面正式版
- `spoken` - 当面/语音沟通版

## 技术栈

前端：

- Next.js 16.2.7 App Router
- React 19
- TypeScript
- CSS Modules
- `antd-mobile`

状态与本地存储：

- Zustand
- local browser storage

BFF 与生成链路：

- `app/api/**/route.ts`
- zod 输入校验
- LangChain.js
- OpenAI-compatible server-side model access
- deterministic local fallback

工程验证：

- ESLint
- Node.js test runner
- TypeScript targeted checks
- Next.js build

## 本地运行

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

打开：

```text
http://localhost:3000
```

常用命令：

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## 环境变量

本地密钥放在 `.env.local`，不要提交到仓库。

```text
AI_API_KEY=
AI_BASE_URL=https://api.deepseek.com
AI_MODEL=deepseek-v4-pro
```

`AI_API_KEY` 为空时，BFF 会使用确定性的本地兜底结果，保证主流程可以在无模型配置的情况下运行。

## 页面与 API 路由

| Route | Purpose |
| --- | --- |
| `/` | 首页，产品入口、最近使用、热门风格和开始转换 |
| `/input` | 输入页，选择场景、对象、风格并输入真实想法 |
| `/tone` | 语气页，调整滑杆并展示生成或兜底预览 |
| `/results` | 结果页，展示三类输出和结果操作 |
| `/history` | 历史页，本地最近历史和收藏记录 |
| `/profile` | 我的页，本地 MVP 偏好、统计和个人信息 |
| `POST /api/generate` | 服务端生成 BFF |
| `POST /api/feedback` | 轻量反馈记录 |
| `POST /api/track` | 轻量行为记录 |

## 项目结构

```text
app/          Next.js App Router pages and BFF routes
components/   Reusable UI components
config/       User copy, fallback copy, API messages, prompt copy
docs/         Product, architecture, SDD, verification, and audit docs
lib/          Domain, validators, use cases, LLM, safety, analytics, context
stores/       Zustand expression flow store
tests/        Regression tests
utils/        Frontend API client and local history utilities
```

## 文档导航

产品与架构：

- [产品 PRD](./docs/product-prd.md)
- [后端/BFF 架构](./docs/backend-architecture.md)
- [前端架构](./docs/frontend-architecture.md)
- [移动端页面与路由](./docs/mobile-pages-routes.md)

配置与验证：

- [文案与 Prompt 配置说明](./config/README.md)
- [验证指南](./docs/verification-guide.md)
- [Spec 状态索引](./docs/specs/README.md)

AI / agent 协作：

- [AGENTS.md](./AGENTS.md)
- [SDD 规则](./docs/sddspec.md)

## 开发约定摘要

- 移动端 H5 优先，主要验收视口为 `375 x 750`。
- 页面入口保持在 `app/**/page.tsx`。
- 可复用 UI 放在 `components/**`，并优先使用现有组件。
- 用户可见文案、fallback 文案、API 提示和 Prompt 文本分别收口到 `config/**`。
- 浏览器到 BFF 的请求通过 `utils/api-client.ts` 和 `utils/expression-api.ts` 收口。
- 模型调用只允许服务端执行，不暴露密钥到前端。
- 保存、收藏、历史、反馈和 tracking 等用户可见成功状态必须有明确写入路径。
- 新增数据库、登录、独立后端、RAG、复杂 Agent、新 UI 系统或新测试框架前，需要先有明确批准的规格。

## 验证

文档-only 改动如果不删除链接、不改代码、不改脚本，按 [验证指南](./docs/verification-guide.md) 做静态阅读和引用检查即可。

涉及源码、样式、路由、API、配置导出、依赖或脚本时，优先使用现有命令：

```bash
npm run lint
npm run test
npm run build
```

UI 变更还应尽量在 `375 x 750` 视口检查受影响页面。
