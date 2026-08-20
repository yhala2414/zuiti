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
| Repeatable browser behavior or browser-based diagnosis | Follow `docs/webapp-testing-guide.md` in addition to the checks required by the changed surface |
| BFF, validator, use-case, output, or API contract | Relevant tests/request checks, `npm run lint`, `npm run build` |
| Collaboration or authority changes | Verify entrypoint discovery, one primary owner per rule, local/formal separation, scenario routing, and absence of stale references |

## Static Checks

After deleting or renaming files, commands, routes, or exports, run a targeted `rg` search for the old names. Expected result: no formal references remain. Ignored temporary reports may describe historical names when clearly marked non-authoritative.

For documentation entrypoints, confirm every Markdown link from README and AGENTS resolves to an existing file.

For collaboration or authority changes, perform a static scenario review against `docs/collaboration-guide.md`:

1. Future architecture in Product Evolution does not authorize implementation outside the active stage in `AGENTS.md`.
2. A `.local-docs/` draft that conflicts with the PRD remains evidence, not a promoted requirement.
3. A clear rule missed by an Agent produces an execution correction, not a new document.
4. Conflicting formal statements route to one domain owner and stale copies are removed or reduced to links.
5. A diagnosis-only request does not mutate code or formal documents.
6. User-visible success without a traceable result is rejected or explicitly staged.
7. A completion claim without required evidence remains a candidate, not completed work.
8. A fresh clone without `.local-docs/` is guided to initialize it only when local material is needed.
9. Loose plans, reports, screenshots, or audits are classified before movement; tracked or ambiguous files are not silently relocated.
10. Local Playwright execution routes to `docs/webapp-testing-guide.md`; scripts and all browser outputs stay in ignored `.venv/`, while future formal Playwright journeys remain stage-gated.

Record the expected authority and next action for each scenario. Search repeated stage, scope, and behavior language with `rg`; intentional secondary mentions must state their owner or consequence rather than redefine the rule.

When `.local-docs/` handling changes, confirm `.gitignore` still excludes the directory, no `.gitkeep` or local artifact is tracked, and the collaboration guide explains initialization, classification, promotion, and safe cleanup.

## Browser Checks

Default viewport: `375 x 750`.

For affected flows, check:

- routes render without a page-level error;
- primary content is not clipped or overlapped;
- navigation and required controls work;
- loading, success, fallback, refused, error, and missing-draft states remain distinguishable where applicable;
- user-visible success produces a state, storage, API, event, or log result;
- browser console/network failures that affect visible behavior are reported.

For repeatable automation, use `docs/webapp-testing-guide.md`. Its Python Playwright scripts and all browser outputs stay under ignored `.venv/`; ordinary manual browser checks do not require that workflow.

## Completion Report

Before claiming completion, report:

- created, modified, deleted, and moved files;
- commands run and their current results;
- browser/manual evidence when required;
- skipped checks and reasons;
- remaining warnings, limitations, or verification gaps.
