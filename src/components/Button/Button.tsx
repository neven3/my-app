import React, { MouseEventHandler } from 'react';

interface IButtonProps {
    text: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    renderCondition?: boolean;
    disabled?: boolean;
}

const Button: React.FC<IButtonProps> = ({
    text,
    onClick,
    disabled = false,
    renderCondition = true
}) => {
    if (!renderCondition) return null;

    return (
        <button disabled={disabled} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
