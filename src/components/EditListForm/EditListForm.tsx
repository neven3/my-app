import React, { useState } from 'react';

import { TodoList } from '../../pages/Home/Home';

interface IEditListFormProps {
    onSubmit: (value: TodoList) => void;
    listToEdit: TodoList;
}


const EditListForm: React.FC<IEditListFormProps> = ({ onSubmit, listToEdit }) => {
    const [inputText, setInputText] = useState<string>(listToEdit.name);

    return (
        // todo: create a function for this
        <form onSubmit={(e) => {
                e.preventDefault();

                if (!inputText.length) return;

                const editedTodoList: TodoList = {
                    ...listToEdit,
                    name: inputText,
                };

                onSubmit(editedTodoList);
                setInputText('');
            }}
        >
            <label htmlFor="todo-list-name">Todo-list name</label>
            <input
            // todo: create a function for this
                onChange={(e) => setInputText(e.target.value)}
                value={inputText}
                type="text"
                name="todo-list-name"
                id="todo-list-name"
                placeholder="Enter name here"
            />
            <button type="submit">Save</button>
      </form>
    );
};

export default EditListForm;
