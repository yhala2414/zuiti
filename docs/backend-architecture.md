# 话到嘴边 - 后端技术架构定稿

## 1. 文档目标

本文档用于为当前仓库补齐一份可直接执行的后端技术架构定稿。

它不是泛泛而谈的“后端方向说明”，而是基于以下信息综合确定后的落地方案：

- 当前仓库现状与前端页面流程
- 已确认的产品反向 PRD
- 仓库中已有的 Demo 说明文档
- `嘴替Demo-后端架构-LangChainjs-OpenAI兼容.md` 提供的参考方案

本文档的目标是让后续实现者在不反复讨论方向的前提下，直接按统一边界补齐后端能力。

## 2. 定稿结论

当前项目后端架构正式确定为：

- 单仓库 `Next.js BFF`
- API 放在 `app/api/**/route.ts`
- 业务能力放在 `lib/**`
- 使用 `LangChain.js + OpenAI 兼容接口`
- LangChain 仅承担模板化、结构化输出、上下文注入和扩展接口，不引入复杂 Agent 架构
- 后端严格围绕当前产品契约设计，不抽象成通用生成平台

这意味着本项目当前阶段不会拆分独立 NestJS 服务，也不会引入单独 Python 后端。

## 3. 适用范围

本文档适用于当前“话到嘴边”项目的后端实现，服务于如下固定产品链路：

1. 用户选择沟通场景。
2. 用户输入真实原话。
3. 用户选择 6 种风格之一。
4. 用户调节 3 个语气滑杆。
5. 后端生成 3 种输出形态的表达结果。

当前版本不处理登录注册、长期记忆、复杂多轮 Agent 推理、向量检索和跨端同步。

## 4. 架构设计原则

后端定稿遵循以下原则：

### 4.1 单仓库优先

继续保持当前仓库的单项目形态，不新增独立后端工程，确保开发、调试、演示和部署链路最短。

### 4.2 产品契约优先

后端围绕当前确定的产品结构设计，而不是做一个高度抽象、可支持任意写作任务的通用平台。

### 4.3 结构化输出优先

后端返回结果必须是强约束结构化 JSON，确保前端渲染稳定，避免模型自由发挥导致结果不可控。

### 4.4 可控扩展优先

要为后续的会话上下文、用户偏好、反馈闭环和安全工具预留插口，但当前不引入高复杂度基础设施。

### 4.5 Demo 稳定优先

优先解决“能稳定生成、能稳定展示、能稳定兜底”的问题，不追求重工程、重中台、重平台化。

## 5. 当前产品契约

后端必须严格围绕当前产品契约实现，以下字段和范围视为第一版定稿。

### 5.1 场景枚举

固定为 4 类：

- `student`
- `work`
- `social`
- `formal`

它们分别对应前端首页中的：

- 学生沟通
- 职场沟通
- 社交沟通
- 正式事务

### 5.2 风格枚举

固定为 6 类：

- `delay` 对应“先别急”
- `refuse` 对应“婉拒了哈”
- `boundary` 对应“别甩给我”
- `followup` 对应“该交了吧”
- `decode` 对应“翻译一下”
- `sarcasm` 对应“阴阳一下”

### 5.3 滑杆契约

固定为 3 个连续型参数，范围统一为 `0-100`：

- `politeness`
- `formality`
- `distance`

推荐默认值：

- `politeness: 60`
- `formality: 50`
- `distance: 70`

### 5.4 输出形态

第一版固定返回 3 类输出：

- `wechat`
- `email`
- `spoken`

这里不做可配置式动态裁剪，固定三输出更符合当前 Demo 展示和前端页面结构。

### 5.5 操作类型

第一版后端操作类型定义如下：

- `generate`：正常生成
- `regenerate`：基于上一轮结果重新生成
- `edit`：基于上一轮选中结果做二次改写

当前前端虽尚未全部接入这三类操作，但后端架构应一次性为它们预留好契约和目录边界。

## 6. 总体架构

整体采用分层模块化 BFF 结构。

```text
Browser UI
  -> app/api/**/route.ts
  -> lib/use-cases/**
  -> lib/context/**
  -> lib/llm/**
  -> lib/safety/**
  -> OpenAI-compatible LLM provider
```

每层职责如下：

- `Route 层`：处理 HTTP 协议、请求体解析、调用用例、输出标准响应
- `Use Case 层`：编排业务流程，协调上下文、模型、校验和安全检查
- `Context 层`：组装生成时所需的产品上下文和最近轮次信息
- `LLM 层`：封装 Prompt、模型调用、结构化解析和输出规范化
- `Safety 层`：做生成前拒答和生成后安全降级

