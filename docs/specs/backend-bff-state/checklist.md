# Backend BFF + Frontend State Checklist

- [ ] Updated acceptance criteria for centralized copy, language-following generation, and demo diagnostics are fully satisfied
- [ ] `config/` exists at project root and is the single editable entry for UI copy, server copy, fallback copy, and prompt copy
- [ ] `app/**`, `components/**`, `utils/**`, and `lib/**` no longer keep configurable product text inline, except structural tokens or fixed protocol fields
- [ ] Prompt text has moved out of `lib/llm/**` business logic into `config/prompts/**`
- [ ] `/api/generate` exposes enough metadata to distinguish `model` vs `fallback` and the resolved response language
- [ ] Results page renders generated姝ｆ枃 only from Zustand draft + API response, not from static sample text
- [ ] `npm run dev` live-chain inspection confirms whether frontend and backend are connected
- [ ] Chinese input and non-Chinese or mixed-language input both return language-following results
- [ ] Fallback path, model path, refusal path, failure path, and missing-draft path are visually distinguishable
- [ ] Integration/API checks completed
- [ ] E2E/manual browser checks completed for `375 x 750`
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Security review completed
- [ ] No API key exposed to frontend
- [ ] Logs avoid full raw user text
- [ ] Documentation updated
- [ ] Breaking changes documented or explicitly absent

## Notes

- This checklist supersedes the previous verification baseline because the active scope now includes copy centralization, explicit fallback diagnostics, and language-following generation.
- The previously completed BFF baseline remains useful context, but all items above require re-verification after the new scope is implemented.

## Execution Defaults After Approval

- Use `subagent-driven-development`.
- Do not ask more product questions.
- Use the recommended defaults in this document.
- Main thread coordinates and reviews.
- Backend worker owns `app/api/**`, `lib/**`, `config/prompts/**`, server copy modules, language inference, and API verification.
- Frontend worker owns `config/copy/**`, Zustand store, frontend utils/API client, content mappings, page wiring, and mobile visual verification.
- Review order per task: spec compliance first, code quality second.

