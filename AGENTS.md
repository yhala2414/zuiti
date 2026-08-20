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

Read `docs/product-evolution.md` for product planning, requirements, cross-module work, architecture decisions, or stage transitions. Ordinary localized fixes do not require it.

Read `docs/collaboration-guide.md` for cross-module planning, documentation or authority changes, stage interpretation, collaboration-system improvement, or a Failure Review. It explains the workflow but does not override this file.

Read `docs/webapp-testing-guide.md` when the user explicitly requests Playwright or repeatable browser automation, when `docs/verification-guide.md` requires repeatable browser evidence, or when such automation would materially improve diagnosis and the user accepts the optional local workflow. It governs use of the local `webapp-testing` skill; it does not introduce a repository test framework.

For Next.js behavior changes, read the relevant local Next.js 16.2.7 documentation under `node_modules/next/dist/docs/` before editing.

Ordinary work does not require a spec, design, tasks, or checklist document. Create or update formal documentation only when a durable product contract, architecture boundary, verification rule, configuration responsibility, or collaboration rule changes.

For non-trivial collaboration work, use this operating chain:

```text
select mode -> context -> authority -> scope -> diagnosis -> change decision -> verification -> correction
```

Do not skip diagnosis by creating a document or plan first. Detailed decision rules live in `docs/collaboration-guide.md`.

## Authority

When information conflicts, use this order:

```text
latest user instruction
> AGENTS.md
> each formal document within its owned domain
> current code and tests
> .local-docs temporary clues
```

Domain ownership and conflict routing are defined in `docs/collaboration-guide.md`. A document outside its domain cannot override the domain owner merely because it appears in this hierarchy.

`.local-docs/`, screenshots, drafts, generated plans, old audits, and historical reports are local context only. They cannot become requirements unless the user confirms them and the relevant formal document is deliberately updated.

`docs/product-evolution.md` records confirmed sequencing and stage gates for related planning work. It does not override the current product, architecture, or verification contracts; update those authority surfaces deliberately when a later stage is approved for implementation.

`docs/collaboration-guide.md` explains context discovery, domain ownership, diagnosis, document mutation, and correction. It cannot grant scope or implementation permission.

The project-local collaboration skill at `.agents/skills/project-collaboration-operating-system/` helps audit or improve collaboration. It does not override this file or current product and architecture documents.

If code and formal docs disagree, identify which one reflects the confirmed current behavior. Correct the smallest authoritative surface; do not create a new document bundle merely to record the mismatch.

## Active Stage

Current stage: **Phase 0 - core stability and evidence baseline**.

During this stage:

- implementation may address confirmed core-flow bugs, test coverage, AI quality baselines, dependency security, and immediate privacy risks;
- product discovery and future architecture planning are allowed when explicitly requested;
- do not migrate to a Monorepo, create an independent backend, add a database, or perform a broad UI rewrite;
- future-stage content in `docs/product-evolution.md` is planning context, not implementation authorization.

A confirmed long-term direction does not authorize implementation. Starting a later phase requires explicit user approval and corresponding updates to the current product, architecture, and collaboration documents.

## Current Scope

The current product contract is owned by `docs/product-prd.md`; implemented routes, persistence, data flow, and technology boundaries are owned by `docs/architecture.md`. This file owns permission to change them, not their detailed description.

The following capabilities may be confirmed future directions but remain outside the active implementation stage. Do not implement them until the user explicitly approves entry into the corresponding stage:

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

Keep the fixed product enums aligned with the product contract in `docs/product-prd.md`.

## Behavior Contracts

Enforce the user-visible result contract owned by `docs/product-prd.md`. In the current architecture, its traceable paths include:

- save, favorite, and history actions write to state or local storage;
- feedback and tracking call their BFF wrappers;
- fallback generation remains distinguishable through `meta.source`;
- unavailable work is explicitly labeled as staged or unavailable.

Do not add success copy for an action that writes nowhere. Implementation paths are owned by `docs/architecture.md`; copy and prompt placement is owned by `config/README.md`. Validate external input and model output before trusting it. Never expose model credentials to frontend code or return raw provider/stack details to the browser.

## Local Collaboration Layer

`.local-docs/` is ignored workspace-local storage for task drafts, AI summaries, temporary plans, exploratory audits, reference images, and unconfirmed ideas. Python Playwright scripts and all `webapp-testing` outputs belong under ignored `.venv/` as defined by `docs/webapp-testing-guide.md`.

- Because the directory is ignored, a fresh clone may not contain it. Initialize it when the user requests a local artifact, the current task needs non-authoritative working material, or a workspace review finds loose temporary documents that should be classified.
- New task-local artifacts may be written there without creating a tracked document. Do not create an empty `.local-docs/` for every task.
- When loose or suspicious documents already exist, inspect Git status, references, ownership, and authority before moving anything. Never silently relocate tracked, shared, or ambiguous files; report exact candidates and obtain approval unless cleanup was explicitly requested and classification is unambiguous.
- Classify and place material using `docs/collaboration-guide.md`. Do not add `.gitkeep` or otherwise make the local layer part of the repository.
- Read local files only when the user names them or they are clearly relevant task evidence.
- Treat them as possibly stale and subordinate to formal docs.
- Do not copy them into team docs verbatim.
- Promote only durable, confirmed facts to the smallest appropriate formal document.
- Before implementing from a reference image, confirm strict recreation, style reference, or specified-part reference.

## Failure Review

Run a Failure Review when work crosses the active stage, treats temporary material as authority, expands scope, presents fake success, claims completion without evidence, encounters conflicting formal rules, repeats a reasonable misinterpretation, or the user identifies collaboration drift.

```text
Miss:
Evidence:
Expected rule:
Failure type: agent execution / context discovery / documentation ambiguity / documentation drift / documentation gap / process failure
Root cause:
Immediate correction:
System change: none / context map / doc clarification / authority cleanup / local cleanup / decision note / workflow
Verification:
Prevention:
```

Correct the actual work first. If the rule was already clear, correct execution without adding documentation. If the failure is systemic, change the smallest complete authority surface that prevents recurrence and verify that a future Agent can discover it.

A diagnosis or retrospective does not automatically authorize formal-document edits. Edit them only when the user requests system correction, confirms a durable decision, an authorized implementation changes a documented fact, or a confirmed conflict must be synchronized. Otherwise report the evidence and proposed owner-level correction.

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
