# Verification Guide

## Purpose

This guide maps change types to the smallest useful verification set. Use it before claiming completion.

Do not add new verification frameworks just to satisfy process. Use existing scripts first.

## Existing Commands

```bash
npm run test
npm run test:p0
npm run test:p1
npm run test:p2
npm run test:prd-v1.1
npm run test:tone
npm run lint
npm run build
```

## Verification Matrix

| Change type | Required checks |
| --- | --- |
| Documentation-only, no links deleted | Static read/review; mention no runtime checks needed |
| Documentation deletion/rename | Static reference search for deleted names; inspect updated entrypoints |
| `package.json` scripts | `npm run test`; `npm run lint`; consider `npm run build` |
| Config exports or TypeScript imports | `npm run lint`; `npm run build` |
| UI route/page/component behavior | Relevant regression tests; `npm run lint`; browser/manual check at `375 x 750` when available |
| BFF/API/validator/use-case behavior | Relevant API/regression checks; `npm run lint`; `npm run build` |
| Prompt/copy/fallback changes | Relevant regression tests; manual copy review; `npm run lint` |
| Active SDD spec implementation | Feature checklist plus the checks listed in `tasks.md` |

## Static Reference Checks

After deleting or renaming docs, run a targeted search for old names.

Example:

```bash
rg "old-file-name|old-heading|old-export"
```

Expected result: no formal references to deleted files. Historical audit docs may mention prior names only when clearly describing past state.

## Browser Checks

Default viewport:

```text
375 x 750
```

Check affected pages for:

- no clipped primary text
- no overlapping controls
- correct loading/error/refused/success state
- route navigation works
- user-visible success has a write path

If browser tooling is unavailable, state that clearly and run static/regression checks instead. Mark the related spec `done-with-verification-gap` when appropriate.

## Completion Report

Every completion summary should include:

- Files created, modified, deleted.
- Commands run and results.
- Skipped checks with reasons.
- Remaining verification gaps.