## 7. 推荐目录结构

以下目录为定稿后的推荐实现结构：

```text
app/
  api/
    generate/
      route.ts
    feedback/
      route.ts
    track/
      route.ts

lib/
  domain/
    enums.ts
    defaults.ts
    output-modes.ts
    errors.ts

  validators/
    generate.ts
    feedback.ts
    track.ts

  use-cases/
    generate-expression.ts
    submit-feedback.ts
    track-event.ts

  llm/
    model.ts
    prompts.ts
    schema.ts
    pipeline.ts
    normalize.ts

  context/
    conversation.ts
    profile.ts
    build-context.ts

  safety/
    policy.ts
    post-check.ts

  analytics/
    events.ts
    logger.ts

  tools/
    registry.ts
```

### 7.1 目录职责说明

#### `app/api/generate/route.ts`

负责：

- 接收前端生成请求
- 调用生成用例
- 返回统一响应格式

不负责：

- 直接拼 Prompt
- 直接调用模型 SDK
- 直接写复杂业务规则

#### `app/api/feedback/route.ts`

负责接收用户对结果的反馈，如“有用/无用”和原因标签。

#### `app/api/track/route.ts`

负责记录复制、重试、切换风格、点击推荐结果等埋点事件。

#### `lib/domain/**`

负责沉淀领域常量和枚举，避免这些值散落在页面、路由和 Prompt 中。

#### `lib/validators/**`

负责入参和出参的 schema 校验，推荐统一使用 `zod`。

#### `lib/use-cases/**`

负责业务编排，是整个后端实现的核心入口层。

#### `lib/llm/**`

负责模型接入和生成链路本身，是与 LangChain 和模型提供方发生直接联系的地方。

#### `lib/context/**`

负责生成上下文聚合，包括最近会话、匿名偏好和产品默认规则。

#### `lib/safety/**`

负责风险识别和结果兜底，尤其是高风险风格如 `sarcasm`。

#### `lib/analytics/**`

负责埋点事件名和简单日志能力，保证反馈和跟踪逻辑不散落在 API 中。

#### `lib/tools/registry.ts`

负责为未来扩展预留统一工具入口，但第一版可以为空实现或仅做轻量注册。

## 8. API 设计定稿

## 8.1 `POST /api/generate`

### 请求体

```json
{
  "text": "这个活不是我负责的，别老找我。",
  "scene": "work",
  "style": "boundary",
  "sliders": {
    "politeness": 72,
    "formality": 58,
    "distance": 64
  },
  "outputModes": ["wechat", "email", "spoken"],
  "operation": "generate",
  "context": {
    "sessionId": "session_xxx",
    "prev": null
  }
}
```

### 字段说明

- `text`：用户原话，必填
- `scene`：4 类场景之一，必填
- `style`：6 种风格之一，必填
- `sliders`：3 个语气滑杆，允许前端显式传值
- `outputModes`：当前固定为 3 项，但仍建议以前端显式传参形式保留协议一致性
- `operation`：当前支持 `generate | regenerate | edit`
- `context.sessionId`：匿名会话标识
- `context.prev`：在 `regenerate` 或 `edit` 时可带上前一轮结果

### 成功响应

```json
{
  "ok": true,
  "data": {
    "wechat": {
      "candidates": [
        "这件事目前不在我负责范围内，建议你直接找对应同事确认，我这边可以补充已有信息。",
        "这个部分不是我在跟进，直接联系负责同事会更高效，我这边如需配合可以支持。",
        "这块不是由我负责的，建议找对应负责人沟通，会更准确一些。"
      ],
      "recommendedIndex": 1,
      "reasons": [
        "边界表达清晰",
        "语气礼貌但不软弱",
        "适合即时沟通场景"
      ]
    },
    "email": {
      "candidates": ["...","...","..."],
      "recommendedIndex": 0,
      "reasons": ["...","...","..."]
    },
    "spoken": {
      "candidates": ["...","...","..."],
      "recommendedIndex": 2,
      "reasons": ["...","...","..."]
    },
    "assumptions": [
      "默认对方为同事或协作对象"
    ],
    "safetyNotes": []
  }
}
```

### 拒答响应

```json
{
  "ok": false,
  "code": "SAFETY_REFUSED",
  "message": "该请求涉及高风险表达，不适合直接生成。",
  "data": {
    "refused": {
      "message": "我不能帮你生成带有明显攻击、威胁或报复导向的表达。",
      "suggestions": [
        "改为描述事实和诉求",
        "使用更正式的申诉语气",
        "保留边界但避免人身攻击"
      ]
    }
  }
}
```

### 错误响应

