import React, { MouseEventHandler } from 'react';

interface IButtonProps {
    text: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    className?: string;
    renderCondition?: boolean;
    disabled?: boolean;
}

const Button: React.FC<IButtonProps> = ({
    text,
    onClick,
    className = '',
    disabled = false,
    renderCondition = true
}) => {
    if (!renderCondition) return null;

    return (
        <button
            className={className}
            disabled={disabled}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;
