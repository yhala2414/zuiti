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
- `/profile`：本地统计、收藏摘要和偏好占位界面。

服务端接口：

- `POST /api/generate`
- `POST /api/feedback`
- `POST /api/track`

用户选择场景、对象、风格和语气后，可获得微信/IM、邮件/书面、当面/语音三类表达结果。模型不可用时返回确定性的本地 fallback，并通过 `meta.source` 保留真实来源。

## 当前阶段与协作入口

当前实施权限和阶段边界以 `AGENTS.md` 为准；已确认问题、演进顺序和后续阶段进入条件见 `docs/product-evolution.md`。仓库当前实现见 `docs/architecture.md`，不要从 README 推断实施授权。

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
- [协作工作流与纠偏指南](./docs/collaboration-guide.md)
- [产品 PRD](./docs/product-prd.md)
- [产品问题与演进](./docs/product-evolution.md)
- [系统架构](./docs/architecture.md)
- [验证指南](./docs/verification-guide.md)
- [本地 Web 验证指南](./docs/webapp-testing-guide.md)
- [文案与 Prompt 配置](./config/README.md)

团队文档只记录长期有效的产品、架构、协作和验证事实。每个工作区按需自行建立 ignored `.local-docs/`，用于临时需求、计划、审计、参考材料和未确认想法；它不会随 Git 分发，也不作为团队权威。本地 Web 自动化使用独立的 ignored `.venv/`，具体路由由上述协作与验证指南维护，不在 README 维护规则副本。
