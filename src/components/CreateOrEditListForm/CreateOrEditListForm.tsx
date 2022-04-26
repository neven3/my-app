import React, { FormEventHandler, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { TodoList } from '../../pages/Home/Home';
import { TextInput } from '../Inputs';


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
        <form onSubmit={handleFormSubmit}>
            <TextInput
                label="List name"
                id="todo-list-name"
                onChange={(e) => setInputText(e.target.value)}
                value={inputText}
                placeholder="Enter name here"
            />
            <button type="submit">Create list</button>
        </form>
    );
};

export default CreateOrEditListForm;
