# AI Collaboration System Audit

## 1. Executive Summary

当前仓库 AI 协作成熟度评价：**中高，约 7/10**。

优点：

- 已有较强的 AI 协作骨架：`AGENTS.md`、`docs/sddspec.md`、`docs/specs/**`、`.agents/skills/**`、`config/README.md` 都在约束 Agent 读什么、怎么改、哪些不能碰。
- 架构边界清楚：Next.js BFF、`app/api/**`、`lib/**`、不做通用聊天、不随便加数据库/登录/独立后端。
- 已经开始把产品、Prompt、UI copy、fallback、API 请求路径集中治理，这对长期 Agent 协作很关键。

主要风险：

- **文档状态没有闭环**：部分任务/清单显示未完成，但代码中已实现；也有文档写 4 页主流程，但代码已有 `/history`、`/profile`。
- **产品源头分裂**：审计时存在当前 PRD、根目录旧 PRD、README、历史 Trae specs 同时描述产品的情况，且部分口径冲突。
- **验证契约不够可执行**：有 lint/build 和分层回归测试，但没有 `test:all`，浏览器 375x750 检查长期停留在“未完成/不可用”。
- **本地/正式上下文边界仍模糊**：`.trae/specs` 被 `.gitignore` 忽略但仍作为历史参考；本次使用的 `project-collaboration-operating-system` skill 也是未跟踪本地文件。

总体建议：

- 不需要重建文档体系。下一阶段应做“收敛与状态修复”：建立一个权威上下文索引，归档/降级旧文档，修复规格清单状态，补一个最小验证指南。

## 2. Current Collaboration Architecture

```text
用户当前指令
  > AGENTS.md
    - 项目定位、必读顺序、权威优先级、禁止事项、SDD 工作流
  > docs/sddspec.md
    - 非小改动必须 Spec -> Plan -> Tasks -> Checklist -> Implement -> Verify
  > docs/specs/<feature>/
    - 每个功能的 spec/design/tasks/checklist
  > 产品/架构文档
    - docs/product-prd.md
    - docs/backend-architecture.md
    - docs/mobile-pages-routes.md
    - 审计时仍存在的根目录旧 PRD 和历史后端方案
  > 本地/工具上下文
    - .agents/skills/*
    - .specify/*
    - .trae/specs/* historical only
    - docs/superpowers/plans/*
  > 代码现实
    - app/, components/, config/, lib/, stores/, utils/, tests/
  > 验证
    - npm run lint/build
    - test:p0/test:p1/test:p2/test:prd-v1.1
    - 手动 375x750 检查，当前多处未完成
```

关键诊断：

- Authoritative context：`AGENTS.md` + `docs/sddspec.md` + active `docs/specs/**`。
- Temporary/local context：`.trae/specs/**`、`.specify/**`、`docs/superpowers/plans/**`、未跟踪 `.agents/skills/project-collaboration-operating-system/`。
- Current scope gates：MVP、Next.js 单仓库、BFF、无登录/数据库/复杂 Agent。
- Behavior/write-path rules：API、Zustand、localStorage、logger 已有，但“用户可见成功必须有写路径”还没有被单独写成规则。
- Verification contract：有脚本，但缺少统一入口和浏览器验证替代方案。
- Correction loop：SDD checklist 有雏形，但没有“发现文档过时后如何修复状态”的协议。

## 3. Document Audit Table

