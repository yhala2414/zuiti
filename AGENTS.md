# Project Overview

`zuiti` / `话到嘴边` is a fast-moving hackathon MVP for a mobile H5 expression-conversion tool.

Users enter an awkward, direct, or hard-to-say thought, choose a communication scene and style, tune the tone, and receive usable rewritten versions for real situations.

Target users are mainly students, workplace newcomers, social newcomers, and people handling formal affairs who need safer, clearer wording in unequal or high-pressure communication.

Core value: reduce the cost and risk of expression. This is not a generic chatbot or writing platform; it is a focused scene-based communication helper.

# Required Reading

## Product

- `README.md` - demo scope, product positioning, high-level data flow, commands.
- `docs/product-prd.md` - current reverse PRD and best product context.
- `docs/mobile-pages-routes.md` - current mobile route map and 375 x 750 target viewport.

## Architecture

- `docs/backend-architecture.md` - approved backend direction: Next.js BFF, `app/api/**/route.ts`, `lib/**`, LangChain.js + OpenAI-compatible APIs.
- `嘴替Demo-后端架构-LangChainjs-OpenAI兼容.md` - historical/reference backend architecture notes.
- `项目组件化开发指南.md` - componentization guidance.
- `React+Next.js+CSSModules+AntD-样式对齐设计稿快速入门.md` - frontend styling reference.

## Specs

- `docs/sddspec.md` - SDD constitution and required workflow.
- `docs/specs/README.md` - where new Codex specs live and how to start them.
- `docs/specs/_template/` - templates for `spec.md`, `design.md`, `tasks.md`, and `checklist.md`.
- `.trae/specs/` - historical Trae specs only; read as reference, do not create new specs there unless explicitly asked.

## Development

