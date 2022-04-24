import React from 'react';

interface IButtonProps {
    text: string;
    onClick: () => void;
    renderCondition?: boolean;
}

const Button: React.FC<IButtonProps> = ({ text, onClick, renderCondition = true }) => {
    if (!renderCondition) return null;

    return (
        <button onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
