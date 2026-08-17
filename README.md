# 话到嘴边

`话到嘴边` 是一个移动端 H5 场景表达转换工具，帮助用户把真实、直接、混乱或难开口的话，转成适合具体对象和场景的可发送表达。

它不是通用 AI 写作平台，也不是聊天机器人。当前目标是把一个聚焦的表达转换闭环做稳。

## 当前体验

主链路：

```text
/ -> /input -> /tone -> /results
```

辅助页面：

- `/history`：本地最近历史和收藏。
- `/profile`：本地偏好、统计和 MVP 个人页。

服务端接口：

- `POST /api/generate`
- `POST /api/feedback`
- `POST /api/track`

用户选择场景、对象、风格和语气后，可获得微信/IM、邮件/书面、当面/语音三类表达结果。模型不可用时返回确定性的本地 fallback，并通过 `meta.source` 保留真实来源。

## 当前阶段边界

当前是单体 Next.js MVP：

- Zustand 保存当前转换流程状态。
- 浏览器本地存储保存历史、收藏、偏好和统计。
- Next.js BFF 承载生成、反馈和行为记录。
- 模型调用仅在服务端进行。

未经明确批准，不增加登录、数据库、跨设备同步、独立后端、长期记忆、RAG、复杂 Agent、新 UI 系统、新状态管理器、新测试框架或 CI 服务。

## 技术栈

- Next.js 16.2.7 App Router
- React 19
- TypeScript
- CSS Modules
- `antd-mobile`
- Zustand
- zod
- axios
- LangChain.js / OpenAI-compatible server-side model access

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。主要移动端验收视口为 `375 x 750`。

环境变量放在未提交的 `.env.local`：

```text
AI_API_KEY=
AI_BASE_URL=https://api.deepseek.com
AI_MODEL=deepseek-v4-pro
```

未配置 `AI_API_KEY` 时使用本地 deterministic fallback。

## 常用命令

```bash
npm run dev
npm test
npm run test:flow
npm run test:interaction
npm run test:history
npm run test:contract
npm run test:tone
npm run lint
npm run build
```

## 项目结构

```text
app/          页面和 BFF 路由
components/   可复用 UI
config/       用户文案、fallback、API 文案和 prompt
docs/         当前产品、架构和验证文档
lib/          领域、校验、用例、模型、安全和分析
stores/       Zustand 流程状态
tests/        按行为命名的回归测试
utils/        浏览器 API client 和本地存储工具
```

## 文档导航

- [AI 与协作者入口](./AGENTS.md)
- [产品 PRD](./docs/product-prd.md)
- [系统架构](./docs/architecture.md)
- [验证指南](./docs/verification-guide.md)
- [文案与 Prompt 配置](./config/README.md)

团队文档只记录长期有效的产品、架构和验证事实。临时需求、计划、审计、测试报告、截图和未确认想法放在 ignored `.local-docs/`，不作为团队权威。

## 开发约定摘要

- 主要验收视口为 `375 x 750`。
- 页面入口保持在 `app/**/page.tsx`。
- 浏览器到 BFF 的请求统一经过 `utils/api-client.ts` 和 `utils/expression-api.ts`。
- 用户可见文案与模型 prompt 分别收口到 `config/copy/**` 和 `config/prompts/**`。
- 模型调用只允许服务端执行。
- 保存、收藏、反馈、追踪等成功状态必须有 state、storage、API 或 log 写入路径。
- 普通功能不要求创建 spec/design/tasks/checklist 文档套件。
