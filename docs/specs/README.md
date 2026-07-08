# Codex SDD Specs

New Codex SDD artifacts live under:

```text
docs/specs/<feature-name>/
```

Use `_template/` when starting a new feature.

## Source of Truth

This file is the spec status index. A spec is implementation authority only when it is marked `active`.

| Spec | Status | Purpose | Notes |
| --- | --- | --- | --- |
| `backend-bff-state` | `done-with-verification-gap` | BFF generation, flow state, copy/prompt centralization, fallback diagnostics | Core behavior exists; browser/live-chain verification remains documented as a gap |
| `p1-interaction-polish` | `done-with-verification-gap` | Scene defaults, style deep links, disabled CTA, favorite/share polish | Static/regression checks exist; full browser visual inspection remains a gap |
| `p2-demo-polish` | `done-with-verification-gap` | Recent history, bottom nav routing, loading polish | Static/regression checks exist; full browser visual inspection remains a gap |
| `axios-api-client` | `done-with-verification-gap` | Central axios client for browser-to-BFF calls | No BFF contract change; manual mobile flow check remains a gap |

`_template/` is a template directory, not a feature spec.

## Status Definitions

- `active` - current implementation authority.
- `done` - implemented and verified.
- `done-with-verification-gap` - implemented, but a documented verification gap remains.
- `stale` - no longer reliable as current context.
- `superseded` - replaced by another spec or document.

Agents must not implement from `stale`, `superseded`, ignored, or historical specs.

## Entry Prompts

For new SDD work:

```text
Enter SDD Mode.
Do not write code.
Create or update docs/specs/<feature-name>/spec.md, design.md, tasks.md, and checklist.md.
Follow AGENTS.md and docs/sddspec.md.
```

For implementation:

```text
Use $speckit-implement for docs/specs/<feature-name>.
Implement only tasks defined in tasks.md.
Verify with the feature checklist and docs/verification-guide.md.
```

## Historical Material

`.trae/specs/**` is historical/local reference only. It is not a current spec directory and must not be used as acceptance criteria.
