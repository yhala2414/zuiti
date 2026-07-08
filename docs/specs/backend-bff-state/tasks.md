# Backend BFF + Frontend State Tasks

## Status

`done-with-verification-gap`

The core BFF, flow state, copy/prompt centralization, language/source metadata, and fallback diagnostics are implemented in the current codebase. Remaining gaps are verification gaps, not known product-code tasks.

## P0 - Critical

- [x] T001 Create `docs/specs/backend-bff-state/spec.md`, `design.md`, `tasks.md`, and `checklist.md`.
- [x] T002 Read Next.js Route Handler docs before implementing route handlers.
- [x] T003 Install required dependencies: `zod`, `zustand`, `@langchain/core`, `@langchain/openai`.

## P1 - Backend / Data

- [x] T004 Create domain enums/defaults/errors in `lib/domain/**`.
- [x] T005 Create zod schemas for generate, feedback, track in `lib/validators/**`.
- [x] T006 Create model factory in `lib/llm/model.ts` using `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`.
- [x] T007 Create prompt/schema/pipeline/normalize modules in `lib/llm/**`.
- [x] T008 Create context builder and language inference in `lib/context/**`.
- [x] T009 Create safety policy and post-check modules in `lib/safety/**`.
- [x] T010 Create analytics event/logger modules in `lib/analytics/**`.
- [x] T011 Create generate use case in `lib/use-cases/generate-expression.ts`.
- [x] T012 Create feedback and track use cases in `lib/use-cases/**`.
- [x] T013 Create `app/api/generate/route.ts`.
- [x] T014 Create `app/api/feedback/route.ts`.
- [x] T015 Create `app/api/track/route.ts`.
- [x] T016 Update `.env.example` with documented AI env vars.

## P2 - Frontend / UI

- [x] T017 Add Zustand flow store for scene, target, text, style, sliders, session, and generation state.
- [x] T018 Add frontend API client utilities for generate, feedback, and track.
- [x] T019 Add mapping utils from content display data to backend enum values.
- [x] T020 Update content/config modules to expose stable enum keys without breaking existing UI.
- [x] T021 Update home page entry actions.
- [x] T022 Update input page to read/write scene, target, raw text, and style from store.
- [x] T023 Update tone page to read/write sliders and preview generated/fallback results.
- [x] T024 Update results page to call generate API and render loading/success/fail/refused/missing-draft states.
- [x] T025 Wire result actions to copy/track/feedback/favorite/share where currently shown in UI.

## P3 - Testing / Verification

- [x] T026 Verify `/api/generate` valid request path in prior implementation.
- [x] T027 Verify `/api/generate` invalid request returns `INVALID_INPUT` in prior implementation.
- [x] T028 Verify safety refusal returns `SAFETY_REFUSED` in prior implementation.
- [x] T029 Verify `/api/feedback` and `/api/track` return stable success in prior implementation.
- [x] T030 Add regression coverage for current P0/P1/P2/PRD/tone-preview behavior.
- [x] T031 Re-run `npm run test`.
- [x] T032 Re-run `npm run lint`.
- [x] T033 Re-run `npm run build` after script/export changes.
- [ ] T034 Manually inspect `/`, `/input`, `/tone`, `/results`, `/history`, `/profile` at `375 x 750`.

## P4 - Documentation / Cleanup

- [x] T035 Update related docs to make `docs/product-prd.md`, `docs/backend-architecture.md`, `docs/frontend-architecture.md`, `docs/mobile-pages-routes.md`, and `docs/verification-guide.md` the current authority set.
- [x] T036 Remove misleading duplicate root docs and runtime migration-audit export.
- [x] T037 Mark this spec as `done-with-verification-gap` in `docs/specs/README.md`.

## Verification Notes

- Browser/manual inspection remains open because it requires a running browser/tooling pass.
- T031-T033 were completed by the documentation-governance implementation pass.
- No product feature code is expected for this spec now; remaining unchecked items are verification only.
