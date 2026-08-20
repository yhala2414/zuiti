# Config Maintenance

`config/` contains text with an independent configuration responsibility. A string being user-visible or appearing more than once is not, by itself, a reason to move it here.

```text
config/
  copy/       shared API messages and deterministic fallback results
  prompts/    model-facing prompt text and labels
  index.ts    public exports
```

## Choose the Correct Surface

- Page titles, section labels, buttons, empty states, placeholders, Toast text, and component-owned accessibility labels stay in the page or component that gives them meaning.
- Structured scene, target, style, and example display data belongs in `lib/catalog/**`; stable IDs and protocol types remain in `lib/domain/**`.
- Shared API and transport messages belong in `config/copy/api.ts`.
- Deterministic fallback output belongs in `config/copy/fallback.ts`.
- Text that instructs or labels the model belongs in `config/prompts/**`.
- When one concept affects both display and model understanding, update both surfaces deliberately.

Extract content according to ownership and independent change reasons, not occurrence count. Do not move page structure, protocol field names, enum keys, or schema fields into copy configuration merely because they are strings.

## User Copy

- Page-specific copy stays directly in `app/**/page.tsx` so the JSX explains the rendered structure and state branches.
- Component-specific copy stays in `components/**`; iterable component-owned data may use a small constant in the same file.
- `config/copy/api.ts`: user-visible API and transport error messages.
- `config/copy/fallback.ts`: deterministic fallback results.
- `config/copy/index.ts`: copy exports.

Fallback text is user-visible product output, but it must not be documented or represented as live model output. Preserve source metadata in the engineering contract.

## Model Prompts

- `config/prompts/generation.ts`: system/human prompt lines, scene labels, style labels, language labels, and language instructions.
- `config/prompts/index.ts`: prompt exports.

Prompt changes must preserve the structured output contract unless the task explicitly changes the API/domain contract. Keep safety boundaries intact, especially for `sarcasm`.

## Synchronization Rules

Before changing copy or prompts:

1. Identify the content owner: page structure, reusable component, product catalog, API/fallback, or model prompt.
2. Check whether the content needs to change independently from its owner or may later come from a validated data source.
3. Check whether the same concept has both a display label and a model label.
4. Keep UI/BFF protocol fields stable unless a contract change is explicitly requested.
5. Update exports only when a module boundary changes.
6. Run the relevant regression tests, manually review changed text, and run lint.

Do not create a global copy object merely to remove string literals from a page. Do not embed prompt strategy in UI or Route Handlers.
