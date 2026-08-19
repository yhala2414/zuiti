# Zuiti Architecture

## Scope

During Phase 0, Zuiti remains one mobile-first Next.js App Router application. It does not yet include an independent backend, database, authentication system, RAG, complex Agent loop, or additional UI/state/test framework. Confirmed future directions and their entry gates are defined in `docs/product-evolution.md`.

Primary inspection viewport: `375 x 750`.

## Routes

| Route | File | Responsibility |
| --- | --- | --- |
| `/` | `app/page.tsx` | Product entry, recent history, hot styles, start CTA |
| `/input` | `app/input/page.tsx` | Scene, target, style, and raw thought input |
| `/tone` | `app/tone/page.tsx` | Tone sliders, preview, and generation trigger |
| `/results` | `app/results/page.tsx` | Three output modes and result actions |
| `/history` | `app/history/page.tsx` | Local recent history and favorites |
| `/profile` | `app/profile/page.tsx` | Local statistics, favorite summary, and staged preferences surface |
| `POST /api/generate` | `app/api/generate/route.ts` | Validate request and return model/fallback/refusal/error result |
| `POST /api/feedback` | `app/api/feedback/route.ts` | Validate and log lightweight feedback |
| `POST /api/track` | `app/api/track/route.ts` | Validate and log lightweight analytics |

The main flow is `/ -> /input -> /tone -> /results`. Direct visits to `/tone` and `/results` must show a recovery or missing-draft state rather than pretending generation succeeded.

## Data Flow

```text
Browser page
  -> Zustand flow state / local browser storage
  -> utils/expression-api.ts
  -> utils/api-client.ts
  -> app/api/**/route.ts
  -> lib/validators + lib/use-cases
  -> lib/context + lib/safety + lib/llm
  -> model provider or deterministic fallback
```

Pages do not issue standalone BFF `fetch` or axios calls. Browser BFF access goes through the shared axios client and product wrappers. Route Handlers use Web `Request` and `Response`, not the browser axios client.

## Module Boundaries

- `app/**`: route composition and BFF handlers.
- `components/**`: reusable mobile UI, paired with CSS Modules.
- `stores/**`: cross-page Zustand state.
- `utils/**`: browser API wrappers, content mappings, and local storage.
- `lib/domain/**`: enums, defaults, contracts, and errors.
- `lib/validators/**`: zod validation for external input.
- `lib/use-cases/**`: business orchestration.
- `lib/context/**`: request context and language inference.
- `lib/safety/**`: pre- and post-generation safety checks.
- `lib/llm/**`: model creation, prompts binding, parsing, normalization.
- `lib/analytics/**`: lightweight event/log helpers.
- `config/copy/**`: user-visible copy, fallback content, and API messages.
- `config/prompts/**`: model-facing prompt strategy.

Route pages are composition roots. Keep page-local behavior local until reuse is confirmed; prefer existing shared components before adding abstractions.

## Product and API Contract

Generation accepts the fixed product concepts defined in `docs/product-prd.md`: text, scene, target, style, sliders, output modes, operation, session context, and optional previous context.

Successful generation returns:

- `wechat`
- `email`
- `spoken`
- `assumptions`
- `safetyNotes`
- `meta.source`: `model | fallback`
- `meta.language`

External request and model output structures are validated before use. Refusal/error responses do not expose raw model or stack details.

## State and Persistence

Main flow state lives in `stores/expression-flow-store.ts`, including scene, target, style, text, sliders, session ID, and generation state.

Current write paths:

- recent history and favorites: `utils/recent-history.ts` -> local storage;
- statistics: local MVP storage;
- preferences: staged storage key without a completed user-facing read/write path;
- feedback: `POST /api/feedback` -> lightweight logging;
- tracking: `POST /api/track` -> lightweight logging.

There is no committed database schema, account system, or cloud sync.

## Model, Fallback, and Safety

Model configuration is server-only:

```text
AI_API_KEY
AI_BASE_URL
AI_MODEL
```

Missing configuration, timeouts, provider errors, or malformed output use a deterministic fallback. Fallback is valid MVP behavior but must preserve `meta.source: "fallback"`.

The generation path rejects or downgrades threats, harassment, privacy invasion, illegal requests, and severe personal attacks. `sarcasm` may be lightly pointed but cannot become insulting, threatening, or escalatory.

Allowed LangChain use is limited to prompt templates, server-side model invocation, structured parsing, context/language injection, and small extension seams that preserve the product contract.

## Copy and Prompt Ownership

- Directly visible user text belongs in `config/copy/**`.
- Model-facing instructions belong in `config/prompts/**`.
- Display labels and model labels for the same concept may require coordinated changes in both locations.
- Prompt text must not be embedded in UI components.
- Structural protocol fields and enums may remain in domain/implementation modules.

See `config/README.md` before changing these surfaces.

## Styling and Mobile Layout

- Global tokens and shared visual classes live in `app/globals.css`.
- Page-specific styles live in `app/**/page.module.css`.
- Component-specific styles live beside the component.
- Prefer existing semantic tokens and `antd-mobile` primitives already in use.
- Do not introduce another CSS or UI system.

A value becomes a global token only when it has the same stable semantic meaning across at least two pages or reusable components. Page decoration, private icon details, temporary offsets, and numerically similar values with different meanings stay local.

For UI changes, inspect affected routes at `375 x 750` when browser tooling is available and report any skipped visual verification.

## Documentation Sync

Update this file only when routes, module responsibilities, data flow, API contracts, storage, model boundaries, copy/prompt ownership, or shared styling rules change. Ordinary feature notes, plans, and audits belong in ignored `.local-docs/`.

Use `docs/product-evolution.md` for confirmed future directions, sequencing, and stage gates. Do not describe planned architecture here as already implemented.
