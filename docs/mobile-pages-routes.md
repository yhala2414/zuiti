# Mobile Pages and Routes

## Start

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000/
```

## Viewport Target

The primary manual inspection viewport is:

```text
375 x 750
```

Desktop browsers should center the mobile shell. Use browser device mode or an equivalent screenshot/browser tool for visual checks.

## Current Routes

| Page | Route | File | Purpose | Verification focus |
| --- | --- | --- | --- | --- |
| Home | `/` | `app/page.tsx` | Product entry, recent history, hot styles, start CTA | Entry actions, recent-history visibility, bottom nav |
| Input | `/input` | `app/input/page.tsx` | Scene, target, style, raw thought input | Required selections, text limits, query style preset |
| Tone | `/tone` | `app/tone/page.tsx` | Tone sliders and preview | Slider controls, generated/fallback preview, missing-draft state |
| Results | `/results` | `app/results/page.tsx` | Three output modes and result actions | Loading, model/fallback success, refused, fail, copy, feedback, favorite, share |
| History | `/history` | `app/history/page.tsx` | Local recent history and favorites | Empty state, list rendering, favorite/history storage |
| Profile | `/profile` | `app/profile/page.tsx` | Local MVP profile, preferences, stats | Local-only messaging and navigation |

## API Routes

| API | File | Purpose |
| --- | --- | --- |
| `POST /api/generate` | `app/api/generate/route.ts` | Validate request, call use case, return model/fallback/refusal/error result |
| `POST /api/feedback` | `app/api/feedback/route.ts` | Validate feedback and write lightweight log |
| `POST /api/track` | `app/api/track/route.ts` | Validate event and write lightweight log |

## Main Flow

```text
/ -> /input -> /tone -> /results
```

Supporting routes:

```text
/history
/profile
```

The main flow depends on Zustand state. Direct visits to `/tone` or `/results` must render a missing-draft or recovery state rather than pretending generation succeeded.
