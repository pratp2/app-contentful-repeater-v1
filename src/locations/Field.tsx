import React, { useCallback, useEffect, useRef, useState } from "react";
import { FieldAppSDK } from "@contentful/app-sdk";
import {
  Button,
  DragHandle,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextInput,
} from "@contentful/f36-components";
import { PlusIcon, XIcon } from "@contentful/f36-icons";
import tokens from "@contentful/forma-36-tokens";
import { css } from "@emotion/css";
import { v4 as uuid } from "uuid";

import { logDebug, logInfo } from "../utils/logger";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

/**
 * Props passed to the Field component by the Contentful App SDK.
 */
interface FieldProps {
  /** The SDK instance provided by Contentful. */
  sdk: FieldAppSDK;
}

/**
 * Represents a single row in the repeater field.
 */
interface Item {
  /** Unique identifier for the item (UUID). */
  id: string;
  /** The key or name of the item. */
  key: string;
  /** The value associated with the item. */
  value: string;
}

/**
 * Configuration parameters defined in the Contentful App definition.
 */
interface InstanceParameters {
  /** Custom label for the "Value" column header. Defaults to "Value". */
  valueName?: string;
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

/**
 * Generates a new empty item with a unique ID.
 *
 * @returns {Item} A new item object with empty key/value and a generated UUID.
 */
const createItem = (): Item => ({
  id: uuid(),
  key: "",
  value: "",
});

/* -------------------------------------------------------------------------- */
/*                                    Styles                                  */
/* -------------------------------------------------------------------------- */

/**
 * CSS styles for the component using Emotion.
 */
const styles = {
  /* border-spacing: horizontal gap between columns, vertical gap between rows (reduced) */
  table: css({
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: `${tokens.spacingM} ${tokens.spacingM}`,
    marginBottom: tokens.spacingL,
    "& td, & th": {
      verticalAlign: "middle",
      borderBottom: "none",
    },
    "& tbody td": {
      borderBottom: `1px solid ${tokens.gray300}`,
    },
    "& thead th": {
      borderBottom: `2px solid ${tokens.gray300}`,
    },
  }),
  headerCell: css({
    padding: `${tokens.spacingS} ${tokens.spacingM}`,
    fontWeight: 600,
    color: tokens.gray700,
  }),
  /* Wrapper divs guarantee visible spacing (not overridden by F36); reduced vertical padding */
  cellWrapper: css({
    padding: `${tokens.spacingM} ${tokens.spacingM}`,
    minHeight: "44px",
    boxSizing: "border-box",
  }),
  cellWrapperItemName: css({
    paddingRight: tokens.spacingL,
    minWidth: "140px",
  }),
  cellWrapperValue: css({
    paddingLeft: tokens.spacingL,
    paddingRight: tokens.spacingXl,
    minWidth: "140px",
  }),
  cellWrapperActions: css({
    paddingLeft: tokens.spacing2Xl,
    minWidth: "120px",
    whiteSpace: "nowrap",
  }),
  /* Slight spacing for the drag handle */
  dragHandleSpacing: css({
    marginRight: tokens.spacingS,
    display: "inline-flex",
    verticalAlign: "middle",
  }),
  /* Explicit spacer so Delete button never touches Value column */
  spacerBeforeDelete: css({
    width: tokens.spacingXl,
    minWidth: tokens.spacingXl,
    flexShrink: 0,
  }),
  /* Drag state highlight for the target row */
  dragOverRow: css({
    backgroundColor: tokens.colorElementLightest,
  }),
  input: css({
    width: "100%",
  }),
  deleteButton: css({
    marginLeft: tokens.spacingXl,
  }),
  addButton: css({
    marginTop: tokens.spacingL,
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

/**
 * The main Repeater Field component.
 *
 * This component renders a table of key-value pairs that can be added, edited, and deleted.
 * It synchronizes the state with the Contentful Field API and handles auto-resizing.
 *
 * @param {FieldProps} props - The component props containing the Contentful SDK.
 * @returns {JSX.Element} The rendered Repeater Field component.
 */
const Field: React.FC<FieldProps> = ({ sdk }) => {
  const { valueName = "Value" } = sdk.parameters.instance as InstanceParameters;

  const [items, setItems] = useState<Item[]>([]);
  const dragIndexRef = useRef<number | null>(null);

  /* ---------------------------- Initialization ---------------------------- */

  useEffect(() => {
    sdk.window.startAutoResizer();
    logInfo("Repeater field mounted");

    const initialValue = sdk.field.getValue() as Item[] | undefined;

    if (Array.isArray(initialValue)) {
      setItems(initialValue);
      logDebug("Loaded existing field value", {
        itemCount: initialValue.length,
      });
    } else {
      sdk.field.setValue([]);
      logDebug("Initialized empty field value");
    }

    const detach = sdk.field.onValueChanged((value) => {
      if (Array.isArray(value)) {
        setItems(value);
        logDebug("External field update detected", {
          itemCount: value.length,
        });
      }
    });

    return () => {
      detach();
      logInfo("Repeater field unmounted");
    };
  }, [sdk]);

  /* ----------------------------- Event Handlers ---------------------------- */

  /**
   * Updates the local state and the Contentful field value.
   */
  const updateFieldValue = useCallback(
    (updatedItems: Item[]) => {
      setItems(updatedItems);
      sdk.field.setValue(updatedItems);
    },
    [sdk.field],
  );

  /* -------------------------- Drag-and-drop handlers ------------------------- */

  const handleDragStart = useCallback(
    (event: React.DragEvent, index: number) => {
      dragIndexRef.current = index;
      const id = items[index]?.id || "";
      event.dataTransfer.setData("text/plain", id);
      event.dataTransfer.effectAllowed = "move";
    },
    [items],
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent, targetIndex: number) => {
      event.preventDefault();

      // Decide whether the drop occurred on the top or bottom half of the row
      const rowEl = event.currentTarget as HTMLElement;
      const rect = rowEl.getBoundingClientRect();
      const dropAfter = event.clientY > rect.top + rect.height / 2;

      // desiredIndexOriginal is the intended index in the original array (before removal)
      const desiredIndexOriginal = dropAfter ? targetIndex + 1 : targetIndex;

      const draggedId = event.dataTransfer.getData("text/plain");
      const fromIndex = items.findIndex((i) => i.id === draggedId);
      if (fromIndex === -1) {
        if (dragIndexRef.current == null) return;
      }
      const actualFrom =
        fromIndex === -1 ? (dragIndexRef.current as number) : fromIndex;

      // Build the array after removing the moved item
      const withoutMoved = items.filter((_, i) => i !== actualFrom);

      // Compute insertion index into the post-removal array
      // If the source was before the desired position in the original array,
      // the removal shifts indexes left by 1, so subtract 1.
      let insertionIndex = desiredIndexOriginal;
      if (actualFrom < desiredIndexOriginal) {
        insertionIndex = desiredIndexOriginal - 1;
      }

      // Clamp insertionIndex to valid range
      insertionIndex = Math.max(
        0,
        Math.min(insertionIndex, withoutMoved.length),
      );

      // No-op if position doesn't change
      if (
        insertionIndex === actualFrom ||
        (actualFrom === insertionIndex && !dropAfter)
      ) {
        dragIndexRef.current = null;
        return;
      }

      // Rebuild list with moved item inserted
      const moved = items[actualFrom];
      const updated = [
        ...withoutMoved.slice(0, insertionIndex),
        moved,
        ...withoutMoved.slice(insertionIndex),
      ];

      logInfo("Item dropped", { from: actualFrom, to: insertionIndex });
      updateFieldValue(updated);
      dragIndexRef.current = null;
    },
    [items, updateFieldValue],
  );

  const handleDragEnd = useCallback(() => {
    dragIndexRef.current = null;
  }, []);

  /* ----------------------------- Action Handlers ---------------------------- */

  /**
   * Adds a new empty item to the repeater list.
   */
  const handleAddItem = useCallback(() => {
    const updatedItems = [...items, createItem()];
    logInfo("Item added", { totalItems: updatedItems.length });
    updateFieldValue(updatedItems);
  }, [items, updateFieldValue]);

  /**
   * Creates a change handler for a specific item and property.
   *
   * @param {string} itemId - The unique ID of the item to update.
   * @param {keyof Omit<Item, "id">} property - The property ("key" or "value") to update.
   * @returns {React.ChangeEventHandler<HTMLInputElement>} The event handler function.
   */
  const handleChange =
    (itemId: string, property: keyof Omit<Item, "id">) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedItems = items.map((item) =>
        item.id === itemId ? { ...item, [property]: event.target.value } : item,
      );

      logDebug("Item updated", { itemId, property });
      updateFieldValue(updatedItems);
    };

  /**
   * Deletes an item from the repeater list by its ID.
   *
   * @param {string} itemId - The unique ID of the item to delete.
   */
  const handleDelete = useCallback(
    (itemId: string) => {
      const updatedItems = items.filter((item) => item.id !== itemId);
      logInfo("Item deleted", { remainingItems: updatedItems.length });
      updateFieldValue(updatedItems);
    },
    [items, updateFieldValue],
  );

  /* ---------------------------------- UI ---------------------------------- */

  return (
    <>
      <Table
        className={styles.table}
        aria-label="Repeater items: key-value pairs"
      >
        <TableHead>
          <TableRow>
            <TableCell className={styles.headerCell}>Item Name</TableCell>
            <TableCell className={styles.headerCell}>{valueName}</TableCell>
            <TableCell className={styles.headerCell} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={item.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={
                dragIndexRef.current !== null && dragIndexRef.current !== index
                  ? styles.dragOverRow
                  : undefined
              }
            >
              <TableCell>
                <div
                  className={`${styles.cellWrapper} ${styles.cellWrapperItemName}`}
                >
                  <TextInput
                    placeholder="Item Name"
                    value={item.key}
                    onChange={handleChange(item.id, "key")}
                    className={styles.input}
                    aria-label={`Item name, row ${index + 1}`}
                  />
                </div>
              </TableCell>

              <TableCell>
                <div
                  className={`${styles.cellWrapper} ${styles.cellWrapperValue}`}
                >
                  <TextInput
                    placeholder={valueName}
                    value={item.value}
                    onChange={handleChange(item.id, "value")}
                    className={styles.input}
                    aria-label={`${valueName}, row ${index + 1}`}
                  />
                </div>
              </TableCell>

              <TableCell align="right">
                <div
                  className={`${styles.cellWrapper} ${styles.cellWrapperActions}`}
                >
                  <Flex
                    justifyContent="flex-end"
                    gap="spacingM"
                    alignItems="center"
                  >
                    {/* Drag handle (Forma 36) - only this element initiates the drag */}
                    <span className={styles.dragHandleSpacing}>
                      <DragHandle
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        label={`Drag to reorder, row ${index + 1}`}
                        title="Drag to reorder"
                      />
                    </span>

                    <span
                      className={styles.spacerBeforeDelete}
                      aria-hidden="true"
                    />
                    <Button
                      variant="negative"
                      startIcon={<XIcon />}
                      onClick={() => handleDelete(item.id)}
                      className={styles.deleteButton}
                      aria-label={`Delete item, row ${index + 1}`}
                    >
                      Delete
                    </Button>
                  </Flex>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        variant="primary"
        startIcon={<PlusIcon />}
        onClick={handleAddItem}
        className={styles.addButton}
        aria-label="Add new item to repeater"
      >
        Add Item
      </Button>
    </>
  );
};

export default Field;
