# Axios API Client Refactor Spec

## Problem

The current browser-to-BFF requests are implemented with a local `fetch` helper in `utils/expression-api.ts`. This works for the MVP, but request setup and error normalization are mixed into the expression API wrapper, leaving no single HTTP client boundary for future request headers, response handling, and diagnostics.

The project also needs its network request documentation to reflect the current implementation and clearly separate browser BFF requests from Next.js Route Handlers and LangChain model calls.

## Goal

Refactor browser-side `/api/**` calls to use a centralized axios client under `utils/**`, with request and response interceptors for shared JSON headers and stable error normalization.

Update network request documentation so future maintainers can find every request trigger, endpoint, and non-request action from one place.

## Non Goals

- Do not change the public BFF API contract for `/api/generate`, `/api/feedback`, or `/api/track`.
- Do not rewrite Next.js Route Handlers to use axios.
- Do not replace or bypass LangChain/OpenAI-compatible SDK model calls.
- Do not add authentication, retry queues, cancellation, databases, or long-term request logs.
- Do not change page-level call sites unless required to preserve types.

## User Stories

- As a frontend maintainer, I want all browser API requests to go through one axios instance so request headers and response behavior can be changed safely.
- As a product/debugging maintainer, I want the request map documentation to list every real request trigger so demo behavior can be diagnosed quickly.
- As a user, I want generation, feedback, and tracking behavior to remain stable after the internal request client changes.

## Acceptance Criteria

- [ ] `axios` is installed and registered in `package.json` and `package-lock.json`.
- [ ] A centralized axios client exists under `utils/**` with request and response interceptors.
- [ ] `utils/expression-api.ts` no longer calls native `fetch` for BFF requests.
- [ ] `generateExpression`, `sendFeedback`, and `trackEvent` keep their existing exported names and response shapes.
- [ ] Server-returned `{ ok: false, code, message }` responses are preserved for HTTP errors.
- [ ] Network, empty, or unrecognized failures are normalized to `NETWORK_ERROR` with `apiErrorCopy.networkError`.
- [ ] Next.js Route Handlers continue to use standard `Request` and `Response`.
- [ ] LangChain model calls remain unchanged.
- [ ] `docs/api-request-and-config-map.md` describes the axios client, interceptors, request list, and out-of-scope network layers.

## Edge Cases

- Server returns non-2xx with a valid `{ ok: false }` body.
- Server returns non-2xx with an empty or non-object body.
- Browser has a network failure before receiving a response.
- Axios receives a response body that is not the expected BFF response shape.
- Existing pages call request helpers without awaiting feedback or tracking promises.
