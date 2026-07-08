# Backend Architecture

## 1. Decision

The backend direction for `话到嘴边` is a single Next.js BFF inside the current app:

- API routes live in `app/api/**/route.ts`.
- Business logic lives in `lib/**`.
- Model calls stay server-side.
- LangChain.js is used only for prompt templating, model invocation, structured parsing, context injection, and extension seams.
- The project does not use a separate NestJS/Python backend, database layer, RAG system, or complex Agent loop in the current MVP.

## 2. Current API Routes

| Route | File | Responsibility |
| --- | --- | --- |
| `POST /api/generate` | `app/api/generate/route.ts` | Parse request, validate schema, call generation use case, return structured response |
| `POST /api/feedback` | `app/api/feedback/route.ts` | Parse feedback, validate schema, log lightweight feedback |
| `POST /api/track` | `app/api/track/route.ts` | Parse analytics event, validate schema, log lightweight tracking |

Route handlers use Web standard `Request` / `Response`. They do not call this app's BFF through axios.

## 3. Module Boundaries

```text
Browser UI
  -> utils/expression-api.ts
  -> utils/api-client.ts
  -> app/api/**/route.ts
  -> lib/use-cases/**
  -> lib/context/**
  -> lib/safety/**
  -> lib/llm/**
  -> OpenAI-compatible model provider or fallback
```

Directory responsibilities:

- `lib/domain/**` - enums, defaults, response contracts, errors.
- `lib/validators/**` - zod schemas for external input.
- `lib/use-cases/**` - business orchestration.
- `lib/context/**` - request context and language inference.
- `lib/llm/**` - prompt binding, model factory, pipeline, schema normalization.
- `lib/safety/**` - pre-check and post-check policy.
- `lib/analytics/**` - lightweight event/log helpers.
- `config/prompts/**` - model-facing prompt copy.
- `config/copy/**` - user-facing copy, fallback copy, API message copy.

## 4. Generate Contract

`POST /api/generate` accepts the fixed product contract:

- `text`
- `scene`
- `target`
- `style`
- `sliders`
- `outputModes`
- `operation`
- `context.sessionId`
- optional `context.prev`

Successful results contain:

- `wechat`
- `email`
- `spoken`
- `assumptions`
- `safetyNotes`
- `meta.source`: `model | fallback`
- `meta.language`: resolved output language

Refusal and error responses must be structured and must not expose raw model or stack details to the browser.

## 5. Model and Fallback

Model configuration is server-only:

```text
AI_API_KEY
AI_BASE_URL
AI_MODEL
```

When model configuration is missing, the model times out, or the model returns bad output, the BFF returns deterministic local fallback results. Fallback is a valid MVP behavior, but engineering docs and state must preserve `meta.source: "fallback"` so future agents do not confuse fallback with live model output.

## 6. LangChain Usage Boundary

Allowed:

- `ChatPromptTemplate`
- server-side model invocation through OpenAI-compatible configuration
- structured JSON output parsing
- context and language injection
- future extension seams that do not change the product contract

Not allowed without an approved spec:

- generic Agent loop
- multi-tool autonomous reasoning
- vector retrieval/RAG
- separate workflow engine
- provider-specific logic in route handlers
- prompt text embedded directly in UI components

## 7. Safety Boundary

The generation path must reduce communication risk:

- Reject or downgrade threats, harassment, privacy invasion, illegal requests, and severe personal attacks.
- Treat `sarcasm` as high-risk: lightly pointed wording is allowed, insulting or escalating content is not.
- Validate model output structure before returning it to the frontend.
- Do not log full raw user text when lightweight logs are enough.

## 8. Storage Boundary

The current MVP has no committed database schema.

Allowed current write paths:

- local browser storage for recent history, favorites, preferences, and statistics
- lightweight server logs for feedback and tracking
- in-memory/request-local orchestration

Do not introduce a database, auth, or cloud sync solely to support static demo behavior.

## 9. Current References

- Product source: `docs/product-prd.md`
- Frontend structure: `docs/frontend-architecture.md`
- Routes: `docs/mobile-pages-routes.md`
- Request/config map: `docs/api-request-and-config-map.md`
- Copy/prompt configuration: `config/README.md`
