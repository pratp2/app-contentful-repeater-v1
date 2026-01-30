# Contributing to Contentful Repeater App

Thank you for considering contributing. This document covers branch naming, commit style, and how to open a Pull Request.

## Branch naming

Use short, descriptive branch names with a type prefix:

- **feature/** — New functionality (e.g. `feature/optional-validation`)
- **fix/** — Bug fixes (e.g. `fix/delete-button-spacing`)
- **docs/** — Documentation only (e.g. `docs/readme-setup`)
- **chore/** — Tooling, deps, config (e.g. `chore/upgrade-vite`)

Examples:

```text
feature/add-item-limit
fix/initial-value-sync
docs/contributing-guide
chore/update-deps
```

## Commit style

- Use the present tense, imperative mood: “Add feature” not “Added feature”.
- Keep the subject line to about 50 characters; add a body if you need to explain why.

Examples:

```text
Add CONTRIBUTING.md with branch and commit guidelines
Fix README upload command to use contentful:upload
Update React and Vite badges in README
```

Optionally, prefix the subject with a type (e.g. `feat:`, `fix:`, `docs:`, `chore:`) if you want to align with tools that parse conventional commits.

## Pull Request steps

1. **Fork** the repository and clone your fork.
2. **Create a branch** from the default branch using the naming above (e.g. `feature/your-change`).
3. **Make your changes** and run locally:
   - `npm run lint`
   - `npm test`
   - `npm run build`
4. **Commit** with a clear message following the commit style above.
5. **Push** your branch to your fork.
6. **Open a Pull Request** against the upstream default branch (e.g. `main` or `dev1.0`).
   - Use a descriptive title and, if needed, add a short description and link to any related issue.
7. Address any review feedback; maintainers may request changes before merging.

## Code and docs

- Follow the existing style (TypeScript, React, Forma 36).
- Add or update tests for behavior changes when relevant.
- Update README or other docs if you change setup, scripts, or usage.

## Questions

If something is unclear, open an issue with the “question” label or reach out to the maintainers listed in the README.
