# Test Mocks

- Shared test mocks for the workspace live here under `test/mocks`.
- Use `createMockFieldSdk()` to obtain a fresh `FieldAppSDK` mock for location (field) tests.
- Location-specific tests (e.g., complex setup only used by a single test file) may keep a local mock next to the test file — prefer re-using the shared mock factory when possible.

## Usage Example

```ts
import { createMockFieldSdk } from './test/mocks';

test('renders field with initial items', () => {
  const sdk = createMockFieldSdk({ fieldValue: [{ id: '1', key: 'k', value: 'v' }] });
  // render Field with sdk mock and assert behavior
});
```

## Notes

- Keep mocks minimal and focused on the API your component uses (e.g., `field.getValue()`, `field.setValue()`, `field.onValueChanged()`).
- Update mocks when the app SDK usage surface changes.
- Prefer deterministic mocks for unit tests; use integration-style tests sparingly for end-to-end flows.
