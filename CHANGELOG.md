# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Documentation: CONTRIBUTING.md, SECURITY.md, CHANGELOG.md, docs/ARCHITECTURE.md.
- API docs: `npm run docs:api` to generate TypeDoc output in `docs/api/`.

### Changed

- README: badges updated to React 19, Vite 7; upload command corrected to `npm run contentful:upload`.
- LICENSE: copyright holder aligned with package.json author.

---

## [0.1.0] - 2025-01-XX

### Added

- Repeater Field Contentful App: key-value pair management in the entry editor.
- Entry Field location with add, edit, delete for repeater items.
- Customizable "Value" column label via instance parameter `valueName`.
- Forma 36 UI, WCAG-oriented layout and ARIA.
- Structured logging (Pino), Vitest tests, ESLint + Prettier.

[Unreleased]: https://github.com/your-username/app-contentful-repeater-v1/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-username/app-contentful-repeater-v1/releases/tag/v0.1.0
