# Codex SDD Constitution

This repository uses Spec Driven Development (SDD) to keep AI-assisted work scoped, reviewable, and verifiable.

## 1. Core Rule

Do not start implementation immediately after a feature, refactor, migration, architecture, documentation-system, or user-facing workflow request.

Required workflow:

```text
Specify -> Clarify -> Plan -> Tasks -> Checklist / Analyze -> Implement -> Verify
```

Code is the final artifact, not the first artifact.

## 2. Canonical Directories

New Codex SDD artifacts live under:

```text
docs/specs/<feature-name>/
```

Each feature directory must contain:

- `spec.md`
- `design.md`
- `tasks.md`
- `checklist.md`

Do not create new specs under `.trae/specs/`. That directory is historical/local reference only and is not a current acceptance source.

## 3. Spec Status

Every spec must be represented in `docs/specs/README.md` with one status:

- `active` - current implementation authority.
- `done` - implemented and verified.
- `done-with-verification-gap` - implemented, but a documented verification gap remains.
- `stale` - no longer reliable as current context.
- `superseded` - replaced by another spec or document.

Agents must not treat `stale` or `superseded` specs as implementation authority.

## 4. Required Sections

`spec.md` must include:

- Problem
- Goal
- Non Goals
- User Stories
- Acceptance Criteria
- Edge Cases

`design.md` must include:

- Architecture
- Data Flow
- Data Model
- API Design
- UI / UX Design, when applicable
- Security Considerations
- Performance Considerations
- Risks
- Alternatives Considered

`tasks.md` must include:

- P0: Critical setup and blockers
- P1: Backend or data tasks
- P2: Frontend or UI tasks
- P3: Testing and verification tasks
- P4: Documentation and cleanup tasks

`checklist.md` must include:

- Acceptance criteria satisfied
- Unit tests added or explicitly not applicable
- Integration tests added or explicitly not applicable
- E2E/manual browser checks completed or explicitly recorded as a verification gap
- `npm run lint` passes, unless explicitly not required by `docs/verification-guide.md`
- `npm run build` passes, unless explicitly not required by `docs/verification-guide.md`
- Security review completed
- Documentation updated
- Breaking changes documented or explicitly absent

## 5. Review Gate

Before implementation:

1. Verify `spec.md` exists.
2. Verify `design.md` exists.
3. Verify `tasks.md` exists.
4. Verify `checklist.md` exists.
5. Verify `docs/specs/README.md` marks the spec `active`.
6. Verify `tasks.md` maps back to acceptance criteria.
7. Verify implementation will not touch work outside documented scope.

If any artifact is missing, stale, inconsistent, or misleading, stop and repair the SDD artifact before implementation.

## 6. Implementation Rules

- Implement only tasks defined in `tasks.md`.
- Mark completed tasks only when the corresponding work and evidence exist.
- Update `checklist.md` only when an item is proven.
- If code reality already satisfies a task, mark it as completed with a short evidence note.
- If verification is unavailable, do not pretend it passed; record `done-with-verification-gap`.

## 7. Verification Rules

Use `docs/verification-guide.md` to select checks.

For active spec work, the feature checklist is binding. If the checklist asks for lint/build/browser/API checks, either run them or document why they could not run.

For UI work, default visual verification includes `375 x 750`.

## 8. Refactoring Rules

For refactors, the spec must also document:

- Current Architecture
- Proposed Architecture
- Migration Strategy
- Rollback Strategy
- Risk Analysis

Do not modify production code until those sections are present.

## 9. Documentation Lifecycle

Delete or replace misleading docs rather than keeping them as unmarked historical material.

Allowed document states:

- Current authority: referenced by `AGENTS.md`, `README.md`, or `docs/specs/README.md`.
- Reference: clearly marked as non-binding.
- Local/tool scaffold: clearly marked as not project authority.
- Deleted: use this for duplicate, stale, or misleading documents.

When deleting a document, update all references in the same change.
