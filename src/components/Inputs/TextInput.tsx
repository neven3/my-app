import React, { ChangeEventHandler } from 'react';

interface ITextInputProps {
    onChange: ChangeEventHandler<HTMLInputElement>;
    value: string;
    id: string;
    label?: string;
    placeholder?: string;
}

const TextInput: React.FC<ITextInputProps> = ({
    onChange,
    value,
    id,
    label = '',
    placeholder = '',
}) => (
    <>
        <label htmlFor={id}>{label}</label>
        <input
            onChange={onChange}
            value={value}
            type="text"
            name={id}
            id={id}
            placeholder={placeholder}
        />
    </>
);

export default TextInput;
