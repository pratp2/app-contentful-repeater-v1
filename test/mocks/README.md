Test mocks ⛑️

- Shared test mocks for the workspace live here under `test/mocks`.
- Use `createMockFieldSdk()` to obtain a fresh `FieldAppSDK` mock for location (field) tests.
- Location-specific tests (e.g. complex setup only used by a single test file) may keep a local/mock next to the test file — prefer re-using the shared mock factory when possible.
