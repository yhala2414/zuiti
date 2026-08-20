# Collaboration Guide

## Purpose

This guide explains how humans and Agents turn project context into a scoped, evidence-backed action. It is the workflow layer beneath `AGENTS.md`: `AGENTS.md` remains the binding execution entrypoint and active-stage authority; this guide explains how to reason when planning, crossing modules, changing formal documentation, resolving authority conflicts, or reviewing collaboration drift.

Ordinary localized work with an unambiguous contract does not require this guide.

## Operating Loop

Run the complete loop for non-trivial collaboration work:

```text
Select mode
-> Context
-> Authority
-> Scope
-> Diagnosis
-> Change decision
-> Verification
-> Correction
```

The loop is complete only when the next action, its authority, and its evidence are clear. Naming a method or filling in a template is not completion.

### Select mode

| Signal | Mode | Expected result |
| --- | --- | --- |
| No stable entrypoint or scope exists | Bootstrap | Smallest usable context, authority, scope, and verification baseline |
| Existing collaboration or documentation needs inspection | Audit | Current authority map, risks, and evidence-backed gaps |
| A known collaboration gap needs correction | Improve | Smallest complete system change and verification |
| A real miss, drift, repeated error, or false completion occurred | Retrospective | Failure Review, corrected work, system-change decision, and prevention |

Select the mode before proposing artifacts. A request to diagnose does not authorize implementation or documentation changes.

## Context Discovery

Before deciding what to do:

1. Read `AGENTS.md` and only the task-relevant formal documents it routes to.
2. Inspect the current code, tests, configuration, and uncommitted work for the affected surface.
3. Read `.local-docs/`, screenshots, generated plans, historical audits, or reference material only when named by the user or clearly relevant as evidence.
4. Separate confirmed current facts from historical evidence, inferred ideas, suggestions, and open questions.
5. Recheck the latest user instruction before acting; a later instruction may narrow or replace an earlier plan.

Do not read every document by default. Context discovery should find the smallest sufficient authority set without hiding relevant conflicts.

## Authority and Document Routing

Authority is both hierarchical and domain-specific. The latest user instruction and `AGENTS.md` bind execution; each formal document below owns its domain. An explanatory document may clarify a rule but cannot override its owner.

| Information or change | Primary authority | Secondary documents may |
| --- | --- | --- |
| Active stage, implementation permission, Agent behavior | `AGENTS.md` | Link to it and describe domain impact |
| Current product contract and capability status | `docs/product-prd.md` | Reference relevant problems or implementation |
| Implemented routes, modules, data flow, and technical boundaries | `docs/architecture.md` | Reference future architecture without presenting it as current |
| Confirmed problems, sequencing, phase gates, and entry conditions | `docs/product-evolution.md` | Link from current contracts and execution rules |
| Required evidence and completion checks | `docs/verification-guide.md` | Summarize only when a task needs a direct reminder |
| Optional local Playwright execution and workspace layout | `docs/webapp-testing-guide.md` | Link to its trigger and execution rules without creating a formal test framework |
| Copy, fallback, API-message, and prompt ownership | `config/README.md` | Reference the owning configuration surface |
| Temporary plans, screenshots, reports, and unconfirmed ideas | ignored `.local-docs/` | Supply evidence; never act as team authority |
| Collaboration reasoning and correction workflow | `docs/collaboration-guide.md` | Explain `AGENTS.md`; never grant execution permission |

When two formal documents conflict, do not choose the convenient wording. Identify the domain owner, confirm current code and user intent, correct the owner first, then remove or reduce stale copies. If ownership itself is unclear, stop and report the ambiguity.

## Scope and Authorization

Determine scope in this order:

1. Read the active stage and explicit prohibitions in `AGENTS.md`.
2. Identify the current product and architecture contracts for the affected surface.
3. Use Product Evolution only for confirmed sequencing and entry conditions.
4. Distinguish discussion, design approval, phase approval, and implementation authorization.

Planning a future capability is not permission to implement it. A roadmap item, approved long-term direction, design draft, or local plan remains non-executable until the active stage is explicitly changed and affected formal contracts are synchronized.

If a task grows beyond its approved surface, stop the expansion, preserve completed in-scope work, and request the missing decision instead of silently broadening the task.

## Diagnosis and Change Decision

Classify the cause before changing code, documents, or workflow:

| Finding | Failure type | Required response |
| --- | --- | --- |
| The rule was clear but was not followed | agent execution | Correct the work; do not add documentation |
| The rule existed but a reasonable reader could not find it | context discovery | Improve the entrypoint, read order, or link |
| The wording supports multiple reasonable interpretations | documentation ambiguity | Clarify the owning formal document, including an anti-example when useful |
| Copies disagree or an old statement still appears current | documentation drift | Select the owner; update it and remove, link, or synchronize copies |
| A recurring material case has no rule | documentation gap | Add the smallest durable rule to the owning surface |
| Validation, feedback, handoff, or status transition is missing | process failure | Repair the workflow and define evidence of closure |

Make the smallest **complete** intervention. Minimal change means avoiding unrelated systems and duplicate artifacts; it does not mean leaving the diagnosed workflow incomplete.

## Permission to Change Formal Documents

Finding a problem, running an audit, or completing a retrospective does not by itself authorize edits to stable team documents.

Formal documents may be changed when:

- the user explicitly requests documentation or collaboration-system correction;
- the user confirms a durable product, architecture, stage, verification, or configuration decision;
- an authorized implementation changes current behavior and the owning document must be synchronized;
- a confirmed conflict must be corrected to restore one authoritative interpretation.

