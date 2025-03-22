import { FieldAppSDK } from "@contentful/app-sdk";
import tokens from "@contentful/forma-36-tokens";
import React, { useEffect, useState } from "react";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import { PlusIcon } from "@contentful/f36-icons";
import { Flex, IconButton, Tooltip } from "@contentful/f36-components";
import { FormatBoldIcon, FormatItalicIcon } from "@contentful/f36-icons";
import { css } from "@emotion/css";

import {
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextInput,
} from "@contentful/f36-components";
import { v4 as uuid } from "uuid";

interface FieldProps {
  sdk: FieldAppSDK;
}

/** An Item which represents an list item of the repeater app */
interface Item {
  id: string;
  key: string;
  value: string;
}

/** A simple utility function to create a 'blank' item
 * @returns A blank `Item` with a uuid
 */
function createItem(): Item {
  return {
    id: uuid(),
    key: "",
    value: "",
  };
}

const styles = {
  editorToolbarContainer: css({
    backgroundColor: tokens.gray200,
    borderRadius: "6px 6px 0 0;",
  }),
};
/** The Field component is the Repeater App which shows up
 * in the Contentful field.
 *
 * The Field expects and uses a `Contentful JSON field`
 */
const Field = (props: FieldProps) => {
  const { valueName = "Value" } = props.sdk.parameters.instance as any;
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // This ensures our app has enough space to render
    props.sdk.window.startAutoResizer();

    // Every time we change the value on the field, we update internal state
    props.sdk.field.onValueChanged((value: Item[]) => {
      if (Array.isArray(value)) {
        setItems(value);
      }
    });
  });

  /** Adds another item to the list */
  const addNewItem = () => {
    props.sdk.field.setValue([...items, createItem()]);
  };

  /** Creates an `onChange` handler for an item based on its `property`
   * @returns A function which takes an `onChange` event
   */
  const createOnChangeHandler =
      (item: Item, property: "key" | "value") =>
          (e: React.ChangeEvent<HTMLInputElement>) => {
            const itemList = items.concat();
            const index = itemList.findIndex((i) => i.id === item.id);

            itemList.splice(index, 1, { ...item, [property]: e.target.value });

            props.sdk.field.setValue(itemList);
          };

  /** Deletes an item from the list */
  const deleteItem = (item: Item) => {
    props.sdk.field.setValue(items.filter((i) => i.id !== item.id));
  };

  return (
      <div>
        <Table>
          <TableBody>
            {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <TextInput
                        id="key"
                        name="key"
                        placeholder="Item Name"
                        value={item.key}
                        onChange={createOnChangeHandler(item, "key")}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                        id="value"
                        name="value"
                        placeholder={valueName}
                        value={item.value}
                        onChange={createOnChangeHandler(item, "value")}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Flex
                        justifyContent="space-between"
                        className={styles.editorToolbarContainer}
                        padding="spacingXs"
                    >
                      <Flex
                          flexDirection="row"
                          justifyContent="center"
                          alignItems="center"
                      >
                        <Tooltip
                            placement="right"
                            id="tip1"
                            targetWrapperClassName="targetWrapperClassName"
                            content="Bold"
                        >
                          <IconButton
                              icon={<FormatBoldIcon size="small" />}
                              variant="transparent"
                              size="small" aria-label={""}                      />
                        </Tooltip>
                        <Tooltip
                            placement="right"
                            id="tip2"
                            targetWrapperClassName="targetWrapperClassName"
                            content="Italic"
                        >
                          <IconButton
                              icon={<FormatItalicIcon size="small" />}
                              variant="transparent"
                              size="small" aria-label={""}                      />
                        </Tooltip>
                      </Flex>
                      <Button  onClick={() => deleteItem(item)}>Example Delete

                      </Button>
                    </Flex>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
            variant="primary"
            startIcon={<PlusIcon />}
            onClick={addNewItem}
            style={{ marginTop: tokens.spacingS }}
        >
          Add Item
        </Button>
      </div>
  );
};

export default Field;
