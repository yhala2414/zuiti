# 嘴替（Zuiti）Demo —— 后端架构（LangChain.js + OpenAI 兼容接口）
> 适用前提：单仓库、单 Next.js 项目；后端在 `app/api/**/route.ts` 内实现（Node runtime）。  
> 目标：用 **LangChain 但不引入复杂工程量**，同时为后续“工具调用 / 记忆 / 用户画像 / 换模型”留好扩展点。

---

## 1. 结论（你当前阶段的推荐用法）

你可以“上 LangChain”，但把它限定在 4 个能力：
1) **Prompt 模板化**（避免字符串拼接地狱）  
2) **结构化输出**（强约束 3 候选 + 推荐 + 理由 + 三种输出形态）  
3) **可插拔上下文**（会话记忆 / 用户画像 作为“Context Provider”注入）  
4) **工具注册接口**（先做空实现/少量工具，后续再加也不改主流程）

不建议黑客松阶段上：向量库、复杂 agent loop、多人协作工具链、长链路多次工具反复推理。

---

## 2. 技术选型（Node/Next + LangChain.js）

### 2.1 为什么是 LangChain.js（而不是 Python LangChain）
因为你后端在 Next.js（Node.js runtime）里，最自然的是 **LangChain.js**（npm 包），避免“前端 Node + 后端 Python”带来的双栈部署与联调成本。

### 2.2 OpenAI 兼容接口的接入方式
用 LangChain 的 OpenAI ChatModel（或其兼容实现）时，把以下作为**可配置项**（来自 `.env.local`）：
- `AI_API_KEY`
- `AI_BASE_URL`（OpenAI 兼容网关/供应商地址）
- `AI_MODEL`

这样“换模型/换供应商”通常只改 env 或一个 model factory 文件。

---

## 3. 目录结构建议（单仓库内的后端分层）

> 你仍然只有一个 Next.js 项目，只是把后端逻辑从 `route.ts` 里拆出来，避免膨胀。

```
app/api/generate/route.ts
app/api/track/route.ts
app/api/feedback/route.ts

lib/llm/
  model.ts                 # model factory：从 env 初始化 ChatModel
  prompts.ts               # ChatPromptTemplate（模式/风格/滑杆/三输出）
  schema.ts                # 输出结构 schema（zod 或 JSON schema）
  pipeline.ts              # Runnable 主链路（prompt -> model -> parse -> postcheck）

lib/context/
  conversation.ts          # 会话上下文（最近 N 轮 + 可选摘要）
  profile.ts               # 用户画像（可选，先 localStorage/匿名 cookie）
  buildContext.ts          # 聚合上下文：把对话/画像合成统一对象

lib/tools/
  registry.ts              # 工具注册表（先空/少量）
  safetyCheck.ts           # 可选：安全检查工具（或规则实现）

lib/safety/
  policy.ts                # 规则拒答（威胁/隐私/违法等）
  postCheck.ts             # 输出后检查（阴阳/攻击性降级、承诺语句约束）
```

---

## 4. /api/generate 的请求与响应契约（建议）

### 4.1 请求（概念字段）
- `text`：用户原话/想法（必填）
- `style`：6 张风格卡片之一（必填）
  - `delay`（先别急）
  - `refuse`（婉拒了哈）
  - `boundary`（别甩给我）
  - `followup`（该交了吧）
  - `decode`（翻译一下）
  - `sarcasm`（阴阳一下）
- `sliders`：语气仪表盘（可选，但建议都有默认值）
  - `politeness`：0-100
  - `formality`：0-100
  - `distance`：0-100
- `outputModes`：输出形态（固定三种或可选）
  - `wechat` / `email` / `spoken`
- `operation`：本次生成意图
  - `generate`：正常生成
  - `regenerate`：换一个（要求与上一轮差异化）
  - `edit`：基于上一轮“二次改写”
- `context`（可选）：
  - `sessionId`：会话标识（黑客松可用 cookie 或前端生成 uuid）
  - `prev`：上一轮结果（在 regenerate/edit 时带上）

