import React, { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import getDateAndTime from '../../utils/getCurrentDateAndTime';

import { TodoItem } from '../../pages/Home/Home';

interface ICreateItemFormProps {
    onSubmit: (value: TodoItem) => void;
}

// todo: this and EditItemForm should be just one component
    // accept optional itemToEdit prop and set initial values
        // also set id if an item doesn't have one
const CreateItemForm: React.FC<ICreateItemFormProps> = ({ onSubmit }) => {
    const [inputText, setInputText] = useState<string>('');
    const [isDone, setIsDone] = useState<boolean>(false);
    const [dueDate, setDueDate] = useState<string>('');

    return (
        // todo: create a function for this
        <form onSubmit={(e) => {
                e.preventDefault();

                if (!inputText.length) return;

                const newTodoItem: TodoItem = {
                    ...(dueDate && { dueDate }),
                    isDone,
                    name: inputText,
                    id: uuidv4(),
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
                // todo: create a function for this
                onChange={(e) => setIsDone(e.target.checked)}
                name="todo-item-isDone"
                id="todo-item-isDone"
            />
            <label htmlFor="todo-item-dueDate">Due date and time (optional)</label>
            <input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={getDateAndTime()}
                type="datetime-local"
                name="todo-item-dueDate"
                id="todo-item-dueDate"
            />
            <button type="submit">Create item</button>
        </form>
    );
};

export default CreateItemForm;