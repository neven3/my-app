import React, { ChangeEventHandler } from 'react';

interface IDateTimePickerProps {
    id: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    value: string;
    min?: string;
    label?: string;
}

const DateTimePicker: React.FC<IDateTimePickerProps> = ({
    id,
    onChange,
    value,
    min = '',
    label = '',
}) => (
    <>
        <label htmlFor={id}>{label}</label>
        <input
            value={value}
            onChange={onChange}
            { ...{ min }}
            type="datetime-local"
            name={id}
            id={id}
        />
    </>
);

export default DateTimePicker;
