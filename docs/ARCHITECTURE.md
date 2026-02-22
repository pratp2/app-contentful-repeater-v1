# Architecture

High-level design and technical decisions for the Contentful Repeater App.

## Overview

This project implements a Contentful App that mounts in the Entry Field location. It offers a repeater-style editor for lists of key/value pairs, persisted in a JSON Object field. The UI is built with React and TypeScript and uses Forma 36 to ensure a consistent, accessible experience inside Contentful's iframe.

## Core concepts

- Location: the app registers for `LOCATION_ENTRY_FIELD`. Contentful renders it when a JSON Object field uses this app in the Appearance tab.
- Field value: the field stores an array of items with the shape `{ id, key, value }`. The app reads and writes this data via the Field App SDK (`sdk.field.getValue` / `sdk.field.setValue`).
- Instance parameters: the label for the value column is configurable via the `valueName` instance parameter (for example, "URL" or "Description").

## Technical decisions

| Decision | Rationale |
|----------|-----------|
| **React + TypeScript** | Provides type safety and aligns with Contentful's recommended stack. |
| **Vite** | Fast local development and efficient production builds. |
| **Forma 36 (F36)** | Matches Contentful's visual language and accessibility patterns. |
| **Scoped CSS / Emotion** | Ensures layout and spacing are stable within Contentful's global styles. |
| **Pino for logging** | Structured, leveled logs; `pino-pretty` for readable dev output. |
| **Vitest + React Testing Library** | Fast, focused unit tests that simulate user interactions and SDK integration. |

## Data flow

1. Mount: `Field` reads `sdk.field.getValue()`, initializes local state, and subscribes to `sdk.field.onValueChanged`.
2. User actions: add/update/delete operations update local state and call `sdk.field.setValue(...)` so Contentful persists changes.
3. External changes: `onValueChanged` keeps local state in sync when the value changes elsewhere (for example, another browser tab or external API).

## Project structure

- `src/` — Application code: entry point, router, locations (Field), shared components, and utilities.
- `src/locations/Field.tsx` — Repeater Field UI and business logic; styles and types are co-located.
- `src/utils/logger.ts` — Centralized logging and helpers.
- `test/` — Unit tests and shared mocks.
- `docs/` — Project documentation.

## Build and deploy

- Build: `npm run build` (TypeScript compile + `vite build`) — output goes to `dist/`.
- Upload: `npm run contentful:upload` publishes the bundle and updates the App Definition.
- The app is delivered as a static bundle and runs inside Contentful's iframe in the entry editor; local development uses the Vite dev server.

## Accessibility (WCAG)

- Uses semantic table markup (`<table>`, `<thead>`, `<th>`) and `aria-*` attributes where appropriate.
- Inputs and actions include accessible labels and context.
- Spacing and touch targets follow Forma 36 and WCAG guidance.

## Future considerations

- Reordering: add drag-and-drop or move up/down controls using stable `id` values.
- Validation: support configurable rules (required keys, min/max lengths) before persisting values.
- Additional locations: expose the same UI in other Contentful locations (sidebar, entry editor contextual views).
