import React, { ChangeEventHandler } from 'react';

interface ICheckboxProps {
    id: string;
    checked: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
    label?: string;
    required?: boolean;
}

const Checkbox: React.FC<ICheckboxProps> = ({
    id,
    checked,
    onChange,
    label = '',
    required = false,
}) => (
    <>
        <label className="label--checkbox" htmlFor={id}>{label}</label>
        <input
            required={required}
            className="input input--checkbox"
            type="checkbox"
            checked={checked}
            onChange={onChange}
            name={id}
            id={id}
        />
    </>
);

export default Checkbox;
