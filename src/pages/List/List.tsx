import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import getStackId from '../../utils/localStorageStackId';

import { useParams } from 'react-router-dom';

import Modal from '../../components/Modal';
import Button from '../../components/Button';
import CreateOrEditItemForm from '../../components/CreateOrEditItemForm';
import Layout from '../../components/Layout';
import ListItem from '../../components/ListItem';
import useKeyboardPress from '../../hooks/useKeyboardPress';

import {
    Action,
    EActions,
    EditAction,
    TReceiver,
    UndoRedo,
} from '../../utils/Stack';
import { TodoItem, TodoList } from '../Home/Home';

const List: React.FC = () => {
    const [todoList, setTodoList] = useState<TodoList | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [focusedItemIndex, setFocusedItemIndex] = useState<number| null>(null);
    const [shouldDisplayRedo, setShouldDisplayRedo] = useState<boolean>(false);

    const itemToEditIndex = useRef<number | null>(null);
    const isUndoRedoAction = useRef<boolean>(false);
    const lastAction = useRef<Action | null>(null);
    const metaKeyIsPressed = useRef<boolean>(false);

    const { listId } = useParams();

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const deleteItem = (item: TodoItem, itemIndex: number) => {
        setTodoList((prev) => {
            if (prev) {
                const newItemsList: TodoItem[] = [
                    ...prev?.items.slice(0, itemIndex),
                    ...prev?.items.slice(itemIndex + 1),
                ];

                // this side-effect probably shouldn't be here, but in an effect hook?
                lastAction.current = {
                    index: itemIndex,
                    type: EActions.Remove,
                    value: item,
                };

                const todoListCopy: TodoList = { ...prev, items: newItemsList };

                return todoListCopy;
            } else {
                return prev;
            }
        });
    };

    const createNewItem = (newTodoItem: TodoItem, itemIndex: number | null = null) => {
        setTodoList((prev) => {
            if (prev) {
                const indexToUse = typeof itemIndex === 'number' ? itemIndex : prev.items.length;
                const newItemList: TodoItem[] = [...prev?.items];

                newItemList.splice(indexToUse, 0, newTodoItem);

                const listCopy: TodoList = {
                    ...prev,
                    items: newItemList,
                };

                // this side-effect probably shouldn't be here, but in an effect hook
                lastAction.current = {
                    index: prev.items.length,
                    type: EActions.Add,
                    value: newTodoItem,
                };

                return listCopy;
            } else {
                return prev;
            }
        });
    };

    const handleEditBtnClick = (itemIndex: number) => {
        // todo: hook 1, extract this into a separate hook (also search for hook 2)
        itemToEditIndex.current = itemIndex;
        openModal();
    };

    const saveEditedItem = (editedItem: TodoItem, index: number | null = null) => {
        setTodoList((prev) => {
            const indexToUse = typeof index === 'number' ? index : itemToEditIndex.current;
            
            if (prev && indexToUse !== null) {
                const editedItemList: TodoItem[] = [
                    ...prev.items.slice(0, indexToUse),
                    editedItem,
                    ...prev.items.slice(indexToUse + 1),
                ];

                lastAction.current = {
                    index: indexToUse,
                    type: EActions.Edit,
                    value: editedItem,
                    previousValue: prev.items[indexToUse],
                };

                const listCopy: TodoList = {
                    ...prev,
                    items: editedItemList,
                };

                return listCopy;
            } else {
                return prev;
            }
        });
    };

    const receiver: TReceiver = useMemo(() => ({
        [EActions.Add]: {
            execute: (action) => createNewItem((action.value as TodoItem), action.index),
            undo: (action) => deleteItem((action.value as TodoItem), action.index),
        },
        [EActions.Remove]: {
            execute: (action) => deleteItem((action.value as TodoItem), action.index),
            undo: (action) => createNewItem((action.value as TodoItem), action.index),
        },
        [EActions.Edit]: {
            execute: (action: EditAction) => saveEditedItem((action.value as TodoItem), action.index),
            undo: (action: EditAction) => saveEditedItem((action.previousValue as TodoItem), action.index),
        },
    }), []);

    const undoRedo = useRef<UndoRedo>(new UndoRedo(receiver));
    const undoRedoDecorator = (type: 'undo' | 'redo') => {
        return () => {
            isUndoRedoAction.current = true;
            undoRedo.current[type]();
        };
    };

    const undo = undoRedoDecorator('undo');
    const redo = undoRedoDecorator('redo');

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey) {
            metaKeyIsPressed.current = true;

            if (typeof focusedItemIndex === 'number') {
                e.preventDefault();
            }
        }  
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (metaKeyIsPressed.current) {
            e.preventDefault();
            metaKeyIsPressed.current = false;

            if (typeof focusedItemIndex === 'number') {
                const todoItem = todoList?.items[focusedItemIndex];
                
                if (e.code === 'Backspace') {
                    deleteItem(todoItem!, focusedItemIndex);
                } else if (e.code === 'KeyE') {
                    handleEditBtnClick(focusedItemIndex);
                } else if (e.code === 'KeyF') {
                    saveEditedItem(
                        { ...todoItem!, isDone: !todoItem!.isDone },
                        focusedItemIndex
                    );
                }
            }
            
            if (e.code === 'Enter') {
                openModal();
            } else if (e.code === 'KeyZ') {
                undo();
            } else if (e.code === 'KeyY') {
                redo();
            }
        }
    };

    useEffect(() => {
        // on every change of todoList state, save the change for that list to localStorage
        const todoListsFromMemory: TodoList[] = JSON.parse(localStorage.getItem('todoLists')  || '[]');

        if (todoListsFromMemory.length) {
            const currentListIndex = todoListsFromMemory.findIndex((list) => list.id === listId);

            if (currentListIndex !== -1 && todoList) {
                todoListsFromMemory[currentListIndex] = todoList;

                localStorage.setItem('todoLists', JSON.stringify(todoListsFromMemory));
            }
        }

        if (!isUndoRedoAction.current && lastAction.current) {
            undoRedo.current.pushNewUndoAction(lastAction.current);
            undoRedo.current.redoStack.empty();
        }

        if (isUndoRedoAction.current) isUndoRedoAction.current = false;

        localStorage.setItem(getStackId('undo', listId!), JSON.stringify(undoRedo.current.undoStack.instance));
        localStorage.setItem(getStackId('redo', listId!), JSON.stringify(undoRedo.current.redoStack.instance));

        setShouldDisplayRedo(undoRedo.current.redoStack.isEmpty);
        closeModal();
    }, [todoList, listId]);

    useEffect(() => {
        if (!modalIsOpen) {
            // todo: hook2 extract this into the same hook as hook 1
            if (typeof itemToEditIndex.current === 'number' ) {
                itemToEditIndex.current = null;
            }
        }
    }, [modalIsOpen]);

    useLayoutEffect(() => {
        const todoListsFromMemory: TodoList[] = JSON.parse(localStorage.getItem('todoLists')  || '[]');
        const currentList = todoListsFromMemory.find((list) => list.id === listId);

        if (currentList) setTodoList(currentList);

        const undoStackFromMemory: Action[] = JSON.parse(localStorage.getItem(getStackId('undo', listId!)) || '[]');
        const redoStackFromMemory: Action[] = JSON.parse(localStorage.getItem(getStackId('redo', listId!)) || '[]');
        
        undoRedo.current = new UndoRedo(receiver, undoStackFromMemory, redoStackFromMemory);
    }, [listId, receiver]);

    useKeyboardPress(handleKeyUp, handleKeyDown);

    return (
        <Layout>
            <h1>List: {todoList?.name}</h1>
            <Button
                text="Undo"
                disabled={undoRedo.current.undoStack.isEmpty}
                onClick={undo}
            />
            <Button
                text="Redo"
                disabled={shouldDisplayRedo}
                onClick={redo}
            />
            <ul>
                {todoList?.items.length ? (
                    todoList.items.map((item, index) => (
                        <ListItem
                            key={item.id}
                            item={item}
                            onFocus={() => setFocusedItemIndex(index)}
                            onDeleteBtnClick={() => deleteItem(item, index)}
                            onEditBtnClick={() => handleEditBtnClick(index)}
                            onToggleDoneBtnClick={() => saveEditedItem({ ...item, isDone: !item.isDone}, index)}
                        />
                    ))
                ) : (
                    <h2>No items yet...</h2>
                )}
            </ul>
            <button onClick={openModal}>Create new</button>
            <Modal
                isOpen={modalIsOpen}
                close={closeModal}
            >
                {
                    itemToEditIndex.current !== null ? (
                        <CreateOrEditItemForm
                            onSubmit={saveEditedItem}
                            itemToEdit={todoList?.items[itemToEditIndex.current]}
                        />
                    ) : (
                        <CreateOrEditItemForm onSubmit={createNewItem} />
                    )
                }
            </Modal>
        </Layout>
    );
};

export default List;