- `package.json` - scripts and dependencies.
- `app/` - Next.js App Router pages and future API routes.
- `components/` - reusable UI components and static demo content.
- `app/globals.css` - global tokens, shared classes, antd-mobile variable overrides.
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` - project configuration.
- `node_modules/next/dist/docs/` - required before writing or changing Next.js behavior. This project uses Next.js `16.2.7`, which may differ from older Next.js knowledge.

# Source of Truth

When information conflicts, use this priority order:

1. Approved active specs in `docs/specs/<feature-name>/`.
2. `docs/sddspec.md` and this `AGENTS.md`.
3. Product docs, especially `docs/product-prd.md`.
4. Architecture docs, especially `docs/backend-architecture.md`.
5. Existing source code and component patterns.
6. Historical reference docs such as `.trae/specs/` and older backend notes.

If docs and code disagree, do not silently rewrite architecture. Identify the mismatch, update or create the relevant SDD artifact, then implement only the approved scope.

# Development Principles

- Spec before code for non-trivial features, refactors, migrations, architecture changes, or user-facing workflow changes.
- Ship the smallest working feature that satisfies the active spec.
- Preserve the current mobile-first H5 demo flow.
- Reuse existing route, component, CSS Module, and content patterns.
- Keep the backend as a Next.js BFF when adding server capability.
- Keep UI copy practical, direct, and product-specific.
- Prefer explicit product contracts over generic abstractions.
- Avoid framework churn and large refactors during MVP work.
- Keep components readable and local; extract only when duplication or complexity is real.
- Treat code as the final artifact after requirements, design, tasks, and checklist are clear.

# Architecture Guidelines

The project is a single Next.js App Router app with TypeScript, React 19, CSS Modules, and `antd-mobile`.

Current frontend routes:

- `app/page.tsx` - home page; product positioning and scene entry.
- `app/input/page.tsx` - raw thought input and style selection.
- `app/tone/page.tsx` - tone tuning with three sliders.
- `app/results/page.tsx` - three generated/static result formats.

Current shared modules:

- `components/MobileShell.tsx` - mobile page container.
- `components/TopBar.tsx` - page header/navigation actions.
- `components/PrimaryButton.tsx` - primary CTA using `antd-mobile` `Button`.
- `components/SceneCard.tsx`, `StyleCard.tsx`, `ToneSlider.tsx`, `ResultCard.tsx`, `BottomNav.tsx`, `DecorativeIcon.tsx` - reusable UI pieces.
- `components/content.ts` - current source for scene, style, and result demo data.
- `app/globals.css` - design tokens, shared classes like `soft-card` and `primary-button`.

Product data flow:

1. User selects a scene.
2. User enters a real thought.
3. User selects one of six expression styles.
4. User adjusts tone sliders.
5. Results show three output modes: WeChat short text, formal email, and spoken version.

Planned backend direction:

- API routes belong in `app/api/**/route.ts`.
- Non-UI business logic belongs in `lib/**`.
- Use `lib/domain/**` for enums/defaults, `lib/validators/**` for schema validation, `lib/use-cases/**` for orchestration, `lib/llm/**` for model prompting/parsing, `lib/safety/**` for safety checks, and `lib/analytics/**` for lightweight logs/events.
- Use LangChain.js only for prompt templating, structured output, context injection, and extension points. Do not introduce complex Agent architecture.
- Do not add an independent backend service, Python service, database layer, or authentication system unless an approved spec requires it.

Database usage:

- There is no committed database schema for the current MVP.
- Demo feedback, tracking, and history may start as logs or lightweight storage if specified.
- Do not introduce a database just to support static demo behavior.

# SDD Workflow

For every non-trivial feature, refactor, migration, architecture change, or user-facing workflow change, read `docs/sddspec.md` first and follow:

1. Specify.
2. Clarify.
3. Plan.
4. Tasks.
5. Checklist / Analyze.
6. Implement.
7. Verify.

New Codex SDD artifacts must live under `docs/specs/<feature-name>/` and include:

- `spec.md`
- `design.md`
- `tasks.md`
- `checklist.md`

Before implementation, verify all four files exist and that tasks map to acceptance criteria. If any file is missing or inconsistent, stop and generate or repair the SDD artifact first.

Use project-local Spec Kit skills in `.agents/skills` when the user asks for SDD, Spec Mode, Trae Spec Mode, `/spec`, `/plan`, `/tasks`, `/implement`, or implementation after a spec:

- `$speckit-constitution`
- `$speckit-specify`
- `$speckit-clarify`
- `$speckit-plan`
- `$speckit-tasks`
- `$speckit-checklist`
- `$speckit-analyze`
- `$speckit-implement`

During implementation:

- Implement only tasks listed in `tasks.md`.
- Mark completed tasks in `tasks.md`.
- Update `checklist.md` only when an item is proven.
- For Next.js changes, read the relevant guide in `node_modules/next/dist/docs/` before editing.

# Coding Guidelines

- Use TypeScript with strict types. Avoid `any` unless the active task justifies it.
- Use the `@/*` path alias for project imports, matching existing files.
- Keep route pages in `app/**/page.tsx`.
- Add API routes as `app/api/<name>/route.ts`.
- Use `"use client"` only for components or pages that need hooks, browser APIs, or `antd-mobile` client behavior.
- Keep reusable UI in `components/**`.
- Keep static scene/style/result data centralized in `components/content.ts` until a spec introduces a better domain module.
- Pair component files with CSS Modules, e.g. `Component.tsx` and `Component.module.css`.
- Import CSS Modules as `styles` or a clear alternate name when there is a naming conflict.
- Prefer existing primitives such as `MobileShell`, `TopBar`, `PrimaryButton`, `DecorativeIcon`, `SceneCard`, `StyleCard`, `ToneSlider`, and `ResultCard`.
- Use `antd-mobile` components where the app already does, such as `Button` and `TextArea`.
- Keep mobile layout centered and optimized for the documented `375 x 750` viewport.
- Use existing CSS tokens in `app/globals.css` before adding new colors, shadows, radii, or motion values.
- Preserve global shared classes such as `soft-card`, `primary-button`, `scene-card`, and `style-card` unless an approved design change says otherwise.
- For backend additions, validate external input and model output with schema validation before trusting it.
- Keep model calls server-side. Never expose API keys or model credentials to frontend code.
- Keep product enums aligned with the documented contract: scenes `student`, `work`, `social`, `formal`; styles `delay`, `refuse`, `boundary`, `followup`, `decode`, `sarcasm`; sliders `politeness`, `formality`, `distance`; outputs `wechat`, `email`, `spoken`.

# Things To Avoid

- Do not turn the app into a generic chatbot.
- Do not add login, accounts, cross-device sync, long-term memory, vector search, complex reports, or a full database without an approved spec.
- Do not split out a separate backend service for the MVP.
- Do not introduce new frameworks or state managers casually.
- Do not replace CSS Modules or `antd-mobile` patterns without a documented reason.
- Do not scatter scene, style, mode, prompt, or result constants across pages.
- Do not put model-calling or prompt-building logic inside UI components.
- Do not over-abstract one-off demo behavior.
- Do not create new specs under `.trae/specs/` unless explicitly asked.
- Do not perform broad refactors while implementing a narrow feature.
- Do not rely on older Next.js assumptions; Next.js `16.2.7` docs in `node_modules/next/dist/docs/` are mandatory for relevant changes.

# Task Completion

Before finishing a task:

- Confirm the active requirements and acceptance criteria are satisfied.
- Run the relevant checks from `checklist.md` when an SDD spec is active.
- Prefer fast delivery and direct answers. Do not run slow verification commands by default.
- For normal code changes, run `npm run lint` and `npm run build` only when the change is high risk, explicitly requested, required by an active spec/checklist, or necessary to diagnose a suspected breakage.
- If `npm run lint` or `npm run build` is skipped, mention that it was skipped and why.
- For UI changes, manually inspect the affected route, including the `375 x 750` mobile viewport when possible.
- Summarize what changed.
- List modified files.
- Mention known limitations, skipped checks, or follow-up work.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
