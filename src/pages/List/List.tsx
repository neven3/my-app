import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { useParams } from 'react-router-dom';

import Button from '../../components/Button';
import CreateItemForm from '../../components/CreateItemForm';
import Layout from '../../components/Layout';

import { TodoItem, TodoList } from '../Home/Home';

Modal.setAppElement('#root');

const List: React.FC = () => {
    const [todoList, setTodoList] = useState<TodoList | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const { listId } = useParams();

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const deleteItem = (itemId: string) => {
        const itemIndex = todoList?.items.findIndex((item) => item.id === itemId);

        if (todoList?.items && itemIndex) {
            const newItemsList = [...todoList?.items.slice(0, itemIndex), ...todoList?.items.slice(itemIndex + 1)];
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
                return null;
            }
        });

        closeModal();
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
    }, [todoList, listId]);

    useEffect(() => {
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
                    todoList.items.map((item) => (
                        // todo: this should be a separate component
                        <li style={{ marginBottom: '10px' }} onFocus={() => console.log(item.name)} tabIndex={0} key={item.id}>
                            <span style={{ margin: '10px' }}>{item.name}</span>
                            {/* <Button text={`Mark as ${!item.isDone && 'not'} done`} onClick={() => console.log('Done button clicked')} /> */}
                            {/* <Button text="Edit" onClick={() => console.log('Edit button clicked')} /> */}
                            <Button text="Delete" onClick={() => deleteItem(item.id)} />
                        </li>
                    ))
                ) : (
                    <h2>No items yet...</h2>
                )}
            </ul>
            <button onClick={openModal}>Open Modal</button>
            <Modal
                isOpen={modalIsOpen}
                style={{ content: { maxWidth: '500px', margin: 'auto' }}}
            >
                <CreateItemForm onSubmit={createNewItem} />
                <button onClick={closeModal}> X </button>
            </Modal>
        </Layout>
    );
};

export default List;