Otherwise, report the evidence, domain owner, and smallest proposed correction without mutating the formal layer. Never promote a local draft or inference merely because it appears useful.

## Workspace-Local Material

`.local-docs/` is an ignored directory created independently in each working copy. It is not present in a fresh clone unless that collaborator or Agent initializes it, and its contents are not shared through Git.

### When to initialize it

Create `.local-docs/` when any of these conditions applies:

- the user explicitly asks for a local plan, handoff, audit, reference collection, or temporary note;
- the task needs non-authoritative planning, research, audit, or generated working material;
- a long-running task needs a local handoff or conversation summary that should not become a team contract;
- workspace inspection finds loose plans, reports, screenshots, generated files, or stale audits that do not belong in a formal authority surface.

An Agent may initialize the ignored directory when it needs to create new task-local artifacts. Do not create it speculatively for an ordinary task that produces no local material. Confirm ignore behavior with `git check-ignore .local-docs/` or a path beneath it; never add `.gitkeep` merely to distribute the directory.

### Classification and placement

Use meaningful names and the smallest useful structure. A few files may remain directly under `.local-docs/`; create category folders when material starts accumulating.

| Material | Preferred placement | Notes |
| --- | --- | --- |
| Workspace-only confirmed preferences or handling rules | `.local-docs/rules.md` | Local context only; cannot override or be copied verbatim into formal rules |
| Task plans and implementation breakdowns | `.local-docs/plans/` | Temporary execution aid, not product or architecture approval |
| Conversation summaries, handoffs, research notes, unconfirmed requirements | `.local-docs/notes/` | Mark unresolved assumptions and superseded conclusions |
| Exploratory audits and time-point reports | `.local-docs/audits/` | Include date, scope, evidence source, and whether findings were reverified |
| Reference images and external examples | `.local-docs/references/` | Record source and intended use; confirm strict, style, or specified-part reference before implementation |
| Superseded local material kept temporarily for recovery | `.local-docs/archive/` | Not a dumping ground or permanent decision history |

Prefer names such as `2026-08-19-results-flow-audit.md` or `history-recovery-plan.md`. Avoid names such as `new.md`, `final-final.md`, or `audit.md` that hide scope and age.

### Local Web verification exception

When a task uses the local `webapp-testing` skill, its Python environment, Playwright scripts, screenshots, traces, videos, browser logs, and result report all stay under ignored `.venv/`. The executable layout and task naming contract are owned by `docs/webapp-testing-guide.md`.

`.local-docs/` may hold separate plans, references, or collaboration notes for the same task and may point to a matching task identifier under `.venv/`, but it must not duplicate the browser artifacts. Neither local directory is team authority, and neither is automatically promoted into formal documentation.

### Detecting and moving loose documents

Do not treat every unfamiliar Markdown file as garbage. Before proposing a move:

1. Inspect `git status`, file contents, inbound references, recent history, and whether another tool or collaborator consumes it.
2. Classify it as formal authority, legitimate tracked support material, workspace-local evidence, obsolete candidate, or unresolved.
3. Leave formal and legitimate tracked material in its owned location.
4. For workspace-local evidence, propose the exact `.local-docs/` destination. If the file is tracked, shared, referenced, or classification is unresolved, obtain user approval before moving it.
5. When cleanup is explicitly requested and an untracked file is unambiguously temporary, move it into the appropriate local category and report the move. Prefer `.local-docs/archive/` over deletion when recovery may matter.
6. After a move, verify ignore status, stale references, and `git status`. Never use local cleanup to conceal an unresolved formal-document conflict.

If local material contains a durable fact needed by the team, promote only the confirmed conclusion to the owning formal document. Do not commit the local file, assume another collaborator can see it, or copy an entire local report into the formal layer.

## Failure Review

Run a Failure Review when work crosses a stage boundary, treats temporary material as authority, expands scope, presents fake success, claims completion without evidence, encounters conflicting formal rules, repeats a reasonable misinterpretation, or the user identifies collaboration drift.

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

Apply it as a decision process:

1. Stop the miss and preserve the original evidence.
2. Correct the actual task before polishing the collaboration system.
3. Decide whether the failure was execution-only or systemic.
4. Change the smallest owning surface only when the cause is systemic and the change is authorized.
5. Verify both the corrected result and the future discoverability of the rule.
6. State the changed next action. “Be more careful” is not prevention.

## Decisions and Document Lifecycle

Create a decision record only when a confirmed decision needs durable background because it affects multiple collaborators or modules, shared architecture, stage policy, global design rules, data contracts, or verification gates. Local bug fixes, page copy, temporary plans, and implementation details do not justify one. Do not pre-create an empty decision system.

For every formal document change:

1. Update the primary authority.
2. Search for duplicated or contradictory wording.
3. Replace secondary rules with a short consequence or link where possible.
4. Mark dated audits and command results as time-point evidence.
5. Remove resolved current issues from active lists or retain only a compact historical record when it still explains a decision.
6. On a stage transition, update `AGENTS.md` first, then synchronize only the product, architecture, evolution, and verification facts actually changed by that transition.

## Verification and Handoff

Use `docs/verification-guide.md` for checks. Collaboration changes must additionally prove that a future Agent can:

- find the correct entrypoint without prior conversation;
- identify one primary authority for the disputed rule;
- distinguish active permission, future direction, current implementation, and historical evidence;
- route a correction to the right document;
- avoid converting an execution miss into unnecessary process;
- keep an unsupported completion claim in a candidate state until evidence exists.

Report changed files, commands and results, skipped checks and reasons, and remaining uncertainty. A completion statement without this evidence is only a completion candidate.
