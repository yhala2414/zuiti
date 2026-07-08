# API 请求与配置点梳理

本文档梳理当前 H5 流程中的网络请求、触发方式、跳转链路，以及相关配置位置。当前结论：

- 前端浏览器到 BFF 的 HTTP 请求统一通过 `utils/api-client.ts` 中的 axios client。
- 页面不直接调用 `fetch` 或 `axios`，只通过 `utils/expression-api.ts` 导出的 `generateExpression`、`sendFeedback`、`trackEvent` 调用 BFF。
- Next.js Route Handler 继续使用 Web 标准 `Request` / `Response`，不使用 axios。
- LangChain/OpenAI-compatible 模型调用继续由 `@langchain/openai` 封装，不属于前端 axios 重构范围。
- 生成请求主要由 `/tone` 和 `/results` 的页面生命周期自动触发，也可以由结果页按钮手动触发。
- 复制、反馈、分享、换风格等结果页行为会触发埋点或反馈请求。

## 1. 页面请求总览

### `/` 首页

文件：`app/page.tsx`

职责：

- 展示产品定位、场景入口、最近使用、热门风格和主 CTA。
- 只写入前端流程状态，不发后端 API。

状态写入：

- 点击场景卡片：写入 `scene`，跳转 `/input?scene=<scene>`。
- 点击热门风格：写入默认 `scene` 和目标 `style`，跳转 `/input?scene=work`。
- 点击主 CTA：写入默认场景，跳转 `/input?scene=work`。

后端请求：无。

### `/input` 输入页

文件：`app/input/page.tsx`

职责：

- 读取 URL 中的 `scene`。
- 收集用户原话。
- 选择表达风格。
- 输入满足最小长度后进入 `/tone`。

监听与状态写入：

- `useSearchParams()` 读取 `scene` 查询参数。
- `TextArea.onChange` 写入 store 的 `text`。
- `StyleCard.onClick` 写入 store 的 `style`。
- 顶部“示例”按钮写入示例原话。
- 顶部“清空”按钮清空原话。

后端请求：无。

### `/tone` 语气页

文件：`app/tone/page.tsx`

职责：

- 展示生成前预览。
- 调整三项语气滑杆。
- 草稿可用时自动请求生成。
- 进入 `/results` 展示结果。

自动生成触发：

- 首次进入且 `buildDraft()` 可构建合法草稿。
- 输入、目标、风格或滑杆变化后，当前 `requestKey` 未被已有 loading/success/fail/refused 状态覆盖。
- 页面使用 `window.setTimeout(..., 500)` 做防抖，卸载或更新时清理 timer。

后端请求：

- `generateExpression(draft)` -> `POST /api/generate`

响应处理：

- `response.ok === true`：调用 `setGenerationSuccess(response.data, requestKey)`。
- `response.ok === false && code === "SAFETY_REFUSED"`：状态设为 `refused`。
- 其他失败：状态设为 `fail`。

### `/results` 结果页

文件：`app/results/page.tsx`

职责：

- 展示原话、生成状态和三种结果卡。
- 如果结果未生成，自动补发生成请求。
- 支持复制、反馈、重试、分享、收藏、换风格、调语气。

自动生成触发：

- `buildDraft()` 存在。
- 当前 store 中没有匹配当前 `requestKey` 的 success/loading/fail/refused 状态。

手动生成触发：

- 点击“重试一次”：`generateExpression(buildDraft("regenerate"))` -> `POST /api/generate`。
- 点击结果卡“再润色”：沿用当前重试/再生成链路。
- 编辑原话后点击优化：`generateExpression(buildDraft("edit"))` -> `POST /api/generate`。

行为请求：

- 复制结果成功后：`trackEvent(...)` -> `POST /api/track`。
- 分享成功后：`trackEvent(...)` -> `POST /api/track`。
- 点击“有用”：`sendFeedback(...)` -> `POST /api/feedback`。
- 点击“换风格”：`trackEvent(...)` -> `POST /api/track`，然后触发新风格生成。

## 2. 前端 API Client

### axios client

文件：`utils/api-client.ts`

职责：

- 创建统一 axios 实例。
- 通过请求拦截器补齐 JSON 请求头。
- 预留请求 metadata，例如 `startedAt`。
- 通过响应拦截器返回 BFF JSON body。
- 通过错误拦截器归一化 HTTP、网络、空响应或非预期响应。

当前配置：

```ts
axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});
```

统一请求函数：

```ts
postJson<T>(url: string, payload: unknown): Promise<T>
```

错误归一化规则：

- HTTP 非 2xx 且服务端返回 `{ ok: false, code, message }`：保留服务端错误结构。
- 网络错误、空响应、非对象响应或无法识别的错误：返回

```ts
{
  ok: false,
  code: "NETWORK_ERROR",
  message: apiErrorCopy.networkError,
}
```

### 产品 API wrapper

文件：`utils/expression-api.ts`

导出：

- `generateExpression(draft)` -> `POST /api/generate`
- `sendFeedback(payload)` -> `POST /api/feedback`
- `trackEvent(payload)` -> `POST /api/track`

