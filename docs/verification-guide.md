# Verification Guide

## Purpose

Use the smallest checks that prove the changed surface works. Verification follows behavior and interfaces, not document volume. Do not add a framework merely to satisfy process.

## Commands

```bash
npm test
npm run test:flow
npm run test:interaction
npm run test:history
npm run test:contract
npm run test:tone
npm run lint
npm run build
npm audit --omit=dev
```

## Verification Matrix

| Change type | Required checks |
| --- | --- |
| Documentation only | Static review and link/reference checks |
| Documentation deletion or rename | Search for deleted names and inspect updated entrypoints |
| Tests or package scripts | `npm test`, `npm run lint`, and usually `npm run build` |
| Dependency or lockfile changes | Relevant tests, `npm run lint`, `npm run build`, and `npm audit --omit=dev` |
| Config exports or TypeScript imports | Relevant tests, `npm run lint`, `npm run build` |
| Copy, prompt, or fallback content | Relevant regression tests, manual copy review, `npm run lint` |
| UI route, page, component, or style behavior | Relevant tests, `npm run lint`, browser/manual check at `375 x 750` when available |
| BFF, validator, use-case, output, or API contract | Relevant tests/request checks, `npm run lint`, `npm run build` |
| Collaboration or authority changes | Verify read order, authority precedence, local/formal separation, and absence of stale references |

## Static Checks

After deleting or renaming files, commands, routes, or exports, run a targeted `rg` search for the old names. Expected result: no formal references remain. Ignored temporary reports may describe historical names when clearly marked non-authoritative.

For documentation entrypoints, confirm every Markdown link from README and AGENTS resolves to an existing file.

## Browser Checks

Default viewport: `375 x 750`.

For affected flows, check:

- routes render without a page-level error;
- primary content is not clipped or overlapped;
- navigation and required controls work;
- loading, success, fallback, refused, error, and missing-draft states remain distinguishable where applicable;
- user-visible success produces a state, storage, API, event, or log result;
- browser console/network failures that affect visible behavior are reported.

One-off browser scripts, screenshots, traces, and logs stay outside the tracked team documentation layer, normally under ignored `.local-docs/` or a temporary tool directory.

## Completion Report

Before claiming completion, report:

- created, modified, deleted, and moved files;
- commands run and their current results;
- browser/manual evidence when required;
- skipped checks and reasons;
- remaining warnings, limitations, or verification gaps.
