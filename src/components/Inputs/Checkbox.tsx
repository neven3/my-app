import React, { ChangeEventHandler } from 'react';

interface ICheckboxProps {
    id: string;
    checked: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
    label?: string;
}

const Checkbox: React.FC<ICheckboxProps> = ({
    id,
    checked,
    onChange,
    label = '',
}) => (
    <>
        <label htmlFor={id}>{label}</label>
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            name={id}
            id={id}
        />
    </>
);

export default Checkbox;