页面只依赖这些产品函数，不直接接触 axios 实例。

## 3. 后端 API Route

### `POST /api/generate`

文件：`app/api/generate/route.ts`

流程：

1. `await request.json()`
2. `GenerateRequestSchema.safeParse(body)`
3. 校验失败：`jsonError("INVALID_INPUT", apiErrorCopy.invalidInput, 400)`
4. 校验成功：调用 `lib/use-cases/generate-expression.ts`
5. 成功返回：`Response.json(result, { status: 200 })`
6. 未捕获异常：`jsonError("INTERNAL_ERROR", apiErrorCopy.internalError, 500)`

运行时：`export const runtime = "nodejs"`

### `POST /api/feedback`

文件：`app/api/feedback/route.ts`

流程：

1. `await request.json()`
2. `FeedbackRequestSchema.safeParse(body)`
3. 校验失败：`INVALID_INPUT`
4. 校验成功：调用 `submitFeedback(parsed.data)`
5. 返回 `{ ok: true }`

当前行为：只写轻量日志，不做数据库持久化。

### `POST /api/track`

文件：`app/api/track/route.ts`

流程：

1. `await request.json()`
2. `TrackRequestSchema.safeParse(body)`
3. 校验失败：`INVALID_INPUT`
4. 校验成功：调用 `trackEvent(parsed.data)`
5. 返回 `{ ok: true }`

当前行为：只写轻量日志，不做数据库持久化。

## 4. 当前请求清单

| 触发位置 | 用户动作/生命周期 | 前端函数 | API | 后端入口 |
| --- | --- | --- | --- | --- |
| `/tone` | 首次进入且草稿可用 | `generateExpression(draft)` | `POST /api/generate` | `app/api/generate/route.ts` |
| `/tone` | 输入、目标、风格或滑杆变化后防抖 | `generateExpression(draft)` | `POST /api/generate` | `app/api/generate/route.ts` |
| `/results` | 进入结果页但当前草稿没有匹配结果 | `generateExpression(draft)` | `POST /api/generate` | `app/api/generate/route.ts` |
| `/results` | 点击“重试一次” | `generateExpression(buildDraft("regenerate"))` | `POST /api/generate` | `app/api/generate/route.ts` |
| `/results` | 编辑原话后点击优化 | `generateExpression(buildDraft("edit"))` | `POST /api/generate` | `app/api/generate/route.ts` |
| `/results` | 分享成功 | `trackEvent(...)` | `POST /api/track` | `app/api/track/route.ts` |
| `/results` | 点击结果卡“复制” | `trackEvent(...)` | `POST /api/track` | `app/api/track/route.ts` |
| `/results` | 点击结果卡“有用” | `sendFeedback(...)` | `POST /api/feedback` | `app/api/feedback/route.ts` |
| `/results` | 点击结果卡“换风格” | `trackEvent(...)` | `POST /api/track` | `app/api/track/route.ts` |

## 5. 当前不发请求但会改变流程的位置

- 首页场景卡：写入本地 store 并跳转。
- 首页热门风格：写入本地 store 并跳转。
- 输入页“示例”：只写入本地输入内容。
- 输入页“清空”：只清空本地输入内容。
- 输入页“开始转换”：只跳转 `/tone`，生成请求由 `/tone` 触发。
- 语气页“重置”：只改本地滑杆，随后可能因状态变化触发防抖生成。
- 语气页“生成结果”：只跳转 `/results`；若 `/tone` 已生成成功，结果页不会重复发同一请求。
- 结果页“收藏”：使用本地 recent history/favorites 工具，不发 BFF 请求。
- 结果页“再调语气”：跳转 `/tone`。
- 结果页“查看变化点”：当前只是展示按钮，不发请求。

## 6. 配置与文案位置

- 页面文案：`config/copy/pages.ts`
- 组件文案：`config/copy/components.ts`
- 场景、风格、结果卡元信息：`config/copy/content.ts`
- API 错误文案：`config/copy/api.ts`
- fallback 生成文案：`config/copy/fallback.ts`
- Prompt 配置：`config/prompts/**`
- 产品枚举与类型：`lib/domain/enums.ts`
- 默认值与限制：`lib/domain/defaults.ts`

## 7. 维护注意事项

- 不要在页面里新增散落的 `fetch` 或 `axios` 调用；浏览器 BFF 请求统一经过 `utils/expression-api.ts` 和 `utils/api-client.ts`。
- 不要在 Route Handler 中为了调用本项目 BFF 再引入 axios；服务端入口继续用 `Request` / `Response`。
- 不要把模型调用改成前端请求；模型密钥只能在服务端读取。
- 修改生成请求字段时，需要同步检查 `GenerateDraft`、后端 zod schema、prompt 上下文、fallback 和本文档。
- 修改风格、场景或输出模式时，需要同步检查 UI copy、prompt label、few-shot、枚举、schema 和结果页映射。
- 当前 feedback/track 只落日志，不做数据库持久化。
