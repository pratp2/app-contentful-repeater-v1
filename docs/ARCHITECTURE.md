# Architecture

High-level design and technical decisions for the Contentful Repeater App.

## Overview

This app is a **Contentful UI Extension** (App) that runs in the **Entry Field** location. It provides a repeater-style editor for a list of key-value pairs, stored in a **JSON Object** field. The UI is built with React, TypeScript, and Forma 36 and is hosted as a static bundle that Contentful loads in an iframe.

## Core concepts

- **Location**: The app registers for `LOCATION_ENTRY_FIELD`. Contentful mounts it when a field with “JSON Object” type uses this app in the Appearance tab.
- **Field value**: The field’s value is an array of `{ id, key, value }` objects. The app reads and writes this via the Field App SDK (`sdk.field.getValue` / `sdk.field.setValue`).
- **Instance parameters**: The label for the “Value” column is configurable via the `valueName` instance parameter (e.g. “URL”, “Description”).

## Technical decisions

| Decision | Rationale |
|----------|-----------|
| **React + TypeScript** | Type safety, common ecosystem, aligns with Contentful’s own tooling. |
| **Vite** | Fast dev server and builds; simple config; good for a small SPA. |
| **Forma 36 (F36)** | Contentful’s design system; consistent look and accessibility with the rest of the Contentful UI. |
| **Emotion `css` for Field layout** | Table spacing and layout need to survive F36’s styles; scoped CSS classes give full control. |
| **Pino for logging** | Structured logs and levels; `pino-pretty` for readable dev output. |
| **Vitest + React Testing Library** | Fast unit tests; tests focus on behavior and SDK interaction. |
| **Single location (Entry Field)** | Scope is one reusable repeater field; additional locations can be added later if needed. |

## Data flow

1. **Mount**: `Field` reads `sdk.field.getValue()`, initializes local state, and subscribes to `sdk.field.onValueChanged`.
2. **User actions**: Add/update/delete update local state and call `sdk.field.setValue(...)` so Contentful persists the value.
3. **External changes**: `onValueChanged` updates local state when the value is changed elsewhere (e.g. another tab or API).

## Project structure

- **`src/`** — Application code: entry point, App router, locations (Field), shared components, utils.
- **`src/locations/Field.tsx`** — Repeater field UI and logic; styles and types are co-located.
- **`src/utils/logger.ts`** — Shared Pino logger and helpers.
- **`test/`** — Vitest tests and shared mocks (e.g. `test/mocks`).
- **`docs/`** — Documentation (this file, recommendations, generated API docs).

## Build and deploy

- **Build**: `npm run build` runs `tsc` then `vite build`; output is in `dist/`.
- **Upload**: `npm run contentful:upload` uses Contentful app scripts to upload the bundle and register/update the app definition.
- The app runs inside the Contentful web app iframe; the dev server is used for local testing with the Contentful app framework.

## Accessibility (WCAG)

- Table uses semantic `<table>`, `<thead>`, `<th>` and `aria-label` for the table and actions.
- Inputs and buttons have accessible names (labels/aria-labels) and row context where needed.
- Spacing and touch targets (e.g. min height 44px) follow Forma 36 and WCAG-oriented practices.

## Future considerations

- **Reordering**: Drag-and-drop or move up/down could be added with a stable `id` per item (already present).
- **Validation**: Optional min/max length or required keys could be enforced before `setValue`.
- **More locations**: Sidebar or other Contentful locations could be added via the same App and router pattern.
