# P2 Demo Polish Spec

## Problem

After P0/P1, the main flow works better, but several demo details still feel incomplete: home "recent use" is static, bottom navigation looks tappable without clear behavior, and loading/empty states are minimal.

## Goal

Polish MVP details without adding backend scope:

- Persist a lightweight local recent-generation record after successful results.
- Show a real recent-use card on home, or a clear empty state if no record exists.
- Make bottom navigation actions explicit: home/input/tone are navigable, profile/history placeholders give feedback instead of doing nothing.
- Improve visible loading state on results without changing generation API.

## Non Goals

- No full history list page.
- No profile page.
- No database or authentication.
- No new route beyond existing `/`, `/input`, `/tone`, `/results`.
- No broad redesign.

## User Stories

- As a user who generated a result, I want the home page to show my latest conversion rather than static demo data.
- As a first-time user, I want the recent-use area to clearly say there is no history yet.
- As a user tapping bottom navigation, I want either navigation or a clear “not available yet” message.
- As a user waiting for generation, I want a more obvious loading state.

## Acceptance Criteria

- AC1: Successful results persist a recent generation record in localStorage.
- AC2: Home reads recent generation records and renders latest record or empty state.
- AC3: Bottom navigation has route targets for existing flow pages and placeholder feedback for unavailable sections.
- AC4: Results loading state includes a visible loading class or indicator.
- AC5: P0/P1 tests remain passing.

## Edge Cases

- Corrupt localStorage history is ignored.
- Empty history shows an empty state and CTA to start.
- Placeholder bottom-nav items do not navigate to missing routes.
