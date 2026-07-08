# Backend BFF + Frontend State Checklist

## Status

`done-with-verification-gap`

## Completed

- [x] Acceptance criteria for BFF route structure, flow state, structured output, fallback behavior, feedback, and tracking are satisfied by current implementation.
- [x] `config/` exists at project root and is the editable entry for UI copy, server copy, fallback copy, and prompt copy.
- [x] Prompt text is centralized through `config/prompts/**`.
- [x] `/api/generate` exposes metadata distinguishing `model` vs `fallback` and resolved response language.
- [x] Results and tone preview consume Zustand draft and API result state rather than only static sample body text.
- [x] Fallback path, model path, refusal path, failure path, and missing-draft path have distinct state representations.
- [x] Integration/API route behavior was verified during the original implementation pass.
- [x] Security review completed for server-only model keys and lightweight logs.
- [x] Documentation updated in the current authority set.
- [x] Breaking changes are absent for public HTTP API routes and frontend route paths.

## Remaining Verification Gaps

- [x] Re-run `npm run test`.
- [x] Re-run `npm run lint`.
- [x] Re-run `npm run build` after package/script/export updates.
- [ ] Complete browser/manual checks at `375 x 750` for `/`, `/input`, `/tone`, `/results`, `/history`, and `/profile`.
- [ ] Verify live model path with a configured `AI_API_KEY`; fallback path is valid when no key is configured.

## Notes

- This checklist no longer represents unfinished product-code tasks. It records current verification debt.
- If browser tooling remains unavailable, keep this spec status as `done-with-verification-gap`.
