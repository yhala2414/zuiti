# Backend BFF + Frontend State Tasks

## P0 - Critical

- [x] T001 Create `docs/specs/backend-bff-state/spec.md`, `design.md`, `tasks.md`, and `checklist.md`.
- [x] T002 Read Next.js Route Handler docs in `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` and `01-app/03-api-reference/03-file-conventions/route.md`.
- [x] T003 Install required dependencies: `zod`, `zustand`, `@langchain/core`, `@langchain/openai`.

## P1 - Backend / Data

- [x] T004 Create domain enums/defaults/errors in `lib/domain/**`.
- [x] T005 Create zod schemas for generate, feedback, track in `lib/validators/**`.
- [x] T006 Create model factory in `lib/llm/model.ts` using `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`.
- [x] T007 Create prompt/schema/pipeline/normalize modules in `lib/llm/**`.
- [x] T008 Create context builder in `lib/context/build-context.ts`.
- [x] T009 Create safety policy and post-check modules in `lib/safety/**`.
- [x] T010 Create analytics event/logger modules in `lib/analytics/**`.
- [x] T011 Create generate use case in `lib/use-cases/generate-expression.ts`.
- [x] T012 Create feedback and track use cases in `lib/use-cases/**`.
- [x] T013 Create `app/api/generate/route.ts`.
- [x] T014 Create `app/api/feedback/route.ts`.
- [x] T015 Create `app/api/track/route.ts`.
- [x] T016 Update `.env.example` with documented AI env vars.

## P2 - Frontend / UI

- [x] T017 Add Zustand flow store for scene, text, style, sliders, session, generation state.
- [x] T018 Add frontend API client utilities for generate, feedback, and track.
- [x] T019 Add mapping utils from existing content display data to backend enum values.
- [x] T020 Update `components/content.ts` to expose stable enum keys without breaking existing UI.
- [x] T021 Update home page scene actions to write selected scene before navigation.
- [x] T022 Update input page to read/write raw text and style from store.
- [x] T023 Update tone page to read/write sliders from store.
- [x] T024 Update results page to call generate API and render loading/success/fail/refused states.
- [x] T025 Wire result actions to copy/track/feedback where currently shown in UI.

## P3 - Testing / Verification

- [x] T026 Verify `/api/generate` with valid request.
- [x] T027 Verify `/api/generate` invalid request returns `INVALID_INPUT`.
- [x] T028 Verify safety refusal returns `SAFETY_REFUSED`.
- [x] T029 Verify `/api/feedback` and `/api/track` return stable success.
- [x] T030 Run `npm run lint`.
- [x] T031 Run `npm run build`.
- [ ] T032 Manually inspect `/`, `/input`, `/tone`, `/results` at `375 x 750`.

## P4 - Documentation / Cleanup

- [x] T033 Update related docs if public contracts differ from `docs/backend-architecture.md`.
- [x] T034 Mark completed tasks in this file during implementation.
- [x] T035 Update checklist items only after verification evidence exists.
- [x] T036 Summarize changed files, verification, limitations, and follow-up work.

## P5 - Copy Centralization / Demo Diagnostics

- [x] T037 Audit all user-visible text and prompt text currently scattered in `app/**`, `components/**`, `utils/**`, and `lib/**`; produce a migration list grouped into page copy, component copy, API/error copy, fallback copy, and prompt copy.
- [x] T038 Create root-level `config/` directory contract and add module files for `config/copy/**`, `config/prompts/**`, plus a stable export entry.
- [x] T039 Move page-level UI copy from `app/page.tsx`, `app/input/page.tsx`, `app/tone/page.tsx`, and `app/results/page.tsx` into `config/copy/**` with concise usage comments.
- [x] T040 Move reusable component copy, API failure copy, refusal copy, fallback status copy, and any other user-visible literals from `components/**`, `utils/**`, and backend response helpers into `config/copy/**`.
- [ ] T041 Move `lib/llm/prompts.ts` system/human prompt text and reusable prompt fragments into `config/prompts/**`; keep `lib/llm/**` responsible only for variable injection and pipeline wiring.
- [x] T042 Replace remaining inline product text imports in affected `tsx`/`ts` files so configurable text no longer lives in page/component/use-case files.
- [ ] T043 Add language detection or language inference helpers to the generate pipeline context so the request carries a stable primary-language decision for prompt assembly and fallback generation.
- [ ] T044 Update `/api/generate` contract, domain types, Zustand result state, and client-side consumption so each generation returns visible metadata for `source: model | fallback` and the resolved response language.
- [ ] T045 Ensure the results page renders only from Zustand draft + `/api/generate` response data, and that it shows distinct UI states for `success-model`, `success-fallback`, `fail`, `refused`, and `missing-draft`.
- [ ] T046 Verify the live chain under `npm run dev`: confirm request reaches `/api/generate`, confirm whether backend uses model or fallback, and capture why if the model path is not active.
- [ ] T047 Verify at least one Chinese input and one non-Chinese or mixed-language input both produce language-following results; if fallback is used, verify fallback text also follows the inferred input language.
- [ ] T048 Re-run `npm run lint` and `npm run build`, then manually inspect `/`, `/input`, `/tone`, `/results` at `375 x 750` with the new centralized copy and generation-status UI.

## Verification Notes

- T026-T029 verified against `next start` on local port 3213 using Node `fetch`; safety refusal was verified with Unicode-escaped Chinese input to avoid PowerShell source encoding loss.
- T032 remains open because no Browser tool is available in this session and Playwright is not installed locally.
- T037-T048 are the new scope added for copy centralization, language-following generation, and demo diagnostics; they require fresh verification even though the earlier BFF baseline tasks are complete.

## Dependencies

- P0 must complete before implementation.
- Backend contract tasks T004-T015 must complete before frontend API integration T018/T024.
- Store tasks T017-T020 must complete before page wiring T021-T025.
- Verification runs after implementation tasks.
- T037 must complete before T038-T042, otherwise migration scope is easy to婕忛」銆?- T038 should complete before bulk code migration T039-T042.
- T043 must complete before T044-T047.
- T044 must complete before T045.
- T046-T048 run after T039-T045.

