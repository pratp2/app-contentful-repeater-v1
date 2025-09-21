import {FieldAppSDK} from "@contentful/app-sdk";
import tokens from "@contentful/forma-36-tokens";
import React, {useEffect, useState} from "react";
import {XIcon , PlusIcon} from "@contentful/f36-icons";
import {Button, Flex, Table, TableBody, TableCell, TableRow, TextInput} from "@contentful/f36-components";
import {css} from "@emotion/css";
import {v4 as uuid} from "uuid";

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
    table: css({
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: tokens.spacingM,
    }),
    tableHeader: css({
        backgroundColor: tokens.gray100,
        fontWeight: tokens.fontWeightDemiBold,
    }),
    tableCell: css({
        padding: tokens.spacingM,
        borderBottom: `1px solid ${tokens.gray300}`,
    }),
    input: css({
        width: "100%",
    }),
    deleteButton: css({
        marginLeft: tokens.spacingM,
    }),
    addButton: css({
        marginTop: tokens.spacingM,
    }),
};

const Field = (props: FieldProps) => {
    const {valueName = "Value"} = props.sdk.parameters.instance as any;
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
                    i.id === item.id ? {...i, [property]: e.target.value} : i
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
            <Table className={styles.table}>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className={styles.tableCell}>
                                <TextInput
                                    id="key"
                                    name="key"
                                    placeholder="Item Name"
                                    value={item.key}
                                    onChange={createOnChangeHandler(item, "key")}
                                    className={styles.input}
                                />
                            </TableCell>
                            <TableCell className={styles.tableCell}>
                                <TextInput
                                    id="value"
                                    name="value"
                                    placeholder={valueName}
                                    value={item.value}
                                    onChange={createOnChangeHandler(item, "value")}
                                    className={styles.input}
                                />
                            </TableCell>
                            <TableCell className={styles.tableCell} align="right">
                                <Flex justifyContent="flex-end">
                                    <Button
                                        variant="negative" // Red button
                                        startIcon={<XIcon />}
                                        onClick={() => deleteItem(item)}
                                        className={styles.deleteButton}
                                    >
                                        Delete
                                    </Button>
                                </Flex>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button
                variant="primary" // Blue button
                startIcon={<PlusIcon/>}
                onClick={addNewItem}
                className={styles.addButton}
            >
                Add Item
            </Button>
        </div>
    );
};

export default Field;