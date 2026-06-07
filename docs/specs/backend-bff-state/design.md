# Backend BFF + Frontend State Design

## Architecture

使用单仓库 Next.js App Router BFF。API 放在 `app/api/**/route.ts`，非 UI 逻辑放在 `lib/**`，前端跨页状态放在 `stores/**`，浏览器调用封装放在 `utils/**`。

新增依赖默认选择：

- `zod`：请求、响应、模型输出校验。
- `zustand`：移动端流程状态管理。
- `@langchain/core`、`@langchain/openai`：Prompt 模板与 OpenAI-compatible ChatModel 接入。

## Data Flow

1. 首页点击 scene：写入 Zustand，并跳转 `/input?scene=<scene>`。
2. 输入页：保存 raw text 与 style，点击 CTA 前做最小前端校验。
3. 语气页：保存 sliders，点击生成后跳转 `/results`。
4. 结果页：从 Zustand 读取 request draft，调用 `/api/generate`。
5. BFF：校验请求 -> 安全前置检查 -> 构建上下文 -> 调用 LLM pipeline -> 校验/normalize -> 返回统一 JSON。
6. 结果页：根据 `idle/loading/success/fail/refused` 渲染。
7. 复制、反馈、重试等动作调用 `/api/track` 或 `/api/feedback`。

## Data Model

固定领域枚举：

- `Scene`: `student | work | social | formal`
- `ExpressionStyle`: `delay | refuse | boundary | followup | decode | sarcasm`
- `OutputMode`: `wechat | email | spoken`
- `Operation`: `generate | regenerate | edit`
- `ToneSliders`: `{ politeness: number; formality: number; distance: number }`

生成结果：

- 每个 output mode 包含 `candidates: [string, string, string]`
- `recommendedIndex: 0 | 1 | 2`
- `reasons: string[]`
- 顶层可包含 `assumptions` 与 `safetyNotes`

## API Design

### `POST /api/generate`

- Runtime: Node.js，显式 `export const runtime = "nodejs"`。
- Request: 使用 `GenerateRequestSchema` 校验。
- Success: `{ ok: true, data }`
- Refused: `{ ok: false, code: "SAFETY_REFUSED", message, data: { refused } }`
- Error: `{ ok: false, code, message }`

错误码：

- `INVALID_INPUT`
- `SAFETY_REFUSED`
- `MODEL_TIMEOUT`
- `MODEL_BAD_OUTPUT`
- `INTERNAL_ERROR`

### `POST /api/feedback`

记录 `sessionId/resultId/useful/reasonTags`，第一版只 `console.info` 脱敏日志并返回 `{ ok: true }`。

### `POST /api/track`

记录 `sessionId/event/payload`，第一版只 `console.info` 脱敏日志并返回 `{ ok: true }`。

## UI / UX Design

保留当前移动端视觉，不做大重构。

新增状态：

- 输入页：空输入时禁用或提示，不允许无内容进入生成链路。
- 结果页：显示生成中、生成失败、拒答、成功四种状态。
- 缺少前置状态时：结果页展示友好提示并提供返回输入页 CTA。
- 成功后：按现有 `ResultCard` 风格渲染三类结果，推荐候选优先展示。

## Security Considerations

- API key 只在服务端读取，不使用 `NEXT_PUBLIC_`。
- Route Handler 不向客户端返回原始异常或供应商错误详情。
- 日志不明文记录完整用户原话，只记录截断或摘要字段。
- 安全前置规则拦截威胁、报复、违法、隐私侵犯、人身攻击。
- `sarcasm` 风格额外收紧，不生成攻击或羞辱话术。

## Performance Considerations

- 第一版不做 streaming，优先稳定结构化响应。
- LLM 调用设置超时；失败时返回稳定错误。
- Zustand 只保存当前会话必要数据，不做长期存储。
- 结果页避免重复生成：已有成功结果时不自动重复请求，除非用户重试或参数变化。

## Risks

- LLM 输出结构不稳定：用 zod 校验与 normalize 兜底。
- 依赖安装需要网络：实现阶段如 sandbox 网络失败，按权限流程申请。
- 前后端字段漂移：领域枚举集中在 `lib/domain/**`，前端从统一映射消费。
- 结果质量受模型影响：第一版以契约稳定优先。

## Alternatives Considered

- 仅做后端：会留下静态前端，无法验证真实闭环。
- 仅做前端 Zustand：无法验证后端架构定稿。
- 独立后端服务：超出 MVP 和文档定稿。
- 复杂 Agent：超出 `docs/backend-architecture.md` 明确边界。
