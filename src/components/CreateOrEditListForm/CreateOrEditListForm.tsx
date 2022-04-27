import React, { FormEventHandler, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { TodoList } from '../../types';
import { TextInput } from '../Inputs';

import './CreateOrEditListForm.scss';

interface ICreateOrEditListFormProps {
    onSubmit: (value: TodoList) => void;
    listToEdit?: TodoList;
}

const CreateOrEditListForm: React.FC<ICreateOrEditListFormProps> = ({ onSubmit, listToEdit = null }) => {
    const [inputText, setInputText] = useState<string>(listToEdit?.name || '');

    const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!inputText.length) return;

        const newTodoList: TodoList = {
            name: inputText,
            items: listToEdit?.items || [],
            id: listToEdit?.id || uuidv4(),
        };

        onSubmit(newTodoList);
        setInputText('');
    };

    return (
        <form onSubmit={handleFormSubmit} className="form">
            <TextInput
                label="List name"
                id="todo-list-name"
                onChange={(e) => setInputText(e.target.value)}
                value={inputText}
                placeholder="Enter name here"
            />
            <button className="form__submit-btn" type="submit">Save list</button>
        </form>
    );
};

export default CreateOrEditListForm;