```json
{
  "ok": false,
  "code": "INVALID_INPUT",
  "message": "请求参数不合法"
}
```

## 8.2 `POST /api/feedback`

### 请求体建议

```json
{
  "sessionId": "session_xxx",
  "resultId": "result_xxx",
  "useful": true,
  "reasonTags": ["clear", "polite", "usable"]
}
```

### 用途

- 闭环记录用户主观评价
- 为后续调 Prompt 和默认参数提供数据基础

## 8.3 `POST /api/track`

### 请求体建议

```json
{
  "sessionId": "session_xxx",
  "event": "copy_result",
  "payload": {
    "mode": "wechat",
    "candidateIndex": 1
  }
}
```

### 用途

- 记录用户行为事件
- 支持后续评估哪个输出形态和风格更常被使用

## 9. `generate` 用例执行链路

`POST /api/generate` 的执行链路定稿如下：

1. `route.ts` 接收请求
2. `validators/generate.ts` 做 schema 校验
3. `use-cases/generate-expression.ts` 进入主流程
4. `context/build-context.ts` 聚合上下文
5. `safety/policy.ts` 先做输入级风险检查
6. `llm/pipeline.ts` 执行 Prompt -> Model -> Parse
7. `safety/post-check.ts` 做输出级检查与降级
8. `llm/normalize.ts` 统一整理结构
9. `route.ts` 返回统一 JSON 响应

## 10. LangChain 使用边界

LangChain.js 在本项目中只承担以下 4 个角色：

### 10.1 Prompt 模板化

通过 `ChatPromptTemplate` 统一拼装系统指令、风格约束、场景约束、滑杆规则和上一轮上下文。

### 10.2 结构化输出

通过 schema 约束模型输出，确保固定产出三组结果，每组包含 `3 candidates + recommendedIndex + reasons`。

### 10.3 上下文注入

把会话上下文、偏好信息和前一轮结果作为结构化上下文注入，而不是散乱拼接字符串。

### 10.4 扩展接口

为未来工具调用、安全工具和画像工具预留统一注册口。

### 10.5 明确不做的事情

当前阶段不使用 LangChain 做以下能力：

- 通用 Agent Loop
- 多工具反复推理
- 向量库编排
- 复杂工作流图
- 多模型协商式决策

## 11. Prompt 设计定稿

Prompt 层必须围绕当前产品契约生成，而不是接受一个模糊的“帮我改写一下”。

### 11.1 Prompt 输入维度

Prompt 至少包含以下变量：

- 场景 `scene`
- 风格 `style`
- 原话 `text`
- 滑杆参数 `politeness/formality/distance`
- 输出模式列表
- 当前操作类型
- 上一轮候选结果或用户选中结果
- 安全约束

### 11.2 Prompt 目标

模型需要同时满足：

- 生成 3 种输出形态
- 每种形态生成 3 个候选
- 为每种形态给出一个推荐项
- 推荐项必须来自候选数组
- 理由应简短且可解释
- 不得输出多余闲聊

### 11.3 风格控制要求

不同风格应体现不同写作意图：

- `delay`：重点是拖延但不失礼
- `refuse`：重点是拒绝但不撕破脸
- `boundary`：重点是划清责任边界
- `followup`：重点是礼貌推进
- `decode`：重点是翻译潜台词或识别真实意图
- `sarcasm`：允许有反差，但必须经过额外安全闸门，不能生成明显攻击性话术

## 12. 结构化输出 Schema 定稿

建议使用 `zod` 定义统一结构。

核心约束如下：

- `wechat/email/spoken` 必须全部存在
- 每个模式下 `candidates.length === 3`
- `recommendedIndex` 必须是 `0 | 1 | 2`
- `reasons.length` 建议为 `2-3`
- `assumptions` 最多 3 条
- 拒答结果和成功结果互斥

如果解析失败，必须视为后端错误，不允许把非结构化原文直接透传给前端。

## 13. 上下文设计定稿

## 13.1 会话上下文

第一版仅保留最近 `3-6` 轮，包含：

- 用户原话
- 选中的风格
- 滑杆参数
- 最终推荐结果或用户选中结果

在 Demo 阶段，会话上下文可以用匿名 `sessionId` + 轻量存储或内存方案承载。

### 13.2 用户偏好

第一版不做完整用户画像，只预留偏好入口，例如：

- 默认滑杆值
- 常用风格
- 常用输出模式

推荐演进顺序：

1. `localStorage`
2. 匿名 cookie + 轻量 KV
3. 登录后画像同步

### 13.3 上下文构建原则

上下文必须在 `build-context.ts` 中统一聚合，不允许在 route、Prompt 和前端之间各自拼装一套上下文逻辑。

