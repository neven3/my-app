import React, { useState } from 'react';

import { TodoItem } from '../../pages/Home/Home';


interface IEditItemFormProps {
    onSubmit: (value: TodoItem) => void;
    itemToEdit: TodoItem;
}

const EditItemForm: React.FC<IEditItemFormProps> = ({ onSubmit, itemToEdit }) => {
    const [inputText, setInputText] = useState<string>(itemToEdit.name);
    const [isDone, setIsDone] = useState<boolean>(itemToEdit.isDone);

    return (
        // todo: create a function for this
        <form onSubmit={(e) => {
                e.preventDefault();

                if (!inputText.length) return;

                const newTodoItem: TodoItem = {
                    ...itemToEdit,
                    isDone,
                    name: inputText,
                };

                onSubmit(newTodoItem);
                setInputText('');
            }}
        >
            <label htmlFor="todo-item-name">Todo-item name</label>
            <input
            // todo: create a function for this
                onChange={(e) => setInputText(e.target.value)}
                value={inputText}
                type="text"
                name="todo-item-name"
                id="todo-item-name"
                placeholder="Enter name here"
            />
            <label htmlFor="todo-item-isDone">Mark as done</label>
            <input
                type="checkbox"
                checked={isDone}
                onChange={(e) => setIsDone(e.target.checked)}
                name="todo-item-isDone"
                id="todo-item-isDone"
            />
            <button type="submit">Save</button>
        </form>
    );
};

export default EditItemForm;