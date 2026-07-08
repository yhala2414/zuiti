# Design Token Governance

## Purpose

This document defines when a visual value should become a shared token in `app/globals.css`. It prevents one-off page decoration, private component colors, or temporary offsets from becoming global design-system rules.

## Token Admission Rules

A value may become a global token only when:

- It appears in at least two pages or reusable components with the same semantic meaning.
- It represents a design-system primitive such as color, radius, shadow, spacing, motion duration, gradient, or component theme value.
- It affects `antd-mobile` theme overrides, global utility classes, or multiple reusable components.
- Its name can describe a stable semantic role rather than a specific page or illustration.

## Keep Local

Do not promote these to global tokens:

- Single-page hero gradients, light spots, or decorative layout values.
- Private icon drawing values such as `.zuiti-icon-*` details.
- One-off responsive compensation values.
- Numerically similar values with different visual semantics.
- Temporary values introduced during an experiment.

## Current Global Token Categories

The project may use global tokens for:

- Text hierarchy, such as secondary and tertiary text colors.
- Shared glass surfaces.
- Subtle borders.
- Common radii: medium, large, pill.
- Shared motion durations.
- Primary CTA gradient.
- Slider fill, track, and thumb theme values.

## Change Process

Before adding a new global token:

1. Search for repeated usage.
2. Confirm the repeated usage has the same semantic meaning.
3. Prefer a local CSS Module value if the value belongs to one page or component.
4. Add the token to `app/globals.css` only when it improves shared maintenance.
5. Mention affected pages/components in the change summary.

## Naming Rules

- Use semantic names: `--text-secondary`, `--radius-pill`, `--motion-fast`.
- Avoid page names: do not use names such as `--home-hero-blue`.
- Avoid implementation-only names: do not use names such as `--random-offset-12`.