## 14. 安全策略定稿

安全策略分为两层。

### 14.1 输入前置策略

在模型调用前判断是否需要拒绝，包括但不限于：

- 威胁、恐吓、报复
- 明显违法内容
- 侵犯隐私或恶意操控
- 极端侮辱和人身攻击

命中规则时直接返回拒答结构，不再调用模型。

### 14.2 输出后置策略

模型产出后继续检查：

- 是否带有明显攻击性
- 是否与当前风格目标严重偏离
- 是否存在越界承诺
- 是否存在不合法推荐索引
- 是否存在与结构不符的内容

如果结果轻微不合格，可尝试降级处理。
如果结果严重不合格，应直接返回错误并提示重试。

### 14.3 `sarcasm` 风格特殊规则

`sarcasm` 是当前最高风险风格，必须单独加闸：

- 允许轻微反讽，不允许攻击和羞辱
- 不允许引导升级冲突
- 优先生成“有态度但不翻车”的表达

## 15. 模型接入定稿

模型接入统一由 `lib/llm/model.ts` 完成。

### 15.1 环境变量

使用以下环境变量：

- `AI_API_KEY`
- `AI_BASE_URL`
- `AI_MODEL`

### 15.2 接入原则

- 模型实例创建只能在一处完成
- Route 和用例层不得直接依赖具体模型 SDK
- 模型切换尽量只改 env 或 `model.ts`

### 15.3 运行时

API 路由使用 Node Runtime，不使用 Edge Runtime。

原因：

- 兼容更多 Node 侧依赖
- 更适合 LangChain.js 与 OpenAI 兼容 SDK 的使用场景

## 16. 日志与埋点定稿

第一版不引入复杂观测平台，但必须保留基础日志和埋点结构。

### 16.1 需要记录的最小日志

- 请求进入时间
- operation 类型
- 场景与风格
- 调用成功或失败
- 失败错误码
- 模型耗时

### 16.2 需要记录的最小埋点

- 开始生成
- 生成成功
- 生成失败
- 复制结果
- 再生成
- 提交反馈

### 16.3 日志要求

- 不在日志中明文泄露敏感隐私内容
- 原话可做截断或脱敏记录

## 17. 错误码定稿

建议在 `lib/domain/errors.ts` 中统一定义错误码：

- `INVALID_INPUT`
- `SAFETY_REFUSED`
- `MODEL_TIMEOUT`
- `MODEL_BAD_OUTPUT`
- `INTERNAL_ERROR`

这些错误码要保证前后端统一使用，避免前端只能依赖字符串判断错误类型。

## 18. 非目标

以下内容明确不属于第一版后端实现范围：

- 独立 NestJS 服务
- 数据库重模型设计
- 登录注册与账号体系
- 长期用户画像
- 向量检索和知识库
- 复杂 Agent 编排
- 多租户、多团队后台

## 19. 实施顺序定稿

推荐按以下顺序推进：

### 第一阶段

- 建立 `app/api/generate/route.ts`
- 建立 `lib/domain`、`lib/validators`、`lib/llm` 的最小骨架
- 打通 `generate` 的结构化返回链路

### 第二阶段

- 建立 `feedback` 和 `track` 接口
- 补齐错误码和日志
- 接入前端页面

### 第三阶段

- 支持 `regenerate`
- 支持 `edit`
- 支持最近会话上下文

### 第四阶段

- 强化 `sarcasm` 安全策略
- 增加轻量工具注册表
- 增加匿名偏好能力

## 20. 与当前仓库的对应关系

本文档与当前仓库中的以下文档和页面一一对应：

- 产品定位与功能来源：`docs/product-prd.md`
- 当前页面流程：`docs/mobile-pages-routes.md`
- 当前组件与页面结构：`项目组件化开发指南.md`
- 当前 Demo 说明：`README.md`
- 后端参考方案：`嘴替Demo-后端架构-LangChainjs-OpenAI兼容.md`

因此，这份文档不是脱离现状重新设计，而是对现有仓库和既有决策的收敛与定稿。

## 21. 最终结论

“话到嘴边”的后端第一版应当是一个围绕固定产品契约构建的模块化 Next.js BFF。

它的目标不是做一个无限扩展的通用生成平台，而是以最小复杂度稳定支撑：

- 场景化表达转换
- 风格化生成
- 语气可控
- 三输出形态
- 安全可兜底
- 后续可逐步扩展

后续实现应以本文档为唯一后端技术架构基线，避免再回到“是否拆服务”“是否做通用平台”“是否上复杂 Agent”这类已完成决策的问题上。
