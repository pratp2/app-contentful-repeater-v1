import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Field from "./Field";
import { createMockFieldSdk } from "../../test/mocks/mockFieldSdk";

// Use shared Field SDK mock factory to keep tests consistent and avoid duplication
let mockSdk = createMockFieldSdk();

/**
 * Test suite for the Field component.
 * Verifies rendering, initialization, item management (add, update, delete),
 * and interactions with the Contentful App SDK.
 */
describe("Field Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Recreate a fresh SDK mock for each test to avoid cross-test state
    mockSdk = createMockFieldSdk();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Verifies that the component renders the initial UI elements correctly.
   * Checks that the "Add Item" button is present and the window auto-resizer is initialized.
   */
  it("renders correctly", () => {
    (mockSdk.field.getValue as any).mockReturnValue([]);
    (mockSdk.field.onValueChanged as any).mockImplementation(() => vi.fn());

    render(<Field sdk={mockSdk} />);

    expect(mockSdk.window.startAutoResizer).toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Add new item to repeater" }),
    ).toBeDefined();
  });

  /**
   * Tests that the component initializes the field value with an empty array
   * when the current field value is undefined or null on mount.
   */
  it("initializes with empty array if no value", () => {
    (mockSdk.field.getValue as any).mockReturnValue(undefined);
    (mockSdk.field.onValueChanged as any).mockImplementation(() => vi.fn());

    render(<Field sdk={mockSdk} />);

    expect(mockSdk.field.setValue).toHaveBeenCalledWith([]);
  });

  /**
   * Tests that the component renders existing items when the field has a pre-existing value.
   * Ensures that key and value inputs are populated correctly.
   */
  it("initializes with existing values", () => {
    const initialItems = [{ id: "1", key: "test-key", value: "test-val" }];
    (mockSdk.field.getValue as any).mockReturnValue(initialItems);
    (mockSdk.field.onValueChanged as any).mockImplementation((cb: any) => {
      // simulate immediate callback with initial value if needed,
      // or just let the component use getValue.
      // The component uses getValue inside useEffect only for logging?
      // No, it uses getValue to check if it's empty.
      // But local state is initialized to empty array [].
      // Wait, the component sets local state on mount ONLY via onValueChanged??
      // Let's check Field.tsx lines 126.
      // It subscribes to onValueChanged.
      // It DOES NOT set initial state from getValue() except for logging or if it matches something?
      // Actually, looking at Field.tsx:111: const [items, setItems] = useState<Item[]>([]);
      // And useEffect:
      // if (!props.sdk.field.getValue()) -> setValue([])
      // detachValueChangeHandler = props.sdk.field.onValueChanged((value) => setItems(value))

      // This means, the component EXPECTS onValueChanged to fire immediately with the current value
      // OR the component is relying solely on onValueChanged for initial data load?
      // Contentful SDK onValueChanged usually triggers with current value immediately?
      // Or user has to trigger it?
      // Usually, we should initialize state with getValue() if we want it immediately,
      // OR onValueChanged triggers.

      // Let's fix the test to simulate onValueChanged triggering.
      cb(initialItems);
      return vi.fn();
    });

    render(<Field sdk={mockSdk} />);

    // Check if items are rendered
    expect(screen.getByDisplayValue("test-key")).toBeDefined();
    expect(screen.getByDisplayValue("test-val")).toBeDefined();
  });

  /**
   * Tests the functionality of adding a new item.
   * Verifies that clicking the "Add Item" button triggers a setValue call with the new item included.
   */
  it("adds a new item", () => {
    (mockSdk.field.getValue as any).mockReturnValue([]);
    (mockSdk.field.onValueChanged as any).mockImplementation(() => vi.fn());

    render(<Field sdk={mockSdk} />);

    const addButton = screen.getByRole("button", {
      name: "Add new item to repeater",
    });
    fireEvent.click(addButton);

    // Should call setValue with an array of 1 item
    expect(mockSdk.field.setValue).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          key: "",
          value: "",
        }),
      ]),
    );
  });

  /**
   * Tests the functionality of updating an existing item's property.
   * Verifies that changing an input field triggers a setValue call with the updated data.
   */
  it("updates an item", () => {
    const initialItems = [{ id: "1", key: "k1", value: "v1" }];
    (mockSdk.field.getValue as any).mockReturnValue(initialItems);

    // We need to simulate that the component received the data
    // effectively setting local state.
    // Since we mocked onValueChanged to NOT fire automatically in this test unless we do it manually,
    // let's create a specialized mock for this test or use a slightly different approach.
    // The easiest is to make the mockSdk.field.onValueChanged call the callback immediately.
    (mockSdk.field.onValueChanged as any).mockImplementation(
      (cb: (value: any) => void) => {
        cb(initialItems);
        return vi.fn();
      },
    );

    render(<Field sdk={mockSdk} />);

    const keyInput = screen.getByDisplayValue("k1");
    fireEvent.change(keyInput, { target: { value: "k2" } });

    expect(mockSdk.field.setValue).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: "1", key: "k2", value: "v1" }),
      ]),
    );
  });

  /**
   * Tests the functionality of deleting an item.
   * Verifies that clicking the "Delete" button removes the item and updates the field value.
   */
  it("deletes an item", () => {
    const initialItems = [{ id: "1", key: "k1", value: "v1" }];
    (mockSdk.field.getValue as any).mockReturnValue(initialItems);
    (mockSdk.field.onValueChanged as any).mockImplementation(
      (cb: (value: any) => void) => {
        cb(initialItems);
        return vi.fn();
      },
    );

    render(<Field sdk={mockSdk} />);

    const deleteButton = screen.getByRole("button", {
      name: "Delete item, row 1",
    });
    fireEvent.click(deleteButton);

    expect(mockSdk.field.setValue).toHaveBeenCalledWith([]);
  });
});
