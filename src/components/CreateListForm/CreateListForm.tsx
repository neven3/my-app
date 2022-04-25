import React, { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { TodoList } from '../../pages/Home/Home';


interface ICreateListFormProps {
    onSubmit: (value: TodoList) => void;
}

const CreateListForm: React.FC<ICreateListFormProps> = ({ onSubmit }) => {
    const [inputText, setInputText] = useState<string>('');

    return (
        // todo: create a function for this
        <form onSubmit={(e) => {
                e.preventDefault();

                if (!inputText.length) return;

                const newTodoList: TodoList = {
                    name: inputText,
                    items: [],
                    id: uuidv4(),
                };

                onSubmit(newTodoList);
                setInputText('');
            }}
        >
            <input
            // todo: create a function for this
                onChange={(e) => setInputText(e.target.value)}
                value={inputText}
                type="text"
                name="todo-list-name"
                id="todo-list-name"
                placeholder="Enter name here"
            />
            <label htmlFor="todo-list-name">Todo-list name</label>
            <button type="submit">Create list</button>
        </form>
    );
};

export default CreateListForm;
