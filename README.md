# Contentful Repeater App (v1)

![Contentful App](https://img.shields.io/badge/Contentful-App-blue?style=for-the-badge&logo=contentful)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<!-- Featured screenshot -->
![Repeater UI](./Repeater_v2.JPG)

A polished Contentful App that adds a configurable "Repeater" field to your content model. Editors can create, edit, delete and reorder key/value items directly inside the Contentful entry editor. Reordering is implemented via Forma 36's DragHandle for a native, accessible drag-and-drop experience.

---

## Features

- Dynamic key/value list management: add, edit, and delete items.
- Drag-and-drop reordering: use the Forma 36 DragHandle to reorder rows; the field preserves stable item ids during moves.
- Native UI: built with `@contentful/f36-components` to match the Contentful editor.
- Automatic resizing: the app adjusts its iframe height to fit content for a seamless editing experience.
- Configurable labels: update the "Value" label via the `valueName` instance parameter (e.g., "URL", "Description").
- Robust state handling and validation to maintain data integrity.
- Structured logging for easier debugging and observability.

## Tech stack

- Framework: React + TypeScript
- Build tool: Vite
- UI system: Contentful Forma 36 (F36)
- State management: React hooks + Contentful App SDK
- Testing: Vitest + React Testing Library

---

## Installation and Setup

### Prerequisites

- Node.js (matching package.json engine, e.g., >=24)
- A Contentful account and a Space
- Contentful CLI (optional for uploads): `npm install -g contentful-cli`

1. Clone the repository

```bash
git clone https://github.com/pratp2/app-contentful-repeater-v1.git
cd app-contentful-repeater-v1
```

2. Install dependencies

```bash
npm install
```

3. Run locally

Start the development server:

```bash
npm start
```

The app is intended to be embedded in Contentful's entry editor (iframe). Opening the dev URL directly may display a localhost warning; this is expected for standalone browsing.

---

## Contentful Configuration

To use the app inside Contentful, create an App Definition and install it into your space.

1. Create an App Definition in Contentful (Organization Settings → Apps → Create App).
2. Set the App URL to your dev or production URL (for local testing, use `http://localhost:3000`).
3. Register the Location: enable the Entry Field location and select JSON Object as the field type.
4. (Optional) Add an instance parameter to customize the value label:
   - **ID:** `valueName`
   - **Name:** Value Field Label
   - **Type:** Text
   - **Default:** Value

Install the app and add it to a JSON Object field in your content model via the Appearance tab.

---

## Development

### Useful developer commands

```bash
# Install
npm install

# Typecheck
npm run typecheck

# Format (prettier)
npm run format

# Lint (eslint + prettier)
npm run lint

# Run tests
npm test
```

### Running tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Project structure

```
src/
├── components/       # Shared UI components (e.g., LocalhostWarning)
├── locations/        # Main app locations (Field entry point)
│   ├── Field.tsx     # Core Repeater Field logic
│   └── Field.test.tsx# Unit tests for the Field component
├── utils/            # Helper functions and logging
├── App.tsx           # Router for Contentful locations
└── index.tsx         # Application bootstrap
```

---

## Deployment

- Build the project:

```bash
npm run build
```

- The build output is placed in `dist/`. Host the static files on a platform of your choice (Vercel, Netlify, S3, etc.) and update the App Definition URL to point to the production URL.

- Alternatively, use the included Contentful app scripts to upload the bundle:

```bash
npm run contentful:upload
```

---

## Documentation and Contributing

- See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
- See [CHANGELOG.md](CHANGELOG.md) for release notes.
- See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for architecture notes.
- Generate API documentation with `npm run docs:api` (output → `docs/api/`).

---

## Author

Prem Pratick Kumar

## License

MIT License — see the `LICENSE` file for details.
