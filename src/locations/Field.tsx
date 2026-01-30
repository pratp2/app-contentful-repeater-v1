import React, { useCallback, useEffect, useState } from "react";
import { FieldAppSDK } from "@contentful/app-sdk";
import {
  Button,
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
  /* Explicit spacer so Delete button never touches Value column */
  spacerBeforeDelete: css({
    width: tokens.spacingXl,
    minWidth: tokens.spacingXl,
    flexShrink: 0,
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
   *
   * @param {Item[]} updatedItems - The new list of items to save.
   */
  const updateFieldValue = useCallback(
    (updatedItems: Item[]) => {
      setItems(updatedItems);
      sdk.field.setValue(updatedItems);
    },
    [sdk.field],
  );

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
            <TableRow key={item.id}>
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
                  <Flex justifyContent="flex-end" gap="spacingM">
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
