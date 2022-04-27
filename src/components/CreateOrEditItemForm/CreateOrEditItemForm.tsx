import React, { FormEventHandler, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import getDateAndTime from '../../utils/getCurrentDateAndTime';

import { TodoItem } from '../../pages/Home/Home';
import { Checkbox, DateTimePicker, TextInput } from '../Inputs';

interface ICreateItemFormProps {
    onSubmit: (value: TodoItem) => void;
    itemToEdit?: TodoItem;
}

const CreateOrEditItemForm: React.FC<ICreateItemFormProps> = ({ onSubmit, itemToEdit = null }) => {
    const [inputText, setInputText] = useState<string>(itemToEdit?.name || '');
    const [isDone, setIsDone] = useState<boolean>(itemToEdit?.isDone || false);
    const [dueDate, setDueDate] = useState<string>(itemToEdit?.dueDate || '');

    const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
         e.preventDefault();

        if (!inputText.length) return;

        const newTodoItem: TodoItem = {
            ...(dueDate && { dueDate }),
            id: itemToEdit?.id || uuidv4(),
            isDone,
            name: inputText,
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

export default CreateOrEditItemForm;