import React, { useState } from 'react';

import { TodoItem } from '../../pages/Home/Home';


interface IEditItemFormProps {
    onSubmit: (value: TodoItem) => void;
    itemToEdit: TodoItem;
}

const EditItemForm: React.FC<IEditItemFormProps> = ({ onSubmit, itemToEdit }) => {
    const [inputText, setInputText] = useState<string>(itemToEdit.name);

    return (
        // todo: create a function for this
        <form onSubmit={(e) => {
                e.preventDefault();

                if (!inputText.length) return;

                const newTodoItem: TodoItem = {
                    ...itemToEdit,
                    name: inputText,
                    // isDone: false,
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
            <button type="submit">Save</button>
      </form>
    );
};

export default EditItemForm;