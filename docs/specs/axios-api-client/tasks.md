# Axios API Client Refactor Tasks

## P0 - Critical

- [x] T001 Create `spec.md`, `design.md`, `tasks.md`, and `checklist.md`.
- [x] T002 Read relevant Next.js Route Handler docs before confirming server routes stay unchanged.

## P1 - Backend / Data

- [x] T003 Confirm no backend API route contract changes are required.

## P2 - Frontend / UI

- [x] T004 Install `axios` and update npm dependency files.
- [x] T005 Create `utils/api-client.ts` with centralized axios instance, request interceptor, response interceptor, and `postJson<T>()`.
- [x] T006 Refactor `utils/expression-api.ts` to use the shared axios `postJson<T>()` while keeping existing exports.
- [x] T007 Confirm page-level request call sites do not need behavior changes.

## P3 - Testing / Verification

- [x] T008 Run static search to confirm frontend BFF requests no longer use `fetch`.
- [x] T009 Run static search to confirm axios is registered and centralized.
- [x] T010 Run `npm run lint`.
- [x] T011 Run `npm run build`.
- [ ] T012 Manually inspect `/input -> /tone -> /results` at `375 x 750`.

## P4 - Documentation / Cleanup

- [x] T013 Update `docs/api-request-and-config-map.md` for axios client and request map.
- [x] T014 Update this checklist after verification.
- [x] T015 Summarize changed files, verification, limitations, and follow-up work.

## Dependencies

- P0 must complete before implementation.
- T004 must complete before T005.
- T005 must complete before T006.
- Verification tasks run after implementation tasks.