| 文件 | 状态 | 问题 | 建议 |
| --- | --- | --- | --- |
| `AGENTS.md` | 修改 | 权威优先级和边界很好，但当前路由仍写 4 页，未覆盖 `/history`、`/profile`；没有明确本地 skill/ignored spec 的权威等级 | 保留为最高 Agent 入口，更新当前路由、验证入口、本地上下文规则 |
| `README.md` | 修改 | 入口价值高，但仍有“模式 1-5”等旧口径，和 6 styles、PRD v1.1 不一致 | 保留入口；改成导航型 README，减少重复产品细节 |
| `docs/product-prd.md` | 合并/修改 | 反向 PRD 清楚，但说 AI 链路“待接入”，已落后当前 BFF/fallback/source 状态 | 与 PRD v1.1 收敛成唯一产品基线，或明确为旧反向 PRD |
| 根目录旧 PRD | 删除/已并入 | 更接近当前 `/history`、`/profile`、target 设计，但在根目录且与 `docs/product-prd.md` 分裂 | 并入 `docs/product-prd.md` 后删除原文件 |
| `docs/backend-architecture.md` | 保留/修改 | BFF 边界有效；部分目录/契约已被当前实现扩展，如 language/source metadata | 保留为后端基线，补当前实现状态和已完成决策 |
| 根目录旧后端方案 | 删除/已并入 | 与 backend architecture 重复，适合作历史背景，不应长期作为必读 | 摘要迁入 backend architecture 后删除原文件 |
| `docs/mobile-pages-routes.md` | 修改 | 只列 4 页，缺 `/history`、`/profile`；目标 viewport 有价值 | 更新为完整路由图和验证路由清单 |
| `docs/sddspec.md` | 保留/修改 | SDD 规则强；但缺“规格状态闭环”和“过时任务如何修正”的规则 | 增加 spec 状态：active/done/stale/archived，以及关闭 checklist 的要求 |
| `docs/specs/README.md` | 修改 | 只说明目录，不告诉 Agent 哪个 spec 当前有效、哪些完成/遗留 | 增加 spec index 表和阅读优先级 |
| `docs/specs/backend-bff-state/*` | 修改 | tasks/checklist 与代码现实不一致：部分 T041-T045 已实现，但仍未勾；checklist 18 项未完成 | 先做状态审计，不改代码；把已实现项、未验证项、真实缺口拆开 |
| `docs/specs/p1-interaction-polish/*` | 保留/修改 | 基本完成，但 E2E/browser 仍未完成 | 标为 done-with-manual-gap，集中到验证债务列表 |
| `docs/specs/p2-demo-polish/*` | 保留/修改 | 同上，浏览器检查缺口长期存在 | 同上 |
| `docs/specs/axios-api-client/*` | 保留/修改 | 传输层文档清楚，但 manual 375x750 未完成 | 保留；补充“无 UI 变更时 browser 检查可降级”的规则 |
| `docs/api-request-and-config-map.md` | 保留/修改 | 请求图非常适合 AI；但部分页面行为可能随 PRD v1.1 后续变化漂移 | 保留为请求/配置权威，纳入更新清单 |
| `config/README.md` | 保留 | 很强的 copy/prompt 修改边界，能显著减少 Agent 乱改 | 保留，作为配置变更必读 |
| 运行时代码中的 copy 迁移审计常量 | 删除 | 代码里放迁移审计清单会造成“源码承载过程文档”；且显示 prompt pending 已可能过时 | 删除运行时代码中的审计常量 |
| 根目录旧组件化指南 | 删除/已并入 | 扫描结论明显过时：仍写 4 个页面、BottomNav 未绑定真实路由 | 有效内容压缩进 `docs/frontend-architecture.md` 后删除 |
| 根目录泛化 React/AntD 教程 | 删除 | 教程价值有，但泛化、长、不是项目正式规则 | 删除，不作为项目正式参考 |
| 旧全局变量申请表 | 重命名/已更新 | 对全局 token 治理有实际价值；命名像一次性表单 | 改名为 `docs/design-token-governance.md` |
| `.specify/**` | 移动到 local/tool notes | scaffold constitution 还是模板占位，不应被当正式宪章 | 明确仅为 Spec Kit 工具运行材料 |
| `.trae/specs/**` | 移动到 local notes/归档 | `.gitignore` 已忽略，但 AGENTS 又说可参考，容易让 Agent 误读 | 保留为 historical archive，禁止作为当前验收标准 |
| `.agents/skills/project-collaboration-operating-system` | 修改/决策 | 当前未跟踪；如果是项目方法论，应提交；如果是个人工具，应保持 local | 决定是否正式纳入仓库，否则 AGENTS 不应依赖它 |
| `package.json` scripts | 修改 | 有分层测试，无统一 `test`/`test:all`；`tone-preview.test.ts` 未出现在脚本里 | 增加统一验证入口，或文档明确每类任务跑哪些脚本 |
| `tests/**` | 保留/修改 | 回归测试多为静态结构断言，适合 MVP，但不能替代浏览器/链路验证 | 保留；补最小 smoke/API/browser 验证说明 |

## 4. AI Collaboration Risk Analysis