### 4.2 响应（建议结构化）
按输出形态分组，每组都有 3 候选 + 推荐 + 理由：
- `wechat: { candidates[3], recommendedIndex, reasons }`
- `email: { candidates[3], recommendedIndex, reasons }`
- `spoken: { candidates[3], recommendedIndex, reasons }`

统一可选字段：
- `assumptions?: string[]`（≤3）
- `safetyNotes?: string[]`
- `refused?: { message, suggestions[] }`

> 黑客松展示时，“三输出形态”视觉冲击很强，结构化返回也让前端渲染非常简单。

---

## 5. LangChain 主链路（最小可控版）

### 5.1 核心 Runnable 流程
1) `validateInput`（zod）  
2) `buildContext`（会话 N 轮 + 可选画像）  
3) `buildPrompt`（ChatPromptTemplate：系统指令 + 用户输入 + 上下文 + 约束）  
4) `model`（OpenAI 兼容接口，必要时绑定 tools）  
5) `parseOutput`（结构化解析：zod/JSON schema）  
6) `postCheck`（输出后规则检查：攻击性、承诺语句、推荐 index 合法等）  

> 这套流程即使“暂时没有工具”，也已经解决了你担心的“拼接混乱/上下文难控/换模型麻烦”。

### 5.2 “换一个 / 二次改写”的处理方式（不靠玄学）
- `regenerate`：把 `prevCandidates` 注入 prompt，并要求“至少两项维度不同（句式/语气/结构/用词策略）”
- `edit`：把 `prevChosen`（用户选中的候选）+ `editIntent`（更礼貌/更正式/更强硬等）注入 prompt

---

## 6. 工具调用怎么设计（你还没想好工具也没关系）

### 6.1 建议先做“工具注册表”，不急着做很多工具
工具设计目标：**可插拔**，让你后续加工具不需要重写主链路。

`lib/tools/registry.ts` 的职责：
- 根据 `style`/`operation` 决定允许哪些工具
- 返回 `tools[]` 给 pipeline（`model.bindTools(tools)` 或 agent）

### 6.2 黑客松阶段最推荐的 2 个“低风险高收益工具”
1) `safety_check(text)`：用于“阴阳一下”等高风险风格的兜底（也可用规则+二次模型校验实现）  
2) `rewrite_constraints(input)`：把滑杆/场景约束转换为明确可执行的写作约束（也可不做工具，直接在 prompt 里模板化）

> 其他常见工具（后续再加）：RAG 检索、术语解释、画像读写、敏感信息脱敏、模板库查询等。

---

## 7. 会话记忆与用户画像（最小实现策略）

### 7.1 会话记忆（黑客松够用）
- 只保留最近 **N=3~6** 轮（用户输入 + 你最终推荐/用户选择）
- 超过 N 轮做摘要（可选）：用一个轻量 summarize runnable，把早期对话压成 3-5 条要点

### 7.2 用户画像（后续演进，不阻塞 Demo）
推荐分三层演进：
1) V0.1：localStorage（默认滑杆、常用风格）  
2) V0.2：匿名 cookie + 轻量 KV（Upstash/Redis/SQLite）  
3) V1.0：登录后跨端同步

---

## 8. 关键工程约束（避免 LangChain 变“复杂工程”）
1) 不做通用 agent loop（黑客松最容易失控）  
2) 工具数量 ≤ 3（先把主链路跑稳）  
3) 输出必须结构化（不接受纯自然语言长文）  
4) 上下文长度可控：最近 N 轮 + 可选摘要  
5) “阴阳一下”必须有后置安全闸门（不然翻车概率最高）

---

## 9. 最小落地顺序（推荐）
1) 先完成：**prompt 模板化 + 结构化输出 + 三输出形态**  
2) 再完成：regenerate/edit 两种 operation  
3) 再加：会话记忆（最近 N 轮）  
4) 最后加：工具 registry + 1 个 safety 工具（或规则+二次模型校验）

---

## 10. 你现在需要决定的最小事项（不必想全）
即使你“工具还没想好”，也建议先统一：
1) 6 张风格卡片的 `style` 枚举值（delay/refuse/boundary/followup/decode/sarcasm）  
2) 滑杆范围（0-100）与默认值（例如 60/50/70）  
3) 是否固定三输出形态（wechat/email/spoken）——我建议固定，展示效果更好

