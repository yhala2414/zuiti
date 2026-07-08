# 话到嘴边（zuiti）Web H5 Demo

`话到嘴边` 是一个移动端 H5 表达转换工具。用户输入真实、直接、难开口的话，选择沟通场景、对象、表达风格并调节语气后，获得微信短句、邮件正式、当面沟通三个可直接使用的表达版本。

本项目是单仓库 Next.js App Router MVP：

- 前端：Next.js 16.2.7、React 19、TypeScript、CSS Modules、`antd-mobile`
- 状态：Zustand + local browser storage
- BFF：`app/api/**/route.ts`
- 生成链路：`lib/**` + LangChain.js + OpenAI-compatible API

## Quick Start

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Common commands:

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## Environment

Use `.env.local` for local secrets. Do not commit it.

```text
AI_API_KEY=
AI_BASE_URL=https://api.deepseek.com
AI_MODEL=deepseek-v4-pro
```

When `AI_API_KEY` is empty, the BFF uses deterministic local fallback results.

## Current Routes

| Route | Purpose |
| --- | --- |
| `/` | Home, recent history, hot styles, and start CTA |
| `/input` | Scene, target, style, and raw thought input |
| `/tone` | Tone sliders and generated/fallback preview |
| `/results` | Three output modes, copy, feedback, share, favorite, edit, regenerate |
| `/history` | Local recent history and favorites |
| `/profile` | Local MVP preferences/statistics/profile surface |
| `/api/generate` | Server-side generation BFF |
| `/api/feedback` | Lightweight feedback logging |
| `/api/track` | Lightweight behavior tracking |

## Read First

For AI agents and maintainers:

1. [`AGENTS.md`](./AGENTS.md) - binding agent rules and source-of-truth order
2. [`docs/specs/README.md`](./docs/specs/README.md) - current spec status index
3. [`docs/product-prd.md`](./docs/product-prd.md) - only current product PRD
4. [`docs/backend-architecture.md`](./docs/backend-architecture.md) - backend/BFF baseline
5. [`docs/frontend-architecture.md`](./docs/frontend-architecture.md) - frontend route/component/style guide
6. [`docs/mobile-pages-routes.md`](./docs/mobile-pages-routes.md) - route map and mobile viewport target
7. [`config/README.md`](./config/README.md) - copy, fallback, API message, and prompt configuration rules
8. [`docs/verification-guide.md`](./docs/verification-guide.md) - verification matrix

## Current Scope

In scope:

- Scene-based expression conversion
- Target-aware input flow
- Six expression styles
- Three tone sliders
- Three output modes
- Local history/favorites/preferences for MVP
- Server-side model or fallback generation
- Lightweight feedback and tracking logs

Out of scope unless an approved spec says otherwise:

- Login/accounts
- Cross-device sync
- Full database layer
- Long-term memory
- Vector search/RAG
- Independent backend service
- Generic chatbot or generic writing platform

## Directory Map

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
