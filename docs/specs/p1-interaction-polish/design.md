# P1 Interaction Polish Design

## Architecture

Keep all behavior in the existing Next.js App Router app. UI changes stay in `app/**`, shared copy in `config/copy/**`, route/content helpers in `utils/content-mapping.ts`, and flow state in `stores/expression-flow-store.ts`.

## Data Flow

Home entries call `applySceneDefaults(scene)` and navigate to `/input?scene=<scene>`. Hot style entries navigate to `/input?scene=work&style=<style>` and apply the style in store.

Input reads `scene` and `style` through `useSearchParams` inside the existing Suspense boundary. Valid scene parameters apply scene defaults; valid style parameters override the default style.

Results favorite state is stored in `localStorage` under a small local key, scoped by session and generated result. Share builds a text summary from the original input and recommended result variants.

## Data Model

- `sceneDefaultStyles: Record<Scene, ExpressionStyle>`
- `sceneDefaultSliders: Record<Scene, ToneSliders>`
- `favoritePayload`: session id, original text, timestamp, generated result

## API Design

No API changes.

## UI / UX Design

Disabled buttons use muted color, no sheen animation, reduced shadow, and `not-allowed` cursor.

Favorite action toggles between normal and active labels. Share action uses native share where available; otherwise it copies text and shows Toast. The result cards stay visually unchanged.

## Security Considerations

Only validated enum values from query parameters are applied. `router.push` and href values use fixed internal paths and known enum keys.

## Performance Considerations

Local persistence and query parsing are small synchronous operations. No new network calls are introduced.

## Risks

LocalStorage is browser-only, so favorite state is initialized after mount. Native share availability differs across browsers.

## Alternatives Considered

Backend persistence was rejected for MVP scope. A new history/favorites page was rejected as P2 scope.
