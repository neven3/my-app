import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Modal from 'react-modal';
import getStackId from '../../utils/localStorageStackId';

import { useParams } from 'react-router-dom';

import Button from '../../components/Button';
import CreateItemForm from '../../components/CreateItemForm';
import EditItemForm from '../../components/EditItemForm';
import Layout from '../../components/Layout';

import {
    Action,
    EActions,
    EditAction,
    TReceiver,
    UndoRedo,
} from '../../utils/Stack';
import { TodoItem, TodoList } from '../Home/Home';

Modal.setAppElement('#root');

const List: React.FC = () => {
    const [todoList, setTodoList] = useState<TodoList | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const shouldDisplayEditForm = useRef<boolean>(false);
    const itemToEditIndex = useRef<number | null>(null);
    const isUndoRedoAction = useRef<boolean>(false);
    const lastAction = useRef<Action | null>(null);

    const { listId } = useParams();

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const deleteItem = (item: TodoItem, itemIndex: number) => {
        setTodoList((prev) => {
            if (prev) {
                const newItemsList: TodoItem[] = [
                    ...prev?.items.slice(0, itemIndex),
                    ...prev?.items.slice(itemIndex + 1)
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
        shouldDisplayEditForm.current = true;
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

    // todo: maybe change this to use useState hook
    const undoRedo = useRef<UndoRedo>(new UndoRedo(receiver));
    
    useEffect(() => {
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
        }

        if (isUndoRedoAction.current) isUndoRedoAction.current = false;

        localStorage.setItem(getStackId('undo', listId!), JSON.stringify(undoRedo.current.undoStack.instance));
        localStorage.setItem(getStackId('redo', listId!), JSON.stringify(undoRedo.current.redoStack.instance));

        closeModal();
    }, [todoList, listId]);

    useEffect(() => {
        if (!modalIsOpen) {
            // todo: hook2 extract this into the same hook as hook 1
            if (typeof itemToEditIndex.current === 'number' ) {
                itemToEditIndex.current = null;
            }

            if (shouldDisplayEditForm.current) {
                shouldDisplayEditForm.current = false;
            }
        }
    }, [modalIsOpen]);

    useLayoutEffect(() => {
        const todoListsFromMemory: TodoList[] = JSON.parse(localStorage.getItem('todoLists')  || '[]');
    
        if (todoListsFromMemory.length) {
            const currentList = todoListsFromMemory.find((list) => list.id === listId);

            if (currentList) setTodoList(currentList);
        }

        const undoStackFromMemory: Action[] = JSON.parse(localStorage.getItem(getStackId('undo', listId!)) || '[]');

        const redoStackFromMemory: Action[] = JSON.parse(localStorage.getItem(getStackId('redo', listId!)) || '[]');
        
        undoRedo.current = new UndoRedo(receiver, undoStackFromMemory, redoStackFromMemory);

    }, [listId, receiver]);

    // todo: keyboard shortcuts
    // useEffect(() => {
    //     document.addEventListener('keydown', (e) => {  
            
    //         console.log({ meta: e.metaKey, ctrl: e.ctrlKey });
            
    //         if ((e.metaKey || e.ctrlKey) && e.code === 'Backspace') {
    //             e.preventDefault();
    //             console.log('fire!')
    //             console.log({ meta: e.metaKey, ctrl: e.ctrlKey });
    //         }  
    //     });
    // });

    return (
        <Layout>
            <h1>List: {todoList?.name}</h1>
            <button
                disabled={undoRedo.current.undoStack.isEmpty}
                onClick={() => {
                    isUndoRedoAction.current = true;
                    undoRedo.current.undo();
                }}
            >
                Undo
            </button>
            <button
                disabled={undoRedo.current.redoStack.isEmpty}
                onClick={() => {
                    isUndoRedoAction.current = true;
                    undoRedo.current.redo();
                }}
            >
                Redo
            </button>
            <ul>
                {todoList?.items.length ? (
                    todoList.items.map((item, index) => (
                        // todo: this should be a separate component
                        <li
                            style={{ marginBottom: '10px' }}
                            onFocus={() => console.log(item.name)}
                            tabIndex={0}
                            key={item.id}
                        >
                            <span style={{ margin: '10px' }}>{item.name}</span>
                            <span style={{ margin: '10px' }}>{item.isDone ? 'Done' : 'Not done'}</span>
                            {/* todo: extract this into a function or something */}
                            {item.dueDate && <span style={{ margin: '10px' }}>Due by: {item.dueDate.replaceAll('-', '/').split('T').join(' at ')}</span>}
                            {/* todo: extract these handlers into functions */}
                            <Button text="Edit" onClick={() => handleEditBtnClick(index)} />
                            <Button
                                text={`Mark as ${item.isDone ? 'not' : ''} done`}
                                onClick={() => saveEditedItem({ ...item, isDone: !item.isDone }, index)}
                            />
                            <Button text="Delete" onClick={() => deleteItem(item, index)} />
                        </li>
                    ))
                ) : (
                    <h2>No items yet...</h2>
                )}
            </ul>
            <button onClick={openModal}>Open Modal</button>
            <Modal
                shouldCloseOnEsc
                shouldCloseOnOverlayClick
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{ content: { maxWidth: '500px', margin: 'auto' }}}
            >
                {
                    shouldDisplayEditForm.current && todoList && (itemToEditIndex.current !== null) ? (
                        <EditItemForm onSubmit={saveEditedItem} itemToEdit={todoList?.items[itemToEditIndex.current]} />
                    ): (
                        <CreateItemForm onSubmit={createNewItem} />
                    )
                }
                <button onClick={closeModal}>Cancel</button>
            </Modal>
        </Layout>
    );
};

export default List;
