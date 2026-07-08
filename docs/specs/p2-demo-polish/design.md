# P2 Demo Polish Design

## Architecture

Use a browser-only utility under `utils/recent-history.ts` for local recent records. Pages call it after hydration or generation success. Keep UI in existing page/components and CSS modules.

## Data Flow

Results page observes successful generation. When request key and result exist, it saves one recent record containing session id, text, scene, style, createdAt, and output summary.

Home subscribes to local storage changes with `useSyncExternalStore` and renders latest record. If no latest record exists, it renders an empty card.

BottomNav uses `usePathname` and `useRouter`. Items with href navigate; disabled items show Toast.

## Data Model

`RecentHistoryItem`:

- id
- sessionId
- text
- scene
- style
- createdAt
- summary

Store under `zuiti.recent.history.v1`, capped to 5 records.

## API Design

No API changes.

## UI / UX Design

Home recent section remains visually compact. Empty state uses the existing soft-card language. Bottom nav keeps current TabBar appearance and adds clear placeholder feedback.

## Security Considerations

All localStorage reads are parsed defensively. Bottom nav only routes to fixed internal href values.

## Performance Considerations

History size is capped to 5 records. Storage reads are small and synchronous.

## Risks

History is local only and can be cleared by browser storage. This is acceptable for the MVP.

## Alternatives Considered

A full history route was rejected because it belongs to a later P2/P3 feature with its own spec.
