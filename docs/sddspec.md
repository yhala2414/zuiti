# Codex SDD Constitution

This repository uses Spec Driven Development (SDD) to make Codex behave closer to Trae Spec Mode. The agent must treat this file as the project constitution for non-trivial work.

## 1. Core Rule

Do not start implementation immediately after a feature, refactor, migration, architecture, or user-facing workflow request.

The required workflow is:

`Specify -> Clarify -> Plan -> Tasks -> Checklist / Analyze -> Implement -> Verify`

Code is the final artifact, not the first artifact.

## 2. Canonical Directories

New Codex SDD artifacts must live under:

`docs/specs/<feature-name>/`

Each feature directory must contain:

- `spec.md`
- `design.md`
- `tasks.md`
- `checklist.md`

The old `.trae/specs/` directory is historical reference material for Trae Spec Mode. Read it when useful for style or migration context, but do not create new Codex SDD artifacts there unless the user explicitly asks for Trae compatibility.

If a Spec Kit command, tool, or template creates output under a default `specs/` directory, move or mirror the result into `docs/specs/<feature-name>/` and update internal references.

## 3. Codex Skills

Project-local Spec Kit style skills are installed under `.agents/skills`:

- `$speckit-constitution`: initialize or update this SDD constitution.
- `$speckit-specify`: create or update `spec.md`.
- `$speckit-clarify`: resolve open product and technical questions before design.
- `$speckit-plan`: create or update `design.md`.
- `$speckit-tasks`: create or update `tasks.md`.
- `$speckit-checklist`: create or update `checklist.md`.
- `$speckit-analyze`: validate consistency across all SDD artifacts.
- `$speckit-implement`: implement only tasks defined in `tasks.md`.

When a user says SDD, Spec Mode, Trae Spec Mode, `/spec`, `/plan`, `/tasks`, `/implement`, or asks to implement an existing SDD plan, use the matching skill.

## 4. Specification Phase

Create or update:

`docs/specs/<feature-name>/spec.md`

Required sections:

- Problem
- Goal
- Non Goals
- User Stories
- Acceptance Criteria
- Edge Cases

The spec must describe observable behavior and success criteria. Do not write production code during this phase.

## 5. Design Phase

Create or update:

`docs/specs/<feature-name>/design.md`

Required sections:

- Architecture
- Data Flow
- Data Model
- API Design
- UI / UX Design, when applicable
- Security Considerations
- Performance Considerations
- Risks
- Alternatives Considered

For this project, design must follow existing Next.js App Router, React 19, CSS Modules, and `antd-mobile` patterns unless the spec explicitly requires a change.

Before designing or implementing Next.js behavior, read the relevant document in `node_modules/next/dist/docs/`. This project uses Next.js 16.2.7 and may differ from older Next.js behavior.

## 6. Task Phase

Create or update:

`docs/specs/<feature-name>/tasks.md`

Required task groups:

- P0: Critical setup and blockers
- P1: Backend or data tasks
- P2: Frontend or UI tasks
- P3: Testing and verification tasks
- P4: Documentation and cleanup tasks

Tasks must be ordered by dependency. Each task must be independently verifiable. If a group does not apply, keep the heading and write `None for this feature.`

## 7. Checklist Phase

Create or update:

`docs/specs/<feature-name>/checklist.md`

Minimum checklist:

- [ ] Acceptance criteria satisfied
- [ ] Unit tests added or explicitly not applicable
- [ ] Integration tests added or explicitly not applicable
- [ ] E2E/manual browser checks completed when UI changes are involved
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Breaking changes documented or explicitly absent

## 8. Review Gate

Before implementation:

1. Verify `spec.md` exists.
2. Verify `design.md` exists.
3. Verify `tasks.md` exists.
4. Verify `checklist.md` exists.
5. Verify `tasks.md` maps back to acceptance criteria.
6. Verify implementation will not touch work outside the documented scope.

If any artifact is missing or inconsistent, stop and generate or repair the SDD artifacts first.

## 9. Implementation Rules

Implementation must follow `tasks.md` sequentially unless dependency order requires a different documented order.

Do not implement tasks that are not defined in `tasks.md`.

After completing a task:

- Mark the task complete in `tasks.md`.
- Update `checklist.md` when a checklist item is proven.
- Run the smallest relevant verification before moving to broader checks.

## 10. Verification Rules

Before declaring completion, run:

- `npm run lint`
- `npm run build`
- Any feature-specific checks listed in `checklist.md`

For UI work, use a browser or screenshot workflow to inspect the changed routes. For this mobile-oriented project, default visual verification should include a `375x750` viewport and any additional viewport listed in the active spec.

## 11. Refactoring Rules

For refactors, the spec must also document:

- Current Architecture
- Proposed Architecture
- Migration Strategy
- Rollback Strategy
- Risk Analysis

Do not modify production code until those sections are present.

## 12. Large Task Rules

If the estimated work touches more than five files, changes more than 300 lines, or crosses multiple subsystems, decompose it into multiple feature directories or task groups.

Never execute large changes as a single undocumented step.
