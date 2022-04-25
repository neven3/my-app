import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Modal from 'react-modal';

import { useParams } from 'react-router-dom';

import Button from '../../components/Button';
import CreateItemForm from '../../components/CreateItemForm';
import EditItemForm from '../../components/EditItemForm';
import Layout from '../../components/Layout';

import { TodoItem, TodoList } from '../Home/Home';

Modal.setAppElement('#root');

const List: React.FC = () => {
    const [todoList, setTodoList] = useState<TodoList | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const shouldDisplayEditForm = useRef<boolean>(false);
    const itemToEditIndex = useRef<number | null>(null);

    const { listId } = useParams();

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const deleteItem = (itemIndex: number) => {
        if (todoList?.items) {
            const newItemsList = [...todoList?.items.slice(0, itemIndex), ...todoList?.items.slice(itemIndex + 1)];
            const todoListCopy: TodoList = { ...todoList, items: newItemsList };

            setTodoList(todoListCopy);
        }
    };

    const toggleItemIsDone = (itemIndex: number) => {
        if (todoList?.items) {
            const itemCopy = { ...todoList.items[itemIndex] };

            itemCopy.isDone = !itemCopy.isDone;

            const newItemsList = [
                ...todoList?.items.slice(0, itemIndex),
                itemCopy,
                ...todoList?.items.slice(itemIndex + 1),
            ];

            const todoListCopy: TodoList = { ...todoList, items: newItemsList };

            setTodoList(todoListCopy);
        }
    };

    const createNewItem = (newTodoItem: TodoItem) => {
        setTodoList((prev) => {
            if (prev) {
                const newItemList: TodoItem[] = [...prev?.items, newTodoItem];
                const listCopy: TodoList = {
                    ...prev,
                    items: newItemList,
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

    const saveEditedItem = (editedItem: TodoItem) => {
        setTodoList((prev) => {
            if (prev && itemToEditIndex.current !== null) {
                const editedItemList: TodoItem[] = [
                    ...prev.items.slice(0, itemToEditIndex.current),
                    editedItem,
                    ...prev.items.slice(itemToEditIndex.current + 1),
                ];

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

    useEffect(() => {
        const todoListsFromMemory: TodoList[] = JSON.parse(localStorage.getItem('todoLists')  || '[]');

        if (todoListsFromMemory.length) {
            const currentListIndex = todoListsFromMemory.findIndex((list) => list.id === listId);

            if (currentListIndex !== -1 && todoList) {
                todoListsFromMemory[currentListIndex] = todoList;

                localStorage.setItem('todoLists', JSON.stringify(todoListsFromMemory));
            }
        }

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
    }, [listId]);

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
            <ul>
                {todoList?.items.length ? (
                    todoList.items.map((item, index) => (
                        // todo: this should be a separate component
                        <li style={{ marginBottom: '10px' }} onFocus={() => console.log(item.name)} tabIndex={0} key={item.id}>
                            <span style={{ margin: '10px' }}>{item.name}</span>
                            <span style={{ margin: '10px' }}>{item.isDone ? 'Done' : 'Not done'}</span>
                            {/* todo: extract this into a function or something */}
                            {item.dueDate && <span style={{ margin: '10px' }}>Due by: {item.dueDate.replaceAll('-', '/').split('T').join(' at ')}</span>}
                            {/* todo: extract these handlers into functions */}
                            <Button text="Edit" onClick={() => handleEditBtnClick(index)} />
                            <Button text={`Mark as ${item.isDone ? 'not' : ''} done`} onClick={() => toggleItemIsDone(index)} />
                            <Button text="Delete" onClick={() => deleteItem(index)} />
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
