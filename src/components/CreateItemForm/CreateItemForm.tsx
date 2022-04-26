import React, { FormEventHandler, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import getDateAndTime from '../../utils/getCurrentDateAndTime';

import { TodoItem } from '../../pages/Home/Home';
import { Checkbox, DateTimePicker, TextInput } from '../Inputs';

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

    const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
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
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <TextInput
                id="todo-item-name"
                label="Item name"
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter name here"
                value={inputText}
            />
            <Checkbox
                checked={isDone}
                onChange={(e) => setIsDone(e.target.checked)}
                label="Mark as done"
                id="todo-item-isDone"
            />
            <DateTimePicker
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={getDateAndTime()}
                id="todo-item-dueDate"
            />
            <button type="submit">Save</button>
        </form>
    );
};

export default CreateItemForm;