import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Modal from 'react-modal';

import { Link } from 'react-router-dom';

import Button from '../../components/Button';
import CreateListForm from '../../components/CreateListForm';
import EditListForm from '../../components/EditListForm';
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

const Home: React.FC = () => {
    console.log('Rendering Home')
    const [todoLists, setTodoLists] = useState<TodoList[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    
    const isInitialLoad = useRef<boolean>(true);
    const shouldDisplayEditForm = useRef<boolean>(false);
    const listToEditIndex = useRef<number | null>(null);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const createNewList = (newTodoList: TodoList) => {
        setTodoLists((prev) => [...prev, newTodoList]);
        closeModal();
    };

    const handleEditBtnClick = (itemIndex: number) => {
        // todo: hook 1, extract this into a separate hook (also search for hook 2)
        shouldDisplayEditForm.current = true;
        listToEditIndex.current = itemIndex;
        openModal();
    };

    const saveEditedList = (editedList: TodoList) => {
        setTodoLists((prev) => {
            if (listToEditIndex.current !== null) {
                const editedLists: TodoList[] = [
                    ...prev.slice(0, listToEditIndex.current),
                    editedList,
                    ...prev.slice(listToEditIndex.current + 1),
                ];

                return editedLists;
            } else {
                return prev;
            }
        });
    };

    const deleteList = (listIndex: number) => {
        const updatedLists = [
            ...todoLists.slice(0, listIndex),
            ...todoLists.slice(listIndex + 1),
        ];

        setTodoLists(updatedLists);
    };

    const toggleItemsDoneStatus = (listIndex: number) => {
        const listIsDone = allItemsAreDone(listIndex);
        const listCopy = { ...todoLists[listIndex] };
        const listItemsCopy = listCopy.items.map((item) => ({ ...item, isDone: !listIsDone }));

        const updatedLists = [
            ...todoLists.slice(0, listIndex),
            { ...listCopy, items: listItemsCopy },
            ...todoLists.slice(listIndex + 1),
        ];

        setTodoLists(updatedLists);
    };

    const getDoneRatio = (listIndex: number) => {
        const doneItemsCount = todoLists[listIndex].items.filter((item) => item.isDone).length;

        return [doneItemsCount, todoLists[listIndex].items.length];
    };

    const allItemsAreDone = (listIndex: number) => {
        const [doneCount, allCount] = getDoneRatio(listIndex);

        return doneCount === allCount;
    };

    useLayoutEffect(() => {
        if (isInitialLoad.current) {
            const todoListsFromMemory: TodoList[] = JSON.parse(localStorage.getItem('todoLists')  || '[]');

            setTodoLists(todoListsFromMemory);
        }
    }, []);

    useEffect(() => {
        if (!modalIsOpen) {
            // todo: hook2 extract this into the same hook as hook 1 (e.g. useEditModal)
            if (typeof listToEditIndex.current === 'number' ) {
                listToEditIndex.current = null;
            }

            if (shouldDisplayEditForm.current) {
                shouldDisplayEditForm.current = false;
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

        closeModal();
    }, [todoLists]);

    return (
        <Layout>
            <h1>All lists:</h1>
            <ul>
                {todoLists.length ? (
                    todoLists.map(({ name, id, items }, index) => (
                    // todo: extract into separate component
                    <li
                        style={{ marginBottom: '10px' }}
                        onFocus={() => console.log({ name })}
                        tabIndex={0}
                        key={id}
                    >
                        <Link to={`/list/${id}`} style={{ margin: '10px' }}>
                            {name}
                        </Link>
                        {/* todo: change this to a single span with the condition inside text (declare a variable and remove logic from JSX) */}
                        {items.length > 0 ? (
                            <span style={{ margin: '10px' }}>Done items: {getDoneRatio(index).join('/')}</span>
                        ) : (
                            <span style={{ margin: '10px' }}>Empty</span>
                        )}
                        <Button text="Edit" onClick={() => handleEditBtnClick(index)} />
                        <Button
                            renderCondition={items.length > 0}
                            text={`Mark all as ${allItemsAreDone(index) ? 'not' : ''} done`} 
                            onClick={() => toggleItemsDoneStatus(index)}
                        />
                        <Button text="Delete" onClick={() => deleteList(index)} />

                    </li>
                    ))
                ) : (
                    <h2>No lists yet...</h2>
                )}
            </ul>
            <button onClick={openModal}>Open Modal</button>
            {/* todo: extract modal into one component for Home.tsx and List.tsx */}
            <Modal
                shouldCloseOnEsc
                shouldCloseOnOverlayClick
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{ content: { maxWidth: '500px', margin: 'auto' }}}
            >
                {
                    shouldDisplayEditForm.current && todoLists.length && (listToEditIndex.current !== null) ? (
                        <EditListForm onSubmit={saveEditedList} listToEdit={todoLists[listToEditIndex.current]} />
                    ) : (
                        <CreateListForm onSubmit={createNewList} />
                    )
                }
                <button onClick={closeModal}>Cancel</button>
            </Modal>
        </Layout>
    );
};

export default Home;
