# Local Web Verification Guide

## Purpose and Authority

This guide owns the operational workflow for optional local Playwright verification in Zuiti. It connects project verification requirements to the locally available `webapp-testing` skill and to an ignored, per-workspace execution area under `.venv/`.

This workflow is not a repository test framework. It does not add Playwright to `package.json`, create a tracked E2E directory, change CI, or authorize a later product stage. `docs/verification-guide.md` owns what evidence a changed surface requires; this guide owns how local repeatable browser evidence is produced.

Do not copy a personal or tool-owned skill directory into the repository. At execution time, locate the `webapp-testing` skill available in the current Agent environment and read its complete `SKILL.md`; the skill's current instructions override examples in this guide when tool operation changes.

## When to Use It

Choose the smallest browser check that proves the task.

| Situation | Action |
| --- | --- |
| The user explicitly requests `webapp-testing`, Playwright, repeatable browser automation, trace, or automated screenshot evidence | Use the workflow directly; do not ask for the same permission again |
| `docs/verification-guide.md` requires repeatable browser evidence for the changed behavior | Tell the user that the workflow will be used, then run it as required verification |
| Automation would materially improve diagnosis or confidence but is not required | Offer it once for the current task, explain the local `.venv` cost, and use it only if accepted |
| A manual browser check is sufficient or the task has no browser behavior | Do not offer or initialize this workflow |

An optional offer can be concise:

> This task crosses browser state or routes, so local `webapp-testing` could provide repeatable evidence. Would you like me to enable it for this task? It creates ignored scripts and artifacts under `.venv/`.

Do not repeat the offer after the user declines unless the task or required verification materially changes.

## Tool Responsibilities

- **Manual visual review:** visual hierarchy, spacing, perceived quality, and comparison with an approved reference.
- **Interactive browser control:** reconnaissance, one-off inspection, and lightweight manual behavior checks.
- **Local `webapp-testing`:** repeatable navigation, interaction, refresh persistence, cross-route behavior, console/network capture, screenshots, traces, and reproducible failures.
- **Project tests, lint, and build:** source-level behavior, contracts, static quality, and production build validity. Local Playwright does not replace them.

A click or Toast is not a completed behavior check. When the product contract expects a result, trace the whole path:

```text
user action
-> visible feedback
-> state / local storage / BFF write
-> downstream read
-> refresh or reopen behavior required by the current contract
```

## Project-Stage Uses

In the active Phase 0, prefer this workflow for confirmed core-flow bugs and missing browser evidence around generation, safety refusal, fallback, error or timeout states, repeated operations, missing drafts, history recovery, result actions, clipboard/share behavior, and browser runtime failures.

During a later approved UI/UX phase, it can provide repeatable `375 x 750` route, interaction, responsive-layout, and state evidence. It still cannot judge visual quality without manual review.

During approved architecture or data stages, it can verify unchanged Web URLs and behavior, multiple local services, error mapping, refresh continuity, and account or asset flows. These statements describe possible verification use; they do not grant implementation permission.

Repeated journeys that become durable team requirements are candidates for a separately approved, tracked Playwright suite. Until the active stage and owning formal documents authorize that transition, scripts remain local under `.venv/`.

## Workspace Bootstrap

Initialize this workflow only when a task needs it. A fresh clone does not need `.venv/` or `.local-docs/` merely to exist.

### 1. Read the current skill

Locate `webapp-testing/SKILL.md` in the current Agent environment and read it completely. If the skill is unavailable, do not invent its path or copy it from another repository; use the fallback rules below.

### 2. Create or reuse the Python environment

Run the commands for the current operating system from the repository root. Each variant uses the virtual-environment interpreter explicitly so shell activation cannot redirect dependencies elsewhere.

#### Windows PowerShell

```powershell
if (-not (Test-Path -LiteralPath '.venv\Scripts\python.exe')) {
  python -m venv .venv
}

.\.venv\Scripts\python.exe -m pip install playwright
.\.venv\Scripts\python.exe -m playwright install chromium
```

#### macOS Terminal

```bash
if [ ! -x '.venv/bin/python' ]; then
  python3 -m venv .venv
fi

./.venv/bin/python -m pip install playwright
./.venv/bin/python -m playwright install chromium
```

