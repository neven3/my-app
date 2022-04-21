import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { useParams } from 'react-router-dom';

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
                        <li onFocus={() => console.log(item.name)} tabIndex={0} key={item.id}>{item.name}</li>
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
