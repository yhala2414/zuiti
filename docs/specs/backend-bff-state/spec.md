# Backend BFF + Frontend State Spec

## Problem

当前项目虽然已经补上第一版 BFF 与 Zustand 状态流，但还有三个直接影响 demo 可用性的问题没有被规格完整覆盖：

- 页面文案、接口提示语、fallback 文案、Prompt 文本仍分散在 `tsx`、`ts` 和 `lib/llm/prompts.ts` 中，后续要改产品表达、错误提示或 Prompt 时需要到处找字符串。
- `npm run dev` 后用户仍可能看到与输入语言不一致的结果，而且当前链路会在模型未配置或模型失败时静默回退到本地 fallback，前端无法直观看出到底是 LLM 生效了，还是只拿到了演示兜底结果。
- 当前结果页虽然已经发起 `/api/generate`，但规格没有明确要求“结果必须来自 Zustand + API 返回态”，也没有把“禁止静态结果文案冒充动态生成结果”写成强约束。

## Goal

在现有 `backend-bff-state` 基础上，完成一版更适合黑客松 demo 的闭环增强：

- 明确采用根目录 `config/` 作为唯一文本配置入口，集中管理前端展示文案、后端错误/提示文案和 Prompt 文本。
- 让 `/input -> /tone -> /results -> /api/generate` 的请求链路可验证、可诊断，前端能够区分 `model` 与 `fallback` 两种生成来源。
- 保证生成结果优先跟随用户输入语言；即使走 fallback，也不能始终只返回固定中文模板。
- 明确结果页必须消费 Zustand 中的真实草稿和 API 返回结果，不允许继续依赖静态示例文本充当真实生成结果。

## Non Goals

- 不做登录、账号、跨端同步、长期记忆。
- 不引入独立后端、Python 服务、数据库、向量检索或复杂 Agent。
- 不把产品做成通用聊天或通用写作平台。
- 不重构现有 UI 视觉体系。
- 不实现完整历史记录、收藏云同步或复杂报表。
- 不引入完整国际化平台、CMS 或远程配置中心。
- 不为了抽离文案而做大规模目录重构，只做最小必要迁移。

## Required Directory Contract

本次范围内，根目录统一新增并使用 `config/`，作为项目唯一的文本配置入口。规格明确要求按职责拆分为：

- `config/copy/`：前端页面文案、组件文案、结果状态文案、接口错误提示文案、fallback 展示文案。
- `config/prompts/`：LLM system prompt、human prompt 模板、Prompt 片段和注释说明。
- `config/index.ts` 或同等聚合导出：为页面、组件、服务端模块提供稳定 import 入口。

要求：

- `app/**`、`components/**`、`utils/**`、`lib/**` 中不再直接内联可配置产品文案，结构性 token、字段名、CSS class、URL 和枚举值除外。
- 所有配置文件按模块分组并带简洁注释，注释说明“用途/修改影响范围”，便于后续快速替换。
- Prompt 文本不得继续散落在 `lib/llm/**` 业务代码中，`lib/llm/**` 只负责调用和拼装，不负责维护具体文案。

## User Stories

- 作为移动端用户，我选择沟通场景、输入原话、选择风格并调整语气后，希望看到三种可直接使用的表达结果。
- 作为用户，我希望生成失败、参数错误或安全拒答时能看到稳定提示，而不是页面空白或崩溃。
- 作为后续开发者，我希望场景、风格、输出模式、错误码和 API 契约集中定义，避免前后端字段散落。
- 作为后续运营或产品修改者，我希望所有按钮文案、状态提示、示例语、fallback 提示和 Prompt 都能在 `config/` 下按模块找到，而不是分散在多个 `tsx`/`ts` 文件中。
- 作为 demo 使用者，我希望系统默认按我的输入语言给出结果；如果模型没有真正生效，我也能从页面状态或返回元信息里知道当前看到的是 fallback。

## Acceptance Criteria

- [ ] 首页选择的 scene 能进入输入页并写入全局状态。
- [ ] 输入页 raw text 与 style 能进入语气页并保留。
- [ ] 语气页 sliders 能进入结果页并触发生成。
- [ ] `POST /api/generate` 接收并校验固定产品契约，返回结构化成功、拒答或错误响应。
- [ ] `POST /api/generate` 成功响应需包含可供前端诊断的生成元信息，至少区分 `model` 或 `fallback` 来源，并带回本次使用的主语言标识。
- [ ] 当模型配置缺失、模型超时、模型坏输出或供应商调用失败时，服务端仍返回稳定 fallback，但不能静默冒充真实模型结果。
- [ ] 服务端生成链路会根据用户输入推断主语言，并要求模型输出与该语言一致；本地 fallback 也必须遵守同一语言策略。
- [ ] 结果页能渲染 API 返回的 `wechat/email/spoken` 三类结果，文本来源必须是 Zustand 中的当前草稿和接口响应，而不是 `components/content.ts` 中的静态示例正文。
- [ ] 前端在 `loading / success / fallback / fail / refused / missing-draft` 六类状态下都有明确展示，不出现“接口失败但仍像成功生成”的假象。
- [ ] `POST /api/feedback` 和 `POST /api/track` 能完成轻量日志记录。
- [ ] 服务端模型调用只读取 server env，不向前端暴露密钥。
- [ ] 缺少模型配置或模型调用失败时有稳定 fallback/error path。
- [ ] `app/**`、`components/**`、`utils/**`、`lib/**` 中所有用户可见文字、错误提示、fallback 提示和 Prompt 文本被迁移到根目录 `config/` 下，并按页面/组件/服务端/Prompt 模块拆分。
- [ ] `config/` 中每个文案模块都附带用途注释，能让后续开发者在单点入口完成修改。
- [ ] `npm run dev` 下至少完成一次真实链路检查：能判断前后端是否打通、当前返回是 `model` 还是 `fallback`、结果语言是否跟随输入语言。
- [ ] `npm run lint` 和 `npm run build` 通过。

## Edge Cases

- 输入为空、过短、过长或只有空白。
- scene/style/sliders/outputModes/operation 非法。
- 用户直接访问 `/tone` 或 `/results`，缺少前置状态。
- LLM 超时、返回非 JSON、返回候选数量不正确。
- `sarcasm` 风格命中攻击、威胁、羞辱等安全规则。
- 移动端 `375 x 750` 下 loading/error/refused/success 状态不重叠。
- 输入为英文、日文、中英混输或夹杂专有名词时，主语言判定要稳定，至少不能全部退化为固定中文回答。
- 模型未配置但前端仍显示“已为你生成 3 种表达版本”时，要能从状态或文案上明确识别当前是 fallback。
- `components/content.ts` 中保留的演示示例只能用于首页或静态导览，不能再被结果页当成真实生成正文。
