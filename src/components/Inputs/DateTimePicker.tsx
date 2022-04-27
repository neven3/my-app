import React, { ChangeEventHandler } from 'react';

import './Inputs.scss';

interface IDateTimePickerProps {
    id: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    value: string;
    min?: string;
    label?: string;
    required?: boolean;
}


const DateTimePicker: React.FC<IDateTimePickerProps> = ({
    id,
    onChange,
    value,
    min = '',
    label = '',
    required = false,
}) => (
    <>
        <label htmlFor={id}>{label}</label>
        <input
            required={required}
            className="input input--datepicker"
            value={value}
            onChange={onChange}
            { ...{ min } }
            type="datetime-local"
            name={id}
            id={id}
        />
    </>
);

export default DateTimePicker;
