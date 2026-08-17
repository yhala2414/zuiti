# Project and Collaboration Rules

## Project

`zuiti` / `话到嘴边` is a mobile H5 expression-conversion MVP. Users provide a difficult thought, choose a communication scene, target, style, and tone, and receive usable WeChat, email, and spoken versions.

This is a focused scene-based communication helper, not a generic chatbot or writing platform.

## Read First

Before non-trivial work, read only the documents relevant to the task:

1. `AGENTS.md` - binding collaboration, scope, placement, and verification rules.
2. `docs/product-prd.md` - product scope and public product contract.
3. `docs/architecture.md` - routes, modules, data flow, API, styling, and configuration boundaries.
4. `docs/verification-guide.md` - checks required for the changed surface.
5. `config/README.md` - required before changing user copy, fallback copy, API messages, or prompts.

For Next.js behavior changes, read the relevant local Next.js 16.2.7 documentation under `node_modules/next/dist/docs/` before editing.

Ordinary work does not require a spec, design, tasks, or checklist document. Create or update formal documentation only when a durable product contract, architecture boundary, verification rule, configuration responsibility, or collaboration rule changes.

## Authority

When information conflicts, use this order:

```text
latest user instruction
> AGENTS.md
> docs/product-prd.md / docs/architecture.md / docs/verification-guide.md / config/README.md
> current code and tests
> .local-docs temporary clues
```

`.local-docs/`, screenshots, drafts, generated plans, old audits, and historical reports are local context only. They cannot become requirements unless the user confirms them and the relevant formal document is deliberately updated.

The project-local collaboration skill at `.agents/skills/project-collaboration-operating-system/` helps audit or improve collaboration. It does not override this file or current product and architecture documents.

If code and formal docs disagree, identify which one reflects the confirmed current behavior. Correct the smallest authoritative surface; do not create a new document bundle merely to record the mismatch.

## Current Scope

The product remains one Next.js App Router application using TypeScript, React 19, CSS Modules, `antd-mobile`, Zustand, zod, axios, and server-side LangChain/OpenAI-compatible access.

Current persistence is intentionally lightweight:

- flow and generation state: Zustand;
- history, favorites, preferences, and statistics: browser local storage;
- feedback and tracking: BFF routes with lightweight logging;
- model access: server-side only, with deterministic fallback.

Do not add these without explicit user approval:

- login, accounts, cross-device sync, or full database persistence;
- long-term memory, vector search, or RAG;
- independent backend services or new deployment surfaces;
- complex Agent loops or multi-tool autonomous workflows;
- new UI systems, state managers, CSS systems, test frameworks, or CI services;
- generic chatbot or generic writing-platform behavior.

## Code Placement

- Route pages: `app/**/page.tsx`.
- BFF routes: `app/api/<name>/route.ts`.
- Reusable UI: `components/**`, paired with CSS Modules.
- Shared flow state: `stores/**`.
- Browser request and local-storage helpers: `utils/**`.
- Domain, validation, use cases, model, safety, and analytics: `lib/**`.
- User-facing copy and fallback text: `config/copy/**`.
- Model-facing prompt text: `config/prompts/**`.

Use strict TypeScript and the `@/*` import alias. Avoid `any` unless the task explicitly justifies it. Use `"use client"` only where hooks, browser APIs, or client-only UI require it.

Keep mobile layout centered and usable at `375 x 750`. Reuse tokens in `app/globals.css` and existing components before adding shared values or abstractions. Use `antd-mobile` where the project already does; do not introduce another UI system.

Keep the fixed product enums aligned with `docs/product-prd.md`: scenes `student`, `work`, `social`, `formal`; styles `delay`, `refuse`, `boundary`, `followup`, `decode`, `sarcasm`; sliders `politeness`, `formality`, `distance`; outputs `wechat`, `email`, `spoken`.

## Behavior Contracts

User-visible success must have a traceable result:

- save, favorite, and history actions write to state or local storage;
- feedback and tracking call their BFF wrappers;
- fallback generation remains distinguishable through `meta.source`;
- unavailable work is explicitly labeled as staged or unavailable.

Do not add success copy for an action that writes nowhere. Validate external input and model output before trusting it. Never expose model credentials to frontend code or return raw provider/stack details to the browser.

## Local Collaboration Layer

`.local-docs/` is ignored workspace-local storage for task drafts, AI summaries, temporary plans, exploratory audits, browser reports, screenshots, reference images, and unconfirmed ideas.

- Read local files only when the user names them or they are clearly relevant task evidence.
- Treat them as possibly stale and subordinate to formal docs.
- Do not copy them into team docs verbatim.
- Promote only durable, confirmed facts to the smallest appropriate formal document.
- Before implementing from a reference image, confirm strict recreation, style reference, or specified-part reference.

## Failure Review

When work drifts from confirmed rules, stop and classify the miss before changing the documentation system:

```text
Miss:
Expected rule:
Failure type: agent execution / context discovery / documentation ambiguity / documentation drift / documentation gap / process failure
Immediate correction:
System change: none / context map / doc clarification / local cleanup / workflow
Prevention:
```

If the rule was already clear, correct execution without adding documentation. If the failure is systemic, change the smallest authority surface that prevents recurrence.

## Verification

Use `docs/verification-guide.md` to choose checks. Minimum expectations:

- documentation-only: static reading and reference/link checks;
- tests or package scripts: `npm test` and `npm run lint`; consider `npm run build`;
- copy/prompt/config: relevant regression tests, manual copy review, and lint;
- UI: relevant tests, lint, and a `375 x 750` browser check when available;
- API, validators, use cases, exports, or contracts: relevant tests, lint, and build.

Before reporting completion, state:

- files created, modified, deleted, or moved;
- commands run and results;
- skipped checks and reasons;
- remaining limitations or verification gaps.
