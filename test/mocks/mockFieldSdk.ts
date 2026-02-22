import { vi } from 'vitest';
import type { FieldAppSDK } from '@contentful/app-sdk';

/**
 * Factory that returns a fresh mock implementation of the Contentful Field App SDK.
 * Use this in tests so each test can get a clean instance and avoid duplicated inline mocks.
 */
export function createMockFieldSdk(overrides: Partial<FieldAppSDK> = {}) {
  const sdk: any = {
    field: {
      getValue: vi.fn(),
      setValue: vi.fn(),
      onValueChanged: vi.fn(),
    },
    window: {
      startAutoResizer: vi.fn(),
    },
    parameters: {
      instance: {
        valueName: 'Test Value',
      },
    },
    ...overrides,
  };

  return sdk as FieldAppSDK;
}
