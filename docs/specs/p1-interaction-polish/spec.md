# P1 Interaction Polish Spec

## Problem

The P1 audit items identify unclear or incomplete interactions in the current mobile H5 flow. Multiple entry points do not reliably carry scene/style state, disabled primary actions still look active, and result actions such as favorite and share are visible without behavior.

## Goal

Improve the existing demo flow without adding new pages or backend systems:

- Home scene entries apply scene-specific default style and tone.
- Home hot style entries deep-link to input with a validated style parameter.
- Input page reads validated scene and style query parameters.
- Disabled primary buttons are visibly disabled.
- Results page favorite and share actions provide immediate feedback.

## Non Goals

- No history list page.
- No account, profile, or cross-device persistence.
- No database.
- No bottom navigation redesign.
- No broad visual redesign outside affected controls.

## User Stories

- As a user entering from a scene card, I want the app to start with defaults that match that scene.
- As a user tapping a hot style, I want that style to be selected on the input page, including after refresh.
- As a user with too little input, I want the disabled button to clearly look unavailable.
- As a user viewing results, I want favorite and share buttons to do something visible and useful.

## Acceptance Criteria

- AC1: Scene entry points call a single store action that applies scene, default style, and default sliders.
- AC2: Hot style links include `style=<styleKey>` and input page validates and applies it.
- AC3: The disabled primary button has distinct inactive styling.
- AC4: Results page favorite toggles local persistence and visible button state.
- AC5: Results page share uses Web Share when available, otherwise copies a share summary and shows Toast feedback.
- AC6: P0 guarantees remain intact: no user-facing fallback/model/source status and 2-character minimum is enforced.

## Edge Cases

- Invalid `scene` or `style` query parameters are ignored.
- Favorite is unavailable when no generated result exists.
- Share falls back when `navigator.share` is unavailable or fails.
- Clipboard failure shows a user-facing failure Toast.
