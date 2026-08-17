# Config Maintenance

`config/` centralizes text that changes more often than application structure.

```text
config/
  copy/       user-visible copy, API messages, and fallback results
  prompts/    model-facing prompt text and labels
  index.ts    public exports
```

## Choose the Correct Surface

- Text shown directly to users belongs in `config/copy/**`.
- Text that instructs or labels the model belongs in `config/prompts/**`.
- When one concept affects both display and model understanding, update both surfaces deliberately.

Do not move protocol field names, enum keys, or structural schema fields into copy configuration merely because they are strings.

## User Copy

- `config/copy/pages.ts`: page titles, subtitles, CTAs, empty states, and prompts.
- `config/copy/components.ts`: reusable component and navigation labels.
- `config/copy/content.ts`: scene/style display content and mappings.
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

1. Identify whether the primary consumer is the user or the model.
2. Check whether the same concept has both a display label and a model label.
3. Keep UI/BFF protocol fields stable unless a contract change is explicitly requested.
4. Update exports only when a module boundary changes.
5. Run the relevant regression tests, manually review changed text, and run lint.

Do not place configurable product copy in route pages, reusable components, `utils/**`, or `lib/**`. Do not embed prompt strategy in UI or Route Handlers.
