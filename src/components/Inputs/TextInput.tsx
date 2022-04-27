import React, { ChangeEventHandler } from 'react';

import './Inputs.scss';

interface ITextInputProps {
    onChange: ChangeEventHandler<HTMLInputElement>;
    value: string;
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
}

const TextInput: React.FC<ITextInputProps> = ({
    onChange,
    value,
    id,
    label = '',
    placeholder = '',
    required = false,
}) => (
    <>
        <label className="label" htmlFor={id}>{label}</label>
        <input
            required={required}
            className="input input--text"
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
