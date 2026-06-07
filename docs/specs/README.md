# Codex SDD Specs

New Codex SDD artifacts live in this directory:

`docs/specs/<feature-name>/`

Use the templates in `_template/` when starting a new feature.

Recommended entry prompts:

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
Verify with the feature checklist, npm run lint, and npm run build.
```

`.trae/specs/` contains historical Trae Spec Mode specs and may be used as reference only.
