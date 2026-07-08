# Project Overview

`zuiti` / `话到嘴边` is a fast-moving hackathon MVP for a mobile H5 expression-conversion tool.

Users enter an awkward, direct, or hard-to-say thought, choose a communication scene, target, and style, tune the tone, and receive usable rewritten versions for real situations.

Core value: reduce the cost and risk of expression. This is not a generic chatbot or writing platform; it is a focused scene-based communication helper.

# Required Reading

Read in this order before non-trivial work:

1. `AGENTS.md` - binding agent rules and source-of-truth order.
2. `docs/specs/README.md` - current spec status index.
3. Active `docs/specs/<feature-name>/spec.md`, `design.md`, `tasks.md`, and `checklist.md` when a feature spec is active.
4. `docs/product-prd.md` - only current product PRD.
5. `docs/backend-architecture.md` - only current backend/BFF architecture baseline.
6. `docs/frontend-architecture.md` - only current frontend route/component/style guide.
7. `docs/mobile-pages-routes.md` - current routes and mobile viewport target.
8. `config/README.md` before changing user-facing copy, fallback copy, API copy, or prompt copy.
9. `docs/verification-guide.md` before reporting completion.

For Next.js behavior changes, read the relevant local Next.js 16.2.7 docs under `node_modules/next/dist/docs/` before editing.

# Source of Truth

When information conflicts, use this priority order:

1. Latest user instruction in the current conversation.
2. Active specs marked `active` in `docs/specs/README.md`.
3. `AGENTS.md`, `docs/sddspec.md`, and `docs/verification-guide.md`.
4. Current product/architecture docs: `docs/product-prd.md`, `docs/backend-architecture.md`, `docs/frontend-architecture.md`, `docs/mobile-pages-routes.md`, and `config/README.md`.
5. Existing source code and tests.
6. Historical or local context, only as non-binding reference.

Historical/local context includes `.trae/specs/**`, `.specify/**`, `docs/superpowers/plans/**`, ignored artifacts, screenshots, temporary notes, and old audit outputs. These files must not be used as acceptance criteria or implementation authority unless a current spec explicitly promotes them.

`.agents/skills/project-collaboration-operating-system/SKILL.md` is a project-local methodology skill for auditing and improving AI collaboration. It helps classify collaboration failures, but it does not override this file, active specs, or current product/architecture docs.

If docs and code disagree, do not silently rewrite architecture. Identify the mismatch, update or create the relevant SDD artifact, then implement only the approved scope.

# Current Product Scope

The project is a single Next.js App Router app with TypeScript, React 19, CSS Modules, `antd-mobile`, Zustand, zod, axios, and LangChain/OpenAI-compatible server-side model access.

Current routes:

- `/` - home page, product positioning, recent history, hot styles, and entry CTA.
- `/input` - scene, target, style, and raw thought input.
- `/tone` - tone sliders and generated/fallback preview.
- `/results` - generated/fallback results, copy, feedback, share, favorite, edit, and regenerate actions.
- `/history` - local recent history and favorites.
- `/profile` - local MVP profile/preferences/statistics surface.
- `/api/generate` - BFF generation endpoint.
- `/api/feedback` - BFF feedback endpoint.
- `/api/track` - BFF analytics endpoint.

Current data flow:

1. User starts from home or a hot style.
2. User selects scene and target.
3. User selects one of six expression styles.
4. User enters a real thought.
5. User adjusts tone sliders.
6. The BFF returns `wechat`, `email`, and `spoken` results with `meta.source` and `meta.language`.
7. Results and lightweight history/favorites remain local unless a future approved spec adds persistent storage.

# Stage Boundaries

Do not add these casually:

- Login, accounts, cross-device sync, long-term memory, vector search, reports, admin systems, or full database storage.
- An independent backend service, Python service, NestJS service, or new deployment surface.
- Complex LangChain Agent loops, multi-tool autonomous workflows, or RAG.
- New UI frameworks, state managers, CSS systems, test frameworks, or CI services.
- Generic chatbot or generic writing-platform behavior.

Current persistence is local or lightweight:

- Flow state: Zustand.
- Recent history/favorites/preferences/statistics: local browser storage utilities.
- Feedback/track: BFF route + lightweight logging.
- Model calls: server-side only.

# SDD Workflow

For every non-trivial feature, refactor, migration, architecture change, documentation-system change, or user-facing workflow change, follow:

`Specify -> Clarify -> Plan -> Tasks -> Checklist / Analyze -> Implement -> Verify`

New Codex SDD artifacts live under `docs/specs/<feature-name>/` and must include:

- `spec.md`
- `design.md`
- `tasks.md`
- `checklist.md`

Before implementation:

- Verify all four files exist.
- Verify `tasks.md` maps to acceptance criteria.
- Verify the spec status in `docs/specs/README.md`.
- Implement only tasks listed in `tasks.md`.

Spec statuses:

- `active` - current implementation authority.
- `done` - implemented and verified.
- `done-with-verification-gap` - implemented, but a declared verification gap remains.
- `stale` - no longer reliable as current context.
- `superseded` - replaced by another spec or document.

Use project-local Spec Kit skills in `.agents/skills` when the user asks for SDD, Spec Mode, Trae Spec Mode, `/spec`, `/plan`, `/tasks`, `/implement`, or implementation after a spec.

# Coding Guidelines

- Use TypeScript with strict types. Avoid `any` unless the active task justifies it.
- Use the `@/*` path alias for project imports.
- Keep route pages in `app/**/page.tsx`.
- Add API routes as `app/api/<name>/route.ts`.
- Use `"use client"` only for components or pages that need hooks, browser APIs, or `antd-mobile` client behavior.
- Keep reusable UI in `components/**`.
- Pair component files with CSS Modules.
- Use `antd-mobile` components where the app already does.
- Keep mobile layout centered and optimized for the documented `375 x 750` viewport.
- Use existing CSS tokens in `app/globals.css` before adding new colors, shadows, radii, or motion values.
- For backend additions, validate external input and model output with schema validation before trusting it.
- Keep model calls server-side. Never expose API keys or model credentials to frontend code.
- Keep product enums aligned with the documented contract: scenes `student`, `work`, `social`, `formal`; styles `delay`, `refuse`, `boundary`, `followup`, `decode`, `sarcasm`; sliders `politeness`, `formality`, `distance`; outputs `wechat`, `email`, `spoken`.

# Behavior Contracts

User-visible success must have a traceable result:

- Save/favorite/history actions must write to state, local storage, API, event log, or be explicitly labeled as staged placeholder.
- Feedback and track actions must call the BFF wrapper or be explicitly marked unavailable.
- Fallback generation must be represented in response/state metadata, not silently treated as model output in engineering docs.
- Do not add success copy for actions that do not write anywhere.

# Verification

Use `docs/verification-guide.md` to choose checks.

Minimum defaults:

- Documentation-only changes: run static reference checks and `npm run lint` when imports/scripts are touched.
- Copy/prompt/config changes: run relevant regression tests plus lint.
- UI changes: include browser or screenshot inspection at `375 x 750` when possible.
- API/BFF changes: run route/request checks, regression tests, lint, and build when contracts or TypeScript exports change.
- Spec-active work: run the feature checklist and update `tasks.md` / `checklist.md` only when evidence exists.

Before finishing, summarize:

- What changed.
- Files modified/deleted/created.
- Verification run and result.
- Known limitations or skipped checks.
