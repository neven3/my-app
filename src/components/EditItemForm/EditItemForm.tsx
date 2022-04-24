import React, { useState } from 'react';

import getDateAndTime from '../../utils/getCurrentDateAndTime';

import { TodoItem } from '../../pages/Home/Home';

interface IEditItemFormProps {
    onSubmit: (value: TodoItem) => void;
    itemToEdit: TodoItem;
}

const EditItemForm: React.FC<IEditItemFormProps> = ({ onSubmit, itemToEdit }) => {
    const [inputText, setInputText] = useState<string>(itemToEdit.name);
    const [isDone, setIsDone] = useState<boolean>(itemToEdit.isDone);
    const [dueDate, setDueDate] = useState<string>(itemToEdit.dueDate || '');

    return (
        // todo: create a function for this
        <form onSubmit={(e) => {
                e.preventDefault();

                if (!inputText.length) return;

                const newTodoItem: TodoItem = {
                    ...itemToEdit,
                    ...(dueDate && { dueDate }),
                    isDone,
                    name: inputText,
                };

                onSubmit(newTodoItem);
                setInputText('');
            }}
        >
            <label htmlFor="todo-item-name">Todo-item name*</label>
            <input
            // todo: create a function for this
                required
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
            <label htmlFor="todo-item-dueDate">Due date and time (optional)</label>
            <input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                // todo: decide whether to use item.dueDate as min value
                min={getDateAndTime()}
                type="datetime-local"
                name="todo-item-dueDate"
                id="todo-item-dueDate"
            />
            <button type="submit">Save</button>
        </form>
    );
};

export default EditItemForm;