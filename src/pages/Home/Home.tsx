import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { Link } from 'react-router-dom';

import CreateListForm from '../../components/CreateListForm';
import Layout from '../../components/Layout';

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

const todoListsFromMemory: TodoList[] = JSON.parse(localStorage.getItem('todoLists')  || '[]');
// todo: delete logs
console.log({ todoListsFromMemory });

const Home: React.FC = () => {
    console.log('Rendering Home')
    const [todoLists, setTodoLists] = useState<TodoList[]>(todoListsFromMemory);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const createNewList = (newTodoList: TodoList) => {
        setTodoLists((prev) => [...prev, newTodoList ]);
    };

    useEffect(() => {
        localStorage.setItem('todoLists', JSON.stringify(todoLists));
    }, [todoLists]);

    return (
        <Layout>
            <h1>All lists:</h1>
            <ul>
                {todoLists.map(({name, id}) => (
                    <li tabIndex={0} key={id}>
                        <Link to={`/list/${id}`}>
                            {name}
                        </Link>
                    </li>
                ))}
            </ul>
            <button onClick={openModal}>Open Modal</button>
            <Modal
                isOpen={modalIsOpen}
                style={{ content: { maxWidth: '500px', margin: 'auto' }}}
            >
                <CreateListForm onSubmit={createNewList} />
                <button onClick={closeModal}> X </button>
            </Modal>
        </Layout>
    );
};

export default Home;