#### Linux Terminal

```bash
if [ ! -x '.venv/bin/python' ]; then
  python3 -m venv .venv
fi

./.venv/bin/python -m pip install playwright
./.venv/bin/python -m playwright install chromium
```

If Python virtual-environment support or Chromium system dependencies are unavailable, preserve the failing command and follow the failure rules below. Do not add OS package-manager commands to this project guide because required packages and administrator policy vary by machine.

### 3. Create the local workspace structure

Use a task identifier in the form `YYYY-MM-DD-task-slug`, for example `2026-08-20-history-recovery`.

#### Windows PowerShell

```powershell
$taskId = Read-Host 'Task ID (YYYY-MM-DD-task-slug)'

if ($taskId -notmatch '^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$') {
  throw 'Task ID must use YYYY-MM-DD-task-slug with lowercase ASCII letters, digits, and hyphens.'
}

$paths = @(
  '.venv\webapp-tests',
  ".venv\webapp-artifacts\$taskId\screenshots",
  ".venv\webapp-artifacts\$taskId\traces",
  ".venv\webapp-artifacts\$taskId\logs",
  ".venv\webapp-artifacts\$taskId\videos",
  '.local-docs\plans',
  '.local-docs\notes',
  '.local-docs\audits',
  '.local-docs\references',
  '.local-docs\archive'
)

$paths | ForEach-Object {
  New-Item -ItemType Directory -Force -Path $_ | Out-Null
}
```

#### macOS Terminal

```bash
printf 'Task ID (YYYY-MM-DD-task-slug): '
read -r task_id

if [[ ! "$task_id" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  printf '%s\n' 'Task ID must use YYYY-MM-DD-task-slug with lowercase ASCII letters, digits, and hyphens.' >&2
  exit 1
fi

mkdir -p \
  '.venv/webapp-tests' \
  ".venv/webapp-artifacts/$task_id/screenshots" \
  ".venv/webapp-artifacts/$task_id/traces" \
  ".venv/webapp-artifacts/$task_id/logs" \
  ".venv/webapp-artifacts/$task_id/videos" \
  '.local-docs/plans' \
  '.local-docs/notes' \
  '.local-docs/audits' \
  '.local-docs/references' \
  '.local-docs/archive'
```

#### Linux Terminal

```bash
printf 'Task ID (YYYY-MM-DD-task-slug): '
read -r task_id

if [[ ! "$task_id" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  printf '%s\n' 'Task ID must use YYYY-MM-DD-task-slug with lowercase ASCII letters, digits, and hyphens.' >&2
  exit 1
fi

mkdir -p \
  '.venv/webapp-tests' \
  ".venv/webapp-artifacts/$task_id/screenshots" \
  ".venv/webapp-artifacts/$task_id/traces" \
  ".venv/webapp-artifacts/$task_id/logs" \
  ".venv/webapp-artifacts/$task_id/videos" \
  '.local-docs/plans' \
  '.local-docs/notes' \
  '.local-docs/audits' \
  '.local-docs/references' \
  '.local-docs/archive'
```

Create `.venv/README.md` and `.local-docs/README.md` from the responsibilities below when they are missing. These private files help navigate the current workspace; they never override this guide or other formal documents.

The `.venv/README.md` must identify the directory as ignored and disposable, link to `../docs/webapp-testing-guide.md`, describe `webapp-tests/` and `webapp-artifacts/<task-id>/`, warn that deleting `.venv/` removes all scripts and evidence, and list any legacy material that remains outside the standard layout.

The `.local-docs/README.md` must identify the directory as ignored and non-authoritative, link to `../docs/collaboration-guide.md` and `../docs/webapp-testing-guide.md`, describe its current context categories, and route every Playwright script and browser artifact to `.venv/`.

## Directory and Task Contract

```text
.venv/
  README.md
  webapp-tests/
    YYYY-MM-DD-task-slug.py
  webapp-artifacts/
    YYYY-MM-DD-task-slug/
      result.md
      screenshots/
      traces/
      logs/
      videos/

.local-docs/
  README.md
  rules.md                 optional workspace-local rules
  plans/
  notes/
  audits/
  references/
  archive/
```

