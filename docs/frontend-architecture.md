# Frontend Architecture

## 1. Scope

This document is the current frontend structure and component guide for `话到嘴边`. It replaces old root-level componentization notes.

The app is a mobile-first H5 MVP optimized for `375 x 750`.

## 2. Stack

- Next.js App Router
- React 19
- TypeScript
- CSS Modules
- `antd-mobile`
- Zustand

## 3. Routes

| Route | File | Responsibility |
| --- | --- | --- |
| `/` | `app/page.tsx` | Product entry, recent history, hot styles, start CTA |
| `/input` | `app/input/page.tsx` | Scene, target, style, raw thought input |
| `/tone` | `app/tone/page.tsx` | Tone sliders and preview |
| `/results` | `app/results/page.tsx` | Result rendering and result actions |
| `/history` | `app/history/page.tsx` | Local recent history and favorites |
| `/profile` | `app/profile/page.tsx` | Local profile/preferences/statistics surface |

Route pages are composition roots. Keep reusable UI in `components/**` and shared flow state in `stores/**`.

## 4. Shared Components

| Component | Responsibility |
| --- | --- |
| `MobileShell` | Mobile viewport shell |
| `TopBar` | Page header and navigation actions |
| `PrimaryButton` | Primary CTA based on `antd-mobile` Button |
| `BottomNav` | Bottom tab navigation for home/history/tone/profile |
| `SceneCard` | Scene entry card |
| `StyleCard` | Style selection card |
| `ToneSlider` | Tone slider control |
| `ResultCard` | Result output and actions |
| `DecorativeIcon` | Shared decorative icon rendering |

Prefer these primitives before creating new components.

## 5. State and Data Flow

Main state lives in `stores/expression-flow-store.ts`:

- `scene`
- `target`
- `style`
- `text`
- `sliders`
- `generation.status`
- `generation.result`
- `sessionId`

Frontend BFF calls are centralized:

- `utils/api-client.ts`
- `utils/expression-api.ts`

Pages must not add direct browser `fetch` or standalone `axios` calls for BFF requests.

## 6. Copy and Content

User-facing text, fallback copy, component labels, page labels, and API messages belong in `config/copy/**`.

Prompt-facing copy belongs in `config/prompts/**`.

Do not place configurable product copy directly in route pages, reusable components, `utils/**`, or `lib/**` unless it is a structural protocol field or enum.

## 7. Styling Rules

- Global design tokens and shared visual classes live in `app/globals.css`.
- Page-specific styles live in `app/**/page.module.css`.
- Component-specific styles live beside the component as `Component.module.css`.
- Reuse existing tokens before introducing new values.
- Follow `docs/design-token-governance.md` before promoting local values to global tokens.
- Use `antd-mobile` where the app already uses it; do not introduce a second UI system.

## 8. Route Verification

For UI changes, inspect affected routes at `375 x 750` when possible:

- Main flow: `/`, `/input`, `/tone`, `/results`
- Supporting routes: `/history`, `/profile`

If browser tooling is unavailable, record that limitation and run the relevant static/regression checks from `docs/verification-guide.md`.