| 风险 | 类型 | 原因 | 改进 |
| --- | --- | --- | --- |
| Agent 读 README 后直接开工 | 上下文发现问题 | README 与 AGENTS 都有导航，但 README 内重复旧产品口径 | README 只做入口，强制指向 AGENTS + active spec |
| 不知道哪个 PRD 是真的 | 文档歧义问题 | 当前 PRD 与根目录旧 PRD 并存 | 只保留一个当前 PRD，删除旧 PRD |
| 把 `.trae/specs` 当当前任务来源 | 文档歧义问题 | AGENTS 说 historical，但目录存在且内容像正式 spec | 建立 archive 规则，文件夹加 README 或迁移出主视野 |
| 根据过时 checklist 误以为功能未做 | 流程问题 | tasks/checklist 没有随代码落地同步关闭 | 增加 spec status audit 和关闭规则 |
| UI 做完但缺浏览器证据 | 流程问题 | 多个 spec 都留下 manual browser gap | 写最小 browser verification guide，定义无法运行时的替代证据 |
| 用户可见“成功”没有真实写路径 | 文档缺失问题 | skill 要求行为写路径，但项目规则未单独沉淀 | 新增 behavior/write-path 小节，覆盖收藏、分享、反馈、历史 |
| Agent 为解决历史/反馈直接加数据库 | 文档歧义/执行问题 | AGENTS 禁止随便加 DB，但 PRD v1.1 有历史/统计愿景 | 在 PRD 中标注 localStorage 是当前阶段边界 |
| Prompt/copy 修改误改业务链路 | Agent 执行问题 | `config/README.md` 已清楚，若犯错多是执行没读 | 不改文档，执行时强制先读 config README |
| 多轮对话后丢失状态 | 文档缺失问题 | 没有 session handoff / audit note 规则 | 增加 local notes policy 和 handoff 模板 |
| `.specify` 模板宪章被当正式宪章 | 上下文发现问题 | `.specify/memory/constitution.md` 是占位模板 | 明确 `.specify/**` 是工具 scaffold，不是项目规则 |
| 过度依赖 lint/build | 流程问题 | 没有统一 test matrix；build 可能慢，browser 可能不可用 | 按变更类型定义最小验证矩阵 |
| 文档越修越多 | 流程问题 | 已有多份长文档，缺少归档/删除标准 | 建立文档生命周期：active/reference/archive/local |

## 5. Recommended Migration Plan

### P0

必须修复，否则影响 AI 协作：

- 修复权威入口：更新 `AGENTS.md` 的当前路由、当前数据流、local/ignored 文档权威规则。
- 收敛产品源：保留 `docs/product-prd.md` 作为当前产品基线，删除根目录旧 PRD。
- 修复 active spec 状态：重点审计 `backend-bff-state`，把“已实现但未勾”“未实现”“未验证”分开。
- 建立验证矩阵：在 `docs/verification-guide.md` 或 `docs/specs/README.md` 中定义 lint/build/test/browser/API 何时必跑。
- 决定本地 skill 命运：`project-collaboration-operating-system` 若要成为项目协作规范，提交并加入 AGENTS；否则标记为个人工具。

### P1

提升长期维护性：

- 更新 `docs/mobile-pages-routes.md` 和 `docs/frontend-architecture.md`，纳入 `/history`、`/profile`、target/context、BottomNav 真实行为。
- 将历史后端方案、React/AntD 入门长文降级为 reference/archive，减少必读负担。
- 删除运行时代码中的过程审计常量，避免源码混入过期协作状态。
- 给 `docs/specs/README.md` 增加 active/done/stale/archive 索引。
- 给行为写路径补规则：收藏、历史、反馈、分享、生成状态必须能追踪到 state/storage/API/log。

### P2

优化体验：

- 增加 `npm run test` 或 `npm run test:all`，覆盖 p0/p1/p2/prd/tone-preview。
- 补一个轻量 decision log，例如 `docs/decisions.md`，只记录高影响决策：不用 DB、不拆后端、fallback 是否用户可见、PRD v1.1 是否当前源。
- 增加 local handoff 约定：临时审计、截图、运行记录放哪里，如何升级为正式文档。
- 简化 README，只保留定位、启动、读文档路线和常用命令。

## 6. Next Steps

1. 做一次“文档状态校准”任务，只改文档状态，不改产品代码：校准 AGENTS、PRD、routes、backend-bff-state tasks/checklist。
2. 产出一个最小 `docs/verification-guide.md`：按文档变更、UI 变更、API 变更、Prompt/copy 变更列出必跑检查。
3. 归档或降级历史文档：根目录旧后端方案、泛化 React/AntD 教程、`.trae/specs`。
4. 决定 `project-collaboration-operating-system` 是否提交入仓库；如果提交，给它在 AGENTS 中明确“方法论 skill，不覆盖项目规则”。
5. 后续每个 feature spec 关闭前，必须补一条“状态结论”：done / done with verification gap / stale / superseded。

## Audit Notes

- 本审计只基于只读文件扫描、git 状态检查和文档/代码一致性核对。
- 审计本身未修改产品代码。
- 审计时未运行 lint/build/test。