All Python Playwright scripts, screenshots, traces, videos, browser logs, and local browser result reports belong under `.venv/`. If the same task has a plan, reference, or collaboration note under `.local-docs/`, use the same task identifier and link to the `.venv` path rather than copying artifacts.

The `.venv/README.md` records the current execution layout, recreation warning, and local legacy files. The `.local-docs/README.md` records the current context layout and authority boundary. Keep both short and update their local inventory when the workspace structure changes; do not promote local conclusions into formal rules automatically.

Deleting `.venv/` deletes its scripts and evidence. Treat all such evidence as disposable unless the task explicitly establishes another approved handoff path.

## Running Zuiti Checks

Before using the skill helper, run its help command with the virtual-environment Python. Substitute the actual current skill path:

```powershell
.\.venv\Scripts\python.exe '<webapp-testing-skill>\scripts\with_server.py' --help
```

Do not read the helper source unless the help command has been tried and the task genuinely requires customization.

If the Next.js server is not already running, let the helper manage its lifecycle. Zuiti normally uses port `3000`:

```powershell
.\.venv\Scripts\python.exe '<webapp-testing-skill>\scripts\with_server.py' `
  --server 'npm run dev' `
  --port 3000 `
  .\.venv\Scripts\python.exe '.venv\webapp-tests\YYYY-MM-DD-task-slug.py'
```

If a server is already running, do not start a duplicate. For this dynamic Next.js application, follow reconnaissance before action:

1. Navigate to the target route and wait for the rendered application state as required by the current skill.
2. Inspect the rendered DOM, screenshot, links, and controls.
3. Choose stable selectors from the observed state.
4. Execute one behavior chain at a time.
5. Assert the actual state, storage, route, or BFF result, not only clickability.
6. Capture relevant console and network failures.
7. Close the browser and ensure helper-managed services stop.

Use headless Chromium and the project viewport `375 x 750` unless the named task requires an additional explicitly reported viewport.

## Result Record

Write `.venv/webapp-artifacts/<task-id>/result.md` for each automated task with these headings:

```markdown
# <Task ID> Browser Verification

## Environment
- Date:
- Branch and working-tree state:
- URL and server command:
- Viewport:
- Data and configuration assumptions:

## Steps and Assertions

## Console and Network Findings

## Result
- Passed:
- Failed:
- Not run:

## Evidence

## Remaining Risks
```

Record only observed results. A previous run, screenshot alone, or successful click is not proof of the current behavior.

## Debugging and Failure Handling

When the task concerns a bug or a browser check fails:

1. Read the complete error, console, network, and trace evidence.
2. Reproduce the failure consistently and record exact steps.
3. Inspect recent changes and trace data across UI, state/storage, request wrapper, BFF, and result rendering as applicable.
4. State one root-cause hypothesis and test it with the smallest useful reproduction.
5. Change the source only after the evidence identifies the cause.
6. Re-run the original reproduction and all verification required by the changed surface.

Do not stack speculative fixes. After three failed, distinct fix hypotheses, stop and discuss whether the test or product architecture is wrong before attempting another change.

Fallback behavior:

- **Skill unavailable:** report that repeatable skill-based verification cannot run; use an available manual or interactive browser check only when it can still prove the requirement.
- **Python, Playwright, or Chromium unavailable:** report the failing command and exit state; do not claim Playwright verification.
- **Server unavailable:** preserve startup output, diagnose the server failure, and do not treat the page as tested.
- **Automation unstable:** preserve the reproduction evidence, identify timing or selector causes, and report any remaining uncertainty.

## Completion and Handoff

Before claiming the browser task passed:

1. Re-run the full current browser command.
2. Read the exit code and complete output.
3. Review `result.md` against every requested behavior and required project check.
4. Run the tests, lint, build, or manual review required by `docs/verification-guide.md` for the changed surface.
5. Report created or modified files, commands and current results, skipped checks, evidence location, and remaining limitations.

Local Playwright success does not imply tests, lint, build, visual quality, provider behavior, or production deployment passed unless each was separately verified.
