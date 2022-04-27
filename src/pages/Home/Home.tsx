import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import Button from '../../components/Button';
import CreateOrEditListForm from '../../components/CreateOrEditListForm';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import TodoListComponent from '../../components/TodoList';
import useKeyboardPress from '../../hooks/useKeyboardPress';
import getStackId from '../../utils/localStorageStackId';

import { allItemsAreDone } from '../../utils/getTodoListDoneStatus';
import { Action, EActions, EditAction, TReceiver, UndoRedo } from '../../utils/Stack';

import './Home.scss';

// todo: define these in separate types folder
export type TodoList = {
    name: string;
    items: TodoItem[];
    id: string;
};

export type TodoItem = {
    name: string;
    isDone: boolean;
    id: string;
    dueDate?: string;
};

enum StackName {
    undo = 'todoListsUndoStack',
    redo = 'todoListsRedoStack',
}

const Home: React.FC = () => {
    const [todoLists, setTodoLists] = useState<TodoList[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [focusedListIndex, setFocusedListIndex] = useState<number| null>(null);
    const [shouldDisplayRedo, setShouldDisplayRedo] = useState<boolean>(false);
    
    const isInitialLoad = useRef<boolean>(true);
    const listToEditIndex = useRef<number | null>(null);
    const lastAction = useRef<Action | null>(null);
    const isUndoRedoAction = useRef<boolean>(false);
    const metaKeyIsPressed = useRef<boolean>(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const createNewList = (newTodoList: TodoList, listIndex: number | null = null) => {
        setTodoLists((prev) => {
            const indexToUse = typeof listIndex === 'number' ? listIndex : prev.length;
            const newLists = [...prev];

            newLists.splice(indexToUse, 0, newTodoList);

            lastAction.current = {
                index: prev.length,
                type: EActions.Add,
                value: newTodoList,
            };

            return newLists;
        });
    };

    const handleEditBtnClick = (listIndex: number) => {
        // todo: hook 1, extract this into a separate hook (also search for hook 2)
        listToEditIndex.current = listIndex;
        openModal();
    };

    const saveEditedList = (editedList: TodoList, index: number | null = null) => {
        setTodoLists((prev) => {
            const indexToUse = typeof index === 'number' ? index : listToEditIndex.current;

            if (indexToUse !== null) {
                const editedLists: TodoList[] = [
                    ...prev.slice(0, indexToUse),
                    editedList,
                    ...prev.slice(indexToUse + 1),
                ];

                lastAction.current = {
                    index: indexToUse,
                    type: EActions.Edit,
                    value: editedList,
                    previousValue: prev[indexToUse],
                };
            
                return editedLists;
            } else {
                return prev;
            }
        });
    };

    const clearListStacks = (id: string) => {
        localStorage.removeItem(getStackId('undo', id));
        localStorage.removeItem(getStackId('redo', id));
    };

    const deleteList = (list: TodoList, listIndex: number) => {
        setTodoLists((prev) => {
            const updatedLists = [
                ...prev.slice(0, listIndex),
                ...prev.slice(listIndex + 1),
            ];

            lastAction.current = {
                index: listIndex,
                type: EActions.Remove,
                value: list,
            };

            return updatedLists;
        });
    };

    const receiver: TReceiver = useMemo(() => ({
        [EActions.Add]: {
            execute: (action) => createNewList((action.value as TodoList), action.index),
            undo: (action) => deleteList((action.value as TodoList), action.index),
        },
        [EActions.Remove]: {
            execute: (action) => deleteList((action.value as TodoList), action.index),
            undo: (action) => createNewList((action.value as TodoList), action.index),
        },
        [EActions.Edit]: {
            execute: (action: EditAction) => saveEditedList((action.value as TodoList), action.index),
            undo: (action: EditAction) => saveEditedList((action.previousValue as TodoList), action.index),
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

            if (typeof focusedListIndex === 'number') {
                e.preventDefault();
            }
        }  
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (metaKeyIsPressed.current) {
            e.preventDefault();
            metaKeyIsPressed.current = false;

            if (typeof focusedListIndex === 'number') {
                const todoList = todoLists[focusedListIndex];
                
                if (e.code === 'Backspace') {
                    deleteList(todoList, focusedListIndex);
                } else if (e.code === 'KeyE') {
                    handleEditBtnClick(focusedListIndex);
                } else if (e.code === 'KeyF') {
                    toggleItemsDoneStatus(focusedListIndex);
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

    const toggleItemsDoneStatus = (listIndex: number) => {
        const listIsDone = allItemsAreDone(todoLists[listIndex]);
        const listCopy: TodoList = { ...todoLists[listIndex] };
        const listItemsCopy = listCopy.items.map((item) => ({ ...item, isDone: !listIsDone }));

        const editedList: TodoList = {
            ...listCopy,
            items: listItemsCopy,
        };

        saveEditedList(editedList, listIndex);
    };

    useLayoutEffect(() => {
        if (isInitialLoad.current) {
            const todoListsFromMemory: TodoList[] = JSON.parse(localStorage.getItem('todoLists')  || '[]');

            setTodoLists(todoListsFromMemory);

            const undoStackFromMemory: Action[] = JSON.parse(localStorage.getItem(StackName.undo) || '[]');
            const redoStackFromMemory: Action[] = JSON.parse(localStorage.getItem(StackName.redo) || '[]');
            
            undoRedo.current = new UndoRedo(receiver, undoStackFromMemory, redoStackFromMemory);
        }
    }, [receiver]);

    useEffect(() => {
        if (!modalIsOpen) {
            // todo: hook2 extract this into the same hook as hook 1 (e.g. useEditModal)
            if (typeof listToEditIndex.current === 'number' ) {
                listToEditIndex.current = null;
            }
        }
    }, [modalIsOpen]);

    // extract this into separate hook (e.g. useInitialLoad)
    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
        } else {
            localStorage.setItem('todoLists', JSON.stringify(todoLists));
        }

        if (!isUndoRedoAction.current && lastAction.current) {
            undoRedo.current.pushNewUndoAction(lastAction.current);
            undoRedo.current.redoStack.empty();
        }

        if (lastAction.current?.type === EActions.Remove) {
            clearListStacks(lastAction.current.value.id);
        }

        if (isUndoRedoAction.current) isUndoRedoAction.current = false;

        localStorage.setItem(StackName.undo, JSON.stringify(undoRedo.current.undoStack.instance));
        localStorage.setItem(StackName.redo, JSON.stringify(undoRedo.current.redoStack.instance));

        setShouldDisplayRedo(undoRedo.current.redoStack.isEmpty);
        closeModal();
    }, [todoLists]);

    useKeyboardPress(handleKeyUp, handleKeyDown);

    return (
        <Layout>
            <div className="list-container">
                <div className="list-container__header">
                    <h2 className="list-container__title">All lists</h2>
                    <div className="btn-group">
                        <Button
                            text="Undo"
                            className="list-container__btn--undo-redo"
                            disabled={undoRedo.current.undoStack.isEmpty}
                            onClick={undo}
                        />
                        <Button
                            text="Redo"
                            className="list-container__btn--undo-redo"
                            disabled={shouldDisplayRedo}
                            onClick={redo}
                        />
                    </div>
                </div>
                <div className="list-container__body">
                    <ul>
                        {todoLists.length ? (
                            todoLists.map((list, index) => (
                                <TodoListComponent
                                    list={list}
                                    key={list.id}
                                    onToggleDoneBtnClick={() => toggleItemsDoneStatus(index)}
                                    onDeleteBtnClick={() => deleteList(list, index)}
                                    onEditBtnClick={() => handleEditBtnClick(index)}
                                    onFocus={() => setFocusedListIndex(index)}
                                />
                            ))
                        ) : (
                            <div className="empty-state-container">
                                <h3 className="empty-state-container__title">
                                    Add a list to get started
                                </h3>
                                <button
                                    className="empty-state-container__btn"
                                    onClick={openModal}
                                >
                                    Create new
                                </button>
                            </div>
                        )}
                    </ul>
                </div>
                {Boolean(todoLists.length) && (
                    <button
                        className="list-container__btn--open-modal"
                        onClick={openModal}
                    >
                        Create new
                    </button>
                )}
            </div>
            <Modal
                isOpen={modalIsOpen}
                close={closeModal}
            >
                {
                    listToEditIndex.current !== null ? (
                        <CreateOrEditListForm
                            onSubmit={saveEditedList}
                            listToEdit={todoLists[listToEditIndex.current]}
                        />
                    ) : (
                        <CreateOrEditListForm onSubmit={createNewList} />
                    )
                }
            </Modal>
        </Layout>
    );
};

export default Home;
