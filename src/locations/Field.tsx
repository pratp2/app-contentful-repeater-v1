import { FieldAppSDK } from "@contentful/app-sdk";
import tokens from "@contentful/forma-36-tokens";
import React, { useEffect, useState } from "react";
import { PlusIcon } from "@contentful/f36-icons";
import { Flex, IconButton, Tooltip, Button, Table, TableBody, TableRow, TableCell, TextInput } from "@contentful/f36-components";
import { FormatBoldIcon, FormatItalicIcon } from "@contentful/f36-icons";
import { css } from "@emotion/css";
import { v4 as uuid } from "uuid";

interface FieldProps {
    sdk: FieldAppSDK;
}

interface Item {
    id: string;
    key: string;
    value: string;
}

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

const Field = (props: FieldProps) => {
    const { valueName = "Value" } = props.sdk.parameters.instance as any;
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        props.sdk.window.startAutoResizer();

        // Initialize the field value if it's empty
        if (!props.sdk.field.getValue()) {
            props.sdk.field.setValue([]);
        }

        // Listen for changes to the field value
        const detachValueChangeHandler = props.sdk.field.onValueChanged((value: Item[]) => {
            if (Array.isArray(value)) {
                setItems(value);
            }
        });

        // Cleanup the listener on unmount
        return () => {
            detachValueChangeHandler();
        };
    }, [props.sdk.field]);

    const addNewItem = () => {
        const newItem = createItem();
        const updatedItems = [...items, newItem];
        props.sdk.field.setValue(updatedItems);
    };

    const createOnChangeHandler =
        (item: Item, property: "key" | "value") =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const updatedItems = items.map((i) =>
                    i.id === item.id ? { ...i, [property]: e.target.value } : i
                );
                setItems(updatedItems); // Update local state
                props.sdk.field.setValue(updatedItems); // Update Contentful field value
            };

    const deleteItem = (item: Item) => {
        const updatedItems = items.filter((i) => i.id !== item.id);
        setItems(updatedItems); // Update local state
        props.sdk.field.setValue(updatedItems); // Update Contentful field value
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
                                                size="small"
                                                aria-label="Bold"
                                            />
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
                                                size="small"
                                                aria-label="Italic"
                                            />
                                        </Tooltip>
                                    </Flex>
                                    <Button onClick={() => deleteItem(item)}>Delete</Button>
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