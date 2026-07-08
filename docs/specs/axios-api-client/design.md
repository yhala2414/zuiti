# Axios API Client Refactor Design

## Architecture

The browser API boundary remains in `utils/**`. A new `utils/api-client.ts` owns the axios instance, interceptors, and generic `postJson<T>()` helper. `utils/expression-api.ts` remains the product-specific API wrapper for generation, feedback, and tracking.

The BFF remains in Next.js App Router Route Handlers under `app/api/**/route.ts`, using Web `Request` and `Response` APIs. The model layer remains in `lib/llm/**` and continues using LangChain.

## Data Flow

1. `/tone` or `/results` calls `generateExpression(draft)`.
2. Result actions call `sendFeedback(payload)` or `trackEvent(payload)`.
3. `utils/expression-api.ts` delegates to `postJson<T>()` from the shared axios client.
4. The axios request interceptor ensures JSON headers are present.
5. The axios response interceptor returns `response.data` for successful responses.
6. The axios error interceptor preserves valid BFF error bodies or returns a normalized `NETWORK_ERROR`.

## Data Model

No BFF request or response contract changes.

Shared client failure shape:

```ts
{
  ok: false,
  code: "NETWORK_ERROR",
  message: apiErrorCopy.networkError,
}
```

## API Design

Browser helper:

```ts
postJson<T>(url: string, payload: unknown): Promise<T>
```

Product wrappers keep the existing API:

- `generateExpression(draft)` -> `POST /api/generate`
- `sendFeedback(payload)` -> `POST /api/feedback`
- `trackEvent(payload)` -> `POST /api/track`

Route Handler contracts are unchanged.

## UI / UX Design

No direct UI changes. Existing loading, success, fallback, fail, refused, and missing-draft states continue to be driven by the response shapes returned from the product wrappers.

## Security Considerations

- The axios client is browser-side and must not read server-only env vars or expose model credentials.
- Authorization headers are not added because the MVP has no authentication.
- Error normalization must not leak raw provider errors to the UI.

## Performance Considerations

The axios wrapper adds minimal overhead. No retries or polling are introduced, so request volume and latency behavior remain aligned with the current flow.

## Risks

- Axios rejects non-2xx responses by default, so the interceptor must preserve BFF error bodies instead of converting all failures to generic network errors.
- Overly broad typing could hide malformed responses, so the client should only normalize transport failures and leave product validation to existing callers and BFF schemas.
- Documentation may drift if future request helpers bypass `utils/api-client.ts`.

## Alternatives Considered

- Keep native `fetch`: simpler, but does not satisfy the requirement for axios interceptors.
- Add axios directly inside `expression-api.ts`: smaller edit, but repeats the current problem of mixing transport policy with product wrappers.
- Use axios in server Route Handlers: unnecessary and contrary to the Next.js BFF architecture.
